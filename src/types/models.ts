export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Company = {
  id: string;
  name: string;
  color: string;
  ownerId: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  status: TaskStatus;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

/** Uma tarefa é considerada em atraso quando a data já passou e ela não está concluída. */
export function isTaskLate(task: Task): boolean {
  if (task.status === "DONE") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(task.date);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate.getTime() < today.getTime();
}

export type EffectiveStatus = "LATE" | "IN_PROGRESS" | "TODO" | "DONE";

export function effectiveStatus(task: Task): EffectiveStatus {
  if (isTaskLate(task)) return "LATE";
  return task.status;
}

export const STATUS_LABEL: Record<EffectiveStatus, string> = {
  LATE: "Em atraso",
  IN_PROGRESS: "Em andamento",
  TODO: "A fazer",
  DONE: "Concluída",
};

export const STATUS_COLOR: Record<EffectiveStatus, string> = {
  LATE: "#E74C3C",
  IN_PROGRESS: "#F0932B",
  TODO: "#8E8BA8",
  DONE: "#00B894",
};
