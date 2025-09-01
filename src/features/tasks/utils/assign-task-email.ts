import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import AssignTaskEmail from "@/features/tasks/components/assign-task-email";

export const sendAssignTaskEmail = async (
  email: string,
  taskDetailUrl: string,
  taskName: string,
  assignedBy: string
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
      AssignTaskEmail({
        taskDetailUrl,
        taskName,
        assignedBy,
      })
    );
    const options = {
      from: `"Project Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Task Assigned: ${taskName}`,
      html: emailHtml,
    };
    const info = await transporter.sendMail(options);
    if (info.rejected.length > 0) {
      console.error("Email sending failed:", info.rejected);
      throw new Error("Failed to send change email request.");
    }
  } catch (error) {
    console.error("Error sending task assignment email:", error);
  }
};
