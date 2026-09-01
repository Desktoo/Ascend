import { useMemo } from "react";
import useSWR from "swr";
import { apiClient } from "@/core/services/client";

export interface TaskItem {
  id: string;
  title: string;
  type?: "Standard" | "HabitTask" | "GoalTask";
  status: "PENDING" | "DONE" | "ABANDONED";
  dueTime?: string | null;
  scheduledDate?: string;
  createdAt: string;
}

export interface DayActivity {
  name: string;
  tasks: number;
  habits: number;
}

function getLocalDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useWeeklyActivity() {
  const { data: allTasks, error, isLoading, mutate } = useSWR<TaskItem[]>(
    "/tasks",
    () => apiClient<TaskItem[]>("/tasks"),
  );

  const weeklyData: DayActivity[] = useMemo(() => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);

    const weekBuckets = dayNames.map((name, index) => {
      const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
      return {
        name,
        dateKey: getLocalDateKey(dayDate),
        tasks: 0,
        habits: 0,
      };
    });

    if (allTasks && Array.isArray(allTasks)) {
      for (const task of allTasks) {
        if (task.status !== "DONE") continue;

        let taskKey = "";
        if (task.dueTime) {
          taskKey = getLocalDateKey(new Date(task.dueTime));
        } else if (task.scheduledDate) {
          taskKey = task.scheduledDate;
        } else if (task.createdAt) {
          taskKey = getLocalDateKey(new Date(task.createdAt));
        }

        const bucket = weekBuckets.find((b) => b.dateKey === taskKey);
        if (bucket) {
          if (task.type === "HabitTask") {
            bucket.habits += 1;
          } else {
            bucket.tasks += 1;
          }
        }
      }
    }

    return weekBuckets.map(({ name, tasks, habits }) => ({
      name,
      tasks,
      habits,
    }));
  }, [allTasks]);

  return {
    weeklyData,
    isLoading,
    isError: error,
    mutate,
  };
}
