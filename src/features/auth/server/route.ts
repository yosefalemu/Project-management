import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { startDate, user } from "@/db/schema/schema";
import { auth } from "@/lib/auth";
import z, { string } from "zod";
import { updateUserInfoSchema } from "../validators/update-user";
import { deleteCookie } from "hono/cookie";
import { AUTH_REMEMBER_ME_COOKIE } from "../constants/constant";
import { loginUserSchema } from "@/features/auth/validators/login";

const app = new Hono()
  .post("/sign-in", zValidator("json", loginUserSchema), async (c) => {
    const { email, password, rememberMe } = c.req.valid("json");
    try {
      if (!email || !password) {
        return c.json(
          { error: "BadRequest", message: "Email and password are required" },
          400
        );
      }
      if (rememberMe) {
        deleteCookie(c, AUTH_REMEMBER_ME_COOKIE);
      }
      const response = await auth.api.signInEmail({
        body: { email, password, rememberMe },
      });
      return c.json({ data: response }, 200);
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
    zValidator("json", updateUserInfoSchema),
    async (c) => {
      const userFrom = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFrom?.id) {
        return c.json(
          { error: "Unauthorized", message: "User not found" },
          401
        );
      }
      try {
        const { phoneNumber, image, name } = c.req.valid("json");
        const updatedUser = await db
          .update(user)
          .set({ phoneNumber, image, name })
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
  .get(
    "/get-start-date",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: string() })),
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
        const { workspaceId } = c.req.valid("query");
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
  );
export default app;
