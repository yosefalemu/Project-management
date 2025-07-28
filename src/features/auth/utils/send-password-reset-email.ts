import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import ResetPasswordEmailTemplate from "../components/reset-email-template";

export const sendResetPasswordEmail = async (
  resetPasswordUrl: string,
  email: string
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration is not set.");
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    try {
      await transporter.verify();
    } catch (error) {
      console.error("Email server connection error:", error);
      throw new Error("Failed to connect to email server.");
    }
    const emailHtml = await render(
      ResetPasswordEmailTemplate({
        url: resetPasswordUrl,
      })
    );
    const options = {
      from: `"Project Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: emailHtml,
    };
    const info = await transporter.sendMail(options);
    if (info.rejected.length > 0) {
      //   await db.delete(user).where(eq(user.id, response.user.id));
      console.error("Email sending failed:", info.rejected);
      throw new Error("Failed to send reset password email.");
    }
    console.log("Reset password email sent successfully:", info.response);
  } catch (error) {
    console.log("Error sending reset password email:", error);
  }
};
