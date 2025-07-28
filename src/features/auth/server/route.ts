import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { insertUserSchema, updateUserSchema } from "@/zod-schemas/users-schema";
import { startDate, user } from "@/db/schema/schema";
import { auth } from "@/lib/auth";
import z, { string } from "zod";
import { headers } from "next/headers";
import { loginUserSchema } from "../validators/login-validators";
import { changePasswordBackendSchema } from "@/features/auth/validators/change-password";
import { forgotPasswordSchema } from "@/features/auth/validators/forgot-password";
import { resetPasswordBackendSchema } from "../validators/reset-password";

const app = new Hono()
  .post("/sign-up/email", zValidator("json", insertUserSchema), async (c) => {
    const { name, email, password, confirmPassword } = c.req.valid("json");
    if (password !== confirmPassword) {
      return c.json(
        { error: "BadRequest", message: "Passwords do not match" },
        400
      );
    }
    try {
      const response = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
        asResponse: false,
      });
      return c.json({ data: response.user }, 201);
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message: error instanceof Error ? error.message : "Failed to sign up",
        },
        500
      );
    }
  })
  .post("/sign-in/email", zValidator("json", loginUserSchema), async (c) => {
    const { email, password, rememberMe } = c.req.valid("json");
    if (!email || !password) {
      return c.json(
        { error: "BadRequest", message: "Email and password are required" },
        400
      );
    }
    console.log("Signing in with email:", email, "Remember me:", rememberMe);

    try {
      const response = await auth.api.signInEmail({
        body: {
          email,
          password,
          rememberMe: rememberMe,
        },
      });
      return c.json({ data: response.user }, 200);
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .get(
    "/verify-email",
    zValidator("query", z.object({ token: z.string() })),
    async (c) => {
      const { token } = c.req.valid("query");
      if (!token) {
        return c.json(
          { error: "BadRequest", message: "Token is required" },
          400
        );
      }
      try {
        const response = await auth.api.verifyEmail({
          query: { token },
        });
        console.log("Email verification response:", response);
        if (!response || !response.status) {
          return c.json(
            { error: "Unauthorized", message: "Invalid or expired token" },
            401
          );
        }
        return c.json({ data: response.status, user: response.user }, 200);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post(
    "/send-verification-email",
    zValidator("json", z.object({ email: z.string().email() })),
    async (c) => {
      const { email } = c.req.valid("json");
      if (!email || email.trim() === "") {
        return c.json(
          { error: "BadRequest", message: "Token is required" },
          400
        );
      }
      const userFound = await db
        .select()
        .from(user)
        .where(eq(user.email, email));
      if (userFound.length === 0) {
        return c.json({ error: "NotFound", message: "User not found" }, 404);
      }
      if (userFound[0].emailVerified) {
        return c.json(
          { error: "BadRequest", message: "Email already verified" },
          400
        );
      }
      try {
        const response = await auth.api.sendVerificationEmail({
          body: {
            email: email,
          },
        });
        console.log("Email verification response:", response);
        if (!response || !response.status) {
          return c.json(
            { error: "Unauthorized", message: "Invalid or expired token" },
            401
          );
        }
        return c.json({ data: response.status }, 200);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post(
    "/change-password",
    sessionMiddleware,
    zValidator("json", changePasswordBackendSchema),
    async (c) => {
      try {
        console.log("Change Password Request:", c.req.valid("json"));
        const { newPassword, oldPassword } = c.req.valid("json");
        if (!newPassword || !oldPassword) {
          return c.json(
            {
              error: "BadRequest",
              message: "New and old passwords are required",
            },
            400
          );
        }
        if (newPassword === oldPassword) {
          return c.json(
            {
              error: "BadRequest",
              message: "New password cannot be the same as old password",
            },
            400
          );
        }
        const data = await auth.api.changePassword({
          body: {
            newPassword,
            currentPassword: oldPassword,
            revokeOtherSessions: true,
          },
          headers: await headers(),
        });
        return c.json({ data: data.user }, 200);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post(
    "/forgot-password",
    zValidator("json", forgotPasswordSchema),
    async (c) => {
      try {
        const { email } = c.req.valid("json");
        if (!email || email.trim() === "") {
          return c.json(
            { error: "BadRequest", message: "Email is required" },
            400
          );
        }
        const userFound = await db
          .select()
          .from(user)
          .where(eq(user.email, email));
        if (userFound.length === 0) {
          return c.json({ error: "NotFound", message: "User not found" }, 404);
        }
        const response = await auth.api.requestPasswordReset({
          body: {
            email: email,
          },
        });
        if (!response || !response.status) {
          return c.json(
            {
              error: "InternalServerError",
              message: "Failed to send password reset email",
            },
            500
          );
        }
        return c.json({ data: response.status }, 200);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post(
    "/reset-password",
    zValidator("json", resetPasswordBackendSchema),
    async (c) => {
      try {
        const { token, newPassword } = c.req.valid("json");
        if (!token || !newPassword) {
          return c.json(
            { error: "BadRequest", message: "All fields are required" },
            400
          );
        }
        const response = await auth.api.resetPassword({
          body: {
            token,
            newPassword,
          },
        });
        if (!response || !response.status) {
          return c.json(
            { error: "Unauthorized", message: "Invalid or expired token" },
            401
          );
        }
        return c.json({ data: response.status }, 200);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .get("/get-user", sessionMiddleware, async (c) => {
    try {
      const currUser = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!currUser?.id) {
        return c.json({ data: [] });
      }
      const userFound = await db
        .select()
        .from(user)
        .where(eq(user.id, currUser.id));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound });
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .patch(
    "/update-user",
    sessionMiddleware,
    zValidator("json", updateUserSchema),
    async (c) => {
      const userFrom = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFrom?.id) {
        return c.json(
          { error: "Unauthorized", message: "User not found" },
          401
        );
      }
      try {
        const { name, email, image, phoneNumber } = c.req.valid("json");
        const updatedUser = await db
          .update(user)
          .set({ name, email, image, phoneNumber })
          .where(eq(user.id, userFrom.id))
          .returning();
        return c.json({ data: updatedUser[0] }, 200);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .get("/current", sessionMiddleware, async (c) => {
    try {
      const userFrom = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFrom?.id) {
        return c.json({ data: [] });
      }
      const userFound = await db
        .select()
        .from(user)
        .where(eq(user.id, userFrom.id));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound[0] });
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .get(
    "/get-start-date",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: string() })),
    async (c) => {
      console.log("Fetching in server", c.req.valid("query").workspaceId);
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        if (!userFound?.id) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not found or not authenticated",
            },
            401
          );
        }
        const { workspaceId } = c.req.valid("query");
        console.log("date for workspaceId:", workspaceId);
        if (!workspaceId) {
          return c.json(
            {
              error: "BadRequest",
              message: "Workspace ID is required",
            },
            400
          );
        }
        const startDateFound = await db
          .select()
          .from(startDate)
          .where(
            and(
              eq(startDate.workspaceId, workspaceId),
              eq(startDate.userId, userFound.id)
            )
          );
        console.log("Start date found:", startDateFound);
        return c.json(
          {
            data: startDateFound.length > 0 ? startDateFound[0] : null,
          },
          200
        );
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post(
    "/create-start-date",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        workspaceId: string(),
        startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format",
        }),
      })
    ),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        if (!userFound?.id) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not found or not authenticated",
            },
            401
          );
        }
        const { workspaceId, startDate: startDateValue } = c.req.valid("json");
        if (!workspaceId || !startDateValue) {
          return c.json(
            {
              error: "BadRequest",
              message: "Workspace ID and start date are required",
            },
            400
          );
        }
        const newStartDate = await db
          .insert(startDate)
          .values({
            id: crypto.randomUUID(),
            workspaceId,
            userId: userFound.id,
            startDate: new Date(startDateValue),
          })
          .returning();
        return c.json({ data: newStartDate }, 201);
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .patch(
    "/update-start-date",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        workspaceId: z.string(),
        startDateSend: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format",
        }),
      })
    ),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        if (!userFound) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not found or not authenticated",
            },
            401
          );
        }
        const { startDateSend, workspaceId } = c.req.valid("json");
        if (!workspaceId || !startDateSend) {
          return c.json(
            {
              error: "BadRequest",
              message: "Workspace ID and start date are required",
            },
            400
          );
        }
        const updatedStartDate = await db
          .update(startDate)
          .set({ startDate: new Date(startDateSend) })
          .where(
            and(
              eq(startDate.workspaceId, workspaceId),
              eq(startDate.userId, userFound.id)
            )
          )
          .returning();
        if (updatedStartDate.length === 0) {
          return c.json(
            { error: "NotFound", message: "Start date not found" },
            404
          );
        }
        return c.json({ data: updatedStartDate[0] });
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      const ok = await auth.api.signOut({
        headers: await headers(),
      });
      if (!ok) {
        return c.json(
          { error: "InternalServerError", message: "Failed to log out" },
          500
        );
      }
      return c.json({ message: "Logged out successfully" }, 200);
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  });
export default app;
