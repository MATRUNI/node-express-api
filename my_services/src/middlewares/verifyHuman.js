
export async function verifyHuman(req, res, next) {
  const turnstileToken = req.body?.turnstileToken || req.headers['x-turnstile-token'];

  if (!turnstileToken) {
    return res.status(400).json({
      error: "Missing Turnstile token"
    });
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_TURNSTILE,
        response: turnstileToken,
        remoteip: req.ip
      })
    }
  );

  const result = await response.json();

  if (!result.success) {
    return res.status(403).json({
      error: "Bot verification failed"
    });
  }

  next();
}