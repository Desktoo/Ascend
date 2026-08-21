export enum Priority {
  HIGH,
  MEDIUM,
  LOW
}

export interface TaskDTO {
  title: string,
  priority: Priority,
  dueTime: Date
}

export interface TaskResponse {
  id: string;
  userId: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}