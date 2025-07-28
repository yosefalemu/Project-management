import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { session, user, verification, account } from "@/db/schema/schema";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "@/features/auth/utils/send-verification-email";
import { sendResetPasswordEmail } from "@/features/auth/utils/send-password-reset-email";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetPasswordUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
      await sendResetPasswordEmail(resetPasswordUrl, user.email);
    },
    resetPasswordTokenExpiresIn: 600,
  },
  emailVerification: {
    sendVerificationEmail: async ({ token, user }) => {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
      await sendVerificationEmail(verificationUrl, user.email);
    },
    sendOnSignUp: true,
    expiresIn: 600,
  },
});
