import { db } from "@/db";
import { workSpaces } from "@/db/schema/workspace";
import { member } from "@/db/schema/member";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/zod-schemas/workspace-schema";
import { zValidator } from "@hono/zod-validator";
import { NeonDbError } from "@neondatabase/serverless";
import { Context, Hono } from "hono";
import { eq, inArray } from "drizzle-orm";
import { MemberRole } from "@/features/members/types/type";
import { generateInviteCode } from "@/lib/utils";
import { z } from "zod";

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
  .get("/:workspaceId", sessionMiddleware, async (c: Context) => {
    const userId = c.get("userId") as string;
    const workspaceId = c.req.param("workspaceId") as string;
    const members = await db
      .select()
      .from(member)
      .where(eq(member.userId, userId));
    if (members.length === 0) {
      return c.json(
        {
          error: "Forbidden",
          message: "You are not a member of this workspace",
        },
        403
      );
    }
    const workspacesIds = members.map((member) => member.workspaceId);
    const workspace = await db
      .select()
      .from(workSpaces)
      .where(
        inArray(workSpaces.id, workspacesIds) && eq(workSpaces.id, workspaceId)
      );
    if (workspace.length === 0) {
      return c.json(
        {
          error: "NotFound",
          message: "Workspace not found",
        },
        404
      );
    }
    return c.json({ data: workspace[0] });
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
        uploadedImage = image || "";
      }
      const userId = c.get("userId") as string;
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

        return c.json({ data: newWorkspace }, 200);
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
  )
  .patch(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name, image, description, id } = c.req.valid("form");
      const userId = c.get("userId") as string;

      // Process the image
      let uploadedImage: string | "";
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
        uploadedImage = image || "";
      }
      try {
        const workspace = await db
          .select()
          .from(workSpaces)
          .where(eq(workSpaces.id, id!))
          .then((results) => results[0]);

        if (!workspace) {
          return c.json(
            {
              error: "NotFound",
              message: "Workspace not found",
            },
            404
          );
        }

        if (workspace.createdBy !== userId) {
          return c.json(
            {
              error: "Forbidden",
              message: "You are not authorized to update this workspace",
            },
            403
          );
        }

        // Update the workspace
        const updatedWorkspace = await db
          .update(workSpaces)
          .set({
            name: name.trim(),
            description: description.trim(),
            image: uploadedImage,
          })
          .where(eq(workSpaces.id, id!))
          .returning()
          .then((results) => results[0]);

        if (!updatedWorkspace) {
          return c.json(
            {
              error: "InternalServerError",
              message: "Failed to update the workspace",
            },
            500
          );
        }

        return c.json({ data: updatedWorkspace });
      } catch (err) {
        console.error("Error while updating workspace", err);
        return c.json(
          {
            error: "InternalServerError",
            message: "Failed to update the workspace",
          },
          500
        );
      }
    }
  )
  .delete(
    "/:workspaceId",
    zValidator("param", z.object({ workspaceId: z.string() })),
    sessionMiddleware,
    async (c) => {
      const userId = c.get("userId") as string;
      const workSpaceId = c.req.param("workspaceId") as string;
      console.log("WORKSPACE TO DELETE", workSpaceId);
      // Fetch the members
      try {
        const members = await db
          .select()
          .from(member)
          .where(eq(member.workspaceId, workSpaceId));
        if (members.length === 0) {
          return c.json(
            {
              error: "Forbidden",
              message: "You are not a member of this workspace",
            },
            403
          );
        }
      } catch (error) {
        console.log("Error while deleting", error);
        return c.json({
          error: "InternalServerError",
          message: "",
        });
      }
      //select the workspace
      try {
        const workspaces = await db
          .select()
          .from(workSpaces)
          .where(eq(workSpaces.id, workSpaceId));
        if (workspaces.length === 0) {
          return c.json({
            error: "NotFound",
            message: "Workspace not found",
          });
        }
        if (workspaces[0].createdBy !== userId) {
          return c.json({
            error: "Unauthorized",
            message: "You can not delete others",
          });
        }
      } catch (error) {
        console.log(error);
        return c.json({
          error: "InternalServerError",
          message: "",
        });
      }
      //delete workspace
      try {
        await db.delete(workSpaces).where(eq(workSpaces.id, workSpaceId));
      } catch (error) {
        console.log(error);
        return c.json({
          error: "InternalServerError",
          message: "",
        });
      }
      //delete all members
      try {
        await db.delete(member).where(eq(member.workspaceId, workSpaceId));
      } catch (error) {
        console.log(error);
        return c.json({
          error: "InternalServerError",
          message: "",
        });
      }
      return c.json({ data: "Workspace deleted" });
    }
  );

export default app;
