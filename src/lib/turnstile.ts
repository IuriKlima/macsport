export async function verifyTurnstile(token: string | undefined | null, request: Request): Promise<boolean> {
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.ALLOW_LOCAL_CAPTCHA_BYPASS === 'true' &&
    isLocalhost
  ) {
    return true;
  }

  if (!token) return false;

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  try {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });

    const verifyJson = await verify.json();
    return !!verifyJson.success;
  } catch (error) {
    return false;
  }
}
