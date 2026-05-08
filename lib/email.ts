import { resend } from "./resend";

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    const data = await resend.emails.send({
      from: "RS-MOTORS <noreply@mail.rsxdev.co.in>",
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}
