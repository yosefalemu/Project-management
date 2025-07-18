export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = {
  id: string;
  name: string;
  description: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  workspaceId: string;
  projectId: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  position: string;
  assignedUser: {
    id: string;
    name: string | null;
    email: string;
    password: string;
    confirm_password: string | null;
    createdAt: string;
    updatedAt: string;
    image: string | null;
  };
};
