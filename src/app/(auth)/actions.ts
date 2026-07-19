"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendTelegramAlert } from '@/lib/notifications';
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  let redirectUrl = "/workspace/today";
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
      return { error: "Server configuration error: Supabase URL is missing or invalid." };
    }

    const supabase = await createClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("fetch") || msg.includes("network")) {
        return { error: "Database connection failed. Please check your network or server configuration." };
      }
      if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
        return { error: "Invalid credentials." };
      }
      return { error: error.message };
    }

    // Check role for redirection
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        redirectUrl = "/admin";
      }
    }
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    const errMsg = err?.message?.toLowerCase() || "";
    if (errMsg.includes("fetch") || errMsg.includes("network")) {
      return { error: "Database connection failed." };
    }
    return { error: err?.message || "An unexpected error occurred during login." };
  }

  revalidatePath("/", "layout");
  redirect(redirectUrl);
}

export async function signup(formData: FormData) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
      return { error: "Server configuration error: Supabase URL is missing or invalid." };
    }

    const supabase = await createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://os.cristianvaduva.com";

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        emailRedirectTo: `${siteUrl}/login?verified=true`,
        data: {
          full_name: formData.get("full_name") as string,
        },
      },
    };

    const { error } = await supabase.auth.signUp(data);

  // If sign‑up succeeded, dispatch a Telegram alert (non‑blocking)
  if (!error) {
    try {
      await sendTelegramAlert({
        service: 'User Registration',
        page: '/register',
        name: data.options?.data?.full_name ?? 'N/A',
        phone: 'N/A',
        email: data.email,
        message: undefined,
        source: 'website',
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[AiX] Telegram notification failed for registration:', e);
    }
  }

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("fetch") || msg.includes("network")) {
        return { error: "Database connection failed. Please check your network or server configuration." };
      }
      if (msg.includes("already registered") || msg.includes("already exists")) {
        return { error: "Email already registered." };
      }
      if (msg.includes("weak password") || msg.includes("least 6 characters")) {
        return { error: "Password is too weak. Please use at least 6 characters." };
      }
      if (msg.includes("invalid email") || msg.includes("valid email")) {
        return { error: "Invalid email format." };
      }
      return { error: error.message };
    }
  } catch (err: any) {
    const errMsg = err?.message?.toLowerCase() || "";
    if (errMsg.includes("fetch") || errMsg.includes("network")) {
      return { error: "Database connection failed." };
    }
    return { error: err?.message || "An unexpected error occurred during registration." };
  }

  revalidatePath("/", "layout");
  redirect("/workspace/today");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/");
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://os.cristianvaduva.com";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }
  
  return { success: "Password reset link sent to your email." };
}
