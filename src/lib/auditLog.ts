import { createClient } from '@/lib/supabase/server';

/**
 * Log a password reset attempt.
 */
export async function logPasswordResetAttempt(params: {
  ip: string;
  email: string;
  success: boolean;
  reason: string;
}) {
  try {
    const supabase = await createClient();
    await supabase.from('password_reset_audit').insert({
      ip: params.ip,
      email: params.email,
      success: params.success,
      reason: params.reason,
    });
  } catch (e) {
    console.error('[AiX] Failed to log password reset attempt', e);
  }
}
