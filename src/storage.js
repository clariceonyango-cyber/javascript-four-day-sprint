import { Task } from "./task.js";

const STORAGE_KEY = "focusTasks";

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Saving failed:", error);
    return false;
  }
}

export function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const data = JSON.parse(saved);

    if (!Array.isArray(data)) return [];

    return data
      .map(item => Task.fromData(item))
      .filter(task => task !== null);

  } catch (error) {
    console.error("Loading failed:", error);
    return [];
  }
}

export function clearTasks() {
  localStorage.removeItem(STORAGE_KEY);
}
