import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { session, user, verification, account } from "@/db/schema/schema";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "@/features/auth/utils/send-verification-email";
import { sendResetPasswordEmail } from "@/features/auth/utils/send-password-reset-email";
import { sendChangeEmail } from "@/features/auth/utils/send-change-email";

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
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(url, user.email);
    },
    sendOnSignUp: true,
    expiresIn: 600,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
      accessType: "offline",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    modelName: "user",
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ url, user }) => {
        console.log("Sending change email verification to:", url);
        await sendChangeEmail(url, user.email);
      },
    },
  },
});
