export class Task {
  constructor(title, priority = "Medium") {
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Please enter a task title.");
    }

    this.id = crypto.randomUUID();
    this.title = title.trim();
    this.priority = priority;
    this.completed = false;
    this.createdAt = new Date().toISOString();
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  rename(newTitle) {
    if (typeof newTitle !== "string" || !newTitle.trim()) {
      throw new Error("Task title cannot be empty.");
    }

    this.title = newTitle.trim();
  }

  static fromData(data) {
    if (!data || typeof data.title !== "string" || !data.title.trim()) {
      return null;
    }

    const task = new Task(data.title, data.priority || "Medium");

    task.id = data.id || task.id;
    task.createdAt = data.createdAt || task.createdAt;
    task.completed = Boolean(data.completed);

    return task;
  }
}

export function addTask(tasks, newTask) {
  const duplicate = tasks.some(
    task => task.title.toLowerCase() === newTask.title.toLowerCase()
  );

  if (duplicate) {
    throw new Error("This task already exists.");
  }

  return [...tasks, newTask];
}

export function searchTasks(tasks, searchTerm = "") {
  const term = searchTerm.toLowerCase();

  return tasks.filter(task =>
    task.title.toLowerCase().includes(term)
  );
}

export function getTaskStats(tasks) {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;

  return {
    total,
    completed,
    open: total - completed,
    percentage: total === 0 ? 0 : Math.round(completed / total * 100)
  };
}
