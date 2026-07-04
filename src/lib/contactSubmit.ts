export interface ContactPayload {
  service: string;
  page: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  source: string;
  botfield?: string;
  budget?: string;
}

export async function submitContactForm(payload: ContactPayload) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Submission failed");
  }

  return await res.json();
}
