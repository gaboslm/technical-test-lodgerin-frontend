export type TaskStatusType = "PENDING" | "COMPLETED";

export const TasksStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  expirationDate: string;
  status: TaskStatusType;
};
