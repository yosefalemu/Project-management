import { db } from "@/db";
import { workSpaces } from "@/db/schema/workspace";
import { member } from "@/db/schema/member";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/zod-schemas/workspace-schema";
import { zValidator } from "@hono/zod-validator";
import { NeonDbError } from "@neondatabase/serverless";
import { Hono } from "hono";
import { eq, inArray } from "drizzle-orm";
import { MemberRole } from "@/features/members/types/type";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const userId = c.get("userId") as string;
    const members = await db
      .select()
      .from(member)
      .where(eq(member.userId, userId));
    if (members.length === 0) {
      return c.json({ data: [] });
    }
    const workspacesIds = members.map((member) => member.workspaceId);
    const workspaces = await db
      .select()
      .from(workSpaces)
      .where(inArray(workSpaces.id, workspacesIds));
    return c.json({ data: workspaces });
  })
  .get("/current", sessionMiddleware, async (c) => {
    const userId = c.get("userId") as string;
    const members = await db
      .select()
      .from(member)
      .where(eq(member.userId, userId));
    if (members.length === 0) {
      return c.json({ data: [] });
    }
    const workspacesIds = members.map((member) => member.workspaceId);
    const workspaces = await db
      .select()
      .from(workSpaces)
      .where(inArray(workSpaces.id, workspacesIds));
    try {
      const lastWorkSpaceId = localStorage.getItem("lastWorkSpaceId");
      console.log("lastWorkSpaceId In the first", lastWorkSpaceId);
      if (lastWorkSpaceId) {
        const lastWorkspace = workspaces.filter(
          (workspace) => workspace.id === lastWorkSpaceId
        );
        if (lastWorkspace) {
          return c.json({ data: lastWorkspace });
        }
      } else {
        return c.json({ data: workspaces });
      }
    } catch (error) {
      console.error("Error while getting last workspace", error);
      return c.json({ data: workspaces });
    }
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name, image, description } = c.req.valid("form");
      let uploadedImage: string | undefined;

      if (image instanceof File) {
        try {
          const fileReader = await image.arrayBuffer();
          uploadedImage = `data:${image.type};base64,${Buffer.from(
            fileReader
          ).toString("base64")}`;
        } catch (err) {
          console.error("Error while processing image file", err);
          return c.json(
            {
              error: "InvalidImage",
              message: "Failed to process the image file",
            },
            400
          );
        }
      } else {
        uploadedImage = image;
      }
      console.log("uploadedImage", c.req);
      const userId = c.get("userId") as string;
      console.log("userId", userId);

      let newWorkspace;

      try {
        // Create the workspace
        [newWorkspace] = await db
          .insert(workSpaces)
          .values({
            name,
            description: description.trim(),
            image: uploadedImage,
            createdBy: userId,
            inviteCode: generateInviteCode(10),
          })
          .returning();

        try {
          // Create the member
          await db.insert(member).values({
            workspaceId: newWorkspace.id,
            userId: userId,
            role: MemberRole.Admin,
          });
        } catch (err) {
          console.error("Error while creating member", err);

          // Rollback: Delete the created workspace
          await db.delete(workSpaces).where(eq(workSpaces.id, newWorkspace.id));

          return c.json(
            {
              error: "InternalServerError",
              message: "Failed to create member. Workspace rolled back.",
            },
            500
          );
        }

        return c.json({ data: newWorkspace });
      } catch (err) {
        console.error("ERROR WHILE CREATING WORKSPACE", err);

        if (err instanceof NeonDbError && err.code === "23505") {
          return c.json(
            { error: "Conflict", message: "Workspace already exists" },
            409
          );
        }

        return c.json(
          {
            error: "InternalServerError",
            message: "Failed to create workspace",
          },
          500
        );
      }
    }
  );

export default app;
