import { getLogger } from "./logger";
import { resend } from "./resend";

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  const logger = getLogger();
  try {
    const data = await resend.emails.send({
      from: "RS-MOTORS <noreply@mail.rsxdev.co.in>",
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    logger.error(
      {
        email: to,
        error,
      },
      "Failed to send subscription email",
    );
    throw error;
  }
}
