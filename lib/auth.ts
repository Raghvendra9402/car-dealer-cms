import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
          <div>
            <h1>Verify your email</h1>

            <p>Click the button below to verify your email address.</p>

            <a 
              href="${url}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:black;
                color:white;
                text-decoration:none;
                border-radius:8px;
              "
            >
              Verify Email
            </a>
          </div>
        `,
      });
    },
  },
});
