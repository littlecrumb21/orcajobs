import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Orca Jobs <hello@orca.jobs>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://orca.jobs";

async function send(to: string, subject: string, html: string) {
  await resend.emails.send({ from: FROM, to, subject, html });
}

function wrap(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:Geist,ui-sans-serif,sans-serif;background:#f6f4ef;margin:0;padding:40px 20px}
  .card{background:#fff;border-radius:16px;padding:40px;max-width:560px;margin:0 auto;box-shadow:0 4px 18px -8px rgba(15,29,44,.15)}
  .logo{font-family:Newsreader,Georgia,serif;font-size:22px;color:#0f1d2c;margin-bottom:32px}
  h1{font-family:Newsreader,Georgia,serif;font-weight:400;font-size:28px;color:#0f1d2c;margin:0 0 16px}
  p{color:#2c3a4a;line-height:1.6;margin:0 0 16px;font-size:15px}
  .btn{display:inline-block;background:#ff6a4d;color:#fff;padding:12px 24px;border-radius:99px;text-decoration:none;font-weight:500;font-size:14px}
  .footer{margin-top:32px;font-size:12px;color:#6e7886;text-align:center}
</style></head><body>
<div class="card">
  <div class="logo">Orca Jobs</div>
  ${body}
  <div class="footer">
    Orca Jobs · Isle of Wight · <a href="${APP_URL}/privacy" style="color:#6e7886">Privacy Policy</a>
  </div>
</div></body></html>`;
}

export const email = {
  welcome: (to: string, name: string) =>
    send(to, "Welcome to Orca Jobs", wrap(`
      <h1>Welcome, ${name}</h1>
      <p>Great to have you on Orca Jobs — the Isle of Wight's modern jobs platform.</p>
      <p>Build your profile, upload your CV, and let local employers find you.</p>
      <a class="btn" href="${APP_URL}/applicant/profile">Complete your profile</a>
    `)),

  welcomeEmployer: (to: string, company: string) =>
    send(to, "Welcome to Orca Jobs — Employer account ready", wrap(`
      <h1>Welcome, ${company}</h1>
      <p>Your employer account is set up. Post your first job in minutes.</p>
      <a class="btn" href="${APP_URL}/employer/jobs/new">Post a job</a>
    `)),

  applicationReceived: (to: string, jobTitle: string, applicantName: string) =>
    send(to, `New application — ${jobTitle}`, wrap(`
      <h1>New application</h1>
      <p>${applicantName} has applied for <strong>${jobTitle}</strong>.</p>
      <a class="btn" href="${APP_URL}/employer/dashboard">View application</a>
    `)),

  applicationConfirm: (to: string, jobTitle: string, company: string) =>
    send(to, `Application submitted — ${jobTitle}`, wrap(`
      <h1>Application submitted</h1>
      <p>Your application for <strong>${jobTitle}</strong> at ${company} has been received.</p>
      <p>We'll let you know when the employer responds.</p>
      <a class="btn" href="${APP_URL}/applicant/dashboard">View your applications</a>
    `)),

  jobApproved: (to: string, jobTitle: string) =>
    send(to, `Your job is live — ${jobTitle}`, wrap(`
      <h1>Your job is live</h1>
      <p><strong>${jobTitle}</strong> has been approved and is now visible to jobseekers on the Isle of Wight.</p>
      <a class="btn" href="${APP_URL}/employer/jobs">Manage your jobs</a>
    `)),

  passwordReset: (to: string, resetUrl: string) =>
    send(to, "Reset your Orca Jobs password", wrap(`
      <h1>Reset your password</h1>
      <p>Click the button below to set a new password. This link expires in 1 hour.</p>
      <a class="btn" href="${resetUrl}">Reset password</a>
      <p style="margin-top:24px;font-size:13px;color:#6e7886">If you didn't request this, you can ignore this email.</p>
    `)),
};
