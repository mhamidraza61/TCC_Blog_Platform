const jwt = require("jsonwebtoken");

const COOKIE_NAME = "token";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Signs a JWT and sends it as an httpOnly cookie instead of returning it
// in the response body. "httpOnly" means client-side JavaScript (React,
// browser extensions, an injected malicious script) can never read this
// cookie's value — only the browser itself sends it automatically with
// each request. This is what actually protects the token from XSS
// attacks; storing it in localStorage instead would make it readable by
// any script running on the page, including a malicious one.
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    // secure: true means the browser will only ever send this cookie
    // over HTTPS. Locally (http://localhost) this must be false, or the
    // cookie silently never gets set — that's why it's tied to NODE_ENV.
    secure: process.env.NODE_ENV === "production",
    // "strict" blocks the cookie from being sent on cross-site requests
    // entirely (safest against CSRF). If your deployed frontend and
    // backend end up on different domains and cookies stop showing up,
    // that's the most likely setting to revisit — see DEPLOYMENT.md.
    sameSite: "strict",
    maxAge: THIRTY_DAYS_MS,
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

module.exports = { sendTokenCookie, clearTokenCookie, COOKIE_NAME };
