import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

export async function sendSupportEmail({
  name,
  email,
  issue
}: {
  name: string;
  email: string;
  issue: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'support@sloanex.local',
    to: ['insanitybjones@gmail.com'],
    subject: 'SloaneX Support Request',
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Issue:</strong></p>
      <p>${issue}</p>
    `
  });
}

export async function sendNewContentEmails({
  recipients,
  magicLinks
}: {
  recipients: string[];
  magicLinks: Record<string, string>;
}) {
  if (!process.env.RESEND_API_KEY || recipients.length === 0) return;
  const from = process.env.RESEND_FROM ?? 'updates@sloanex.local';

  await Promise.all(
    recipients.map((email) =>
      resend.emails.send({
        from,
        to: [email],
        subject: 'New SloaneX Release',
        html: `
          <p>New exclusive content released today view now!</p>
          <p>
            <a
              href="${process.env.APP_URL ?? 'http://localhost:3000'}/magic?token=${
          magicLinks[email]
        }"
              style="display:inline-block;background:#5a189a;color:#fff4f9;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;"
            >
              View Exclusive Content
            </a>
          </p>
        `
      })
    )
  );
}
