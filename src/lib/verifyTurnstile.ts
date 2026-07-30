

/**
 * Verify Cloudflare Turnstile token server‑side.
 * Returns true if the token is valid, otherwise returns false.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('[AiX] TURNSTILE_SECRET_KEY not set');
    return false;
  }
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const params = new URLSearchParams({
    secret,
    response: token,
  });
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: params,
    });
    const data = await res.json();
    return data.success === true;
  } catch (e) {
    console.error('[AiX] Turnstile verification failed', e);
    return false;
  }
}
