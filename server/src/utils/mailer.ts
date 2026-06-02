import nodemailer from "nodemailer";

const requiredMailEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"];

function assertMailConfig() {
  const missing = requiredMailEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Email service is not configured. Missing: ${missing.join(", ")}`);
  }
}

const transporter = () => {
  assertMailConfig();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export async function sendOtpEmail(to: string, otp: string) {
  await transporter().sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Share Instead verification code",
    text: `Your Share Instead verification code is ${otp}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>Verify your Share Instead account</h2>
      <p>Use this code to finish creating your account:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</p>
      <p>This code expires in 10 minutes.</p>
    </div>`
  });
}
