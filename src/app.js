
import {
  Task,
  addTask,
  searchTasks,
  getTaskStats
} from "./task.js";

import {
  saveTasks,
  loadTasks
} from "./storage.js";

import { fetchSuggestions } from "./api.js";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const priorityInput = document.querySelector("#task-priority");
const taskList = document.querySelector("#task-list");
const statsElement = document.querySelector("#task-stats");
const searchInput = document.querySelector("#task-search");
const undoButton = document.querySelector("#undo-delete");
const suggestionsButton = document.querySelector("#load-suggestions");
const exportButton = document.querySelector("#export-tasks");
const importButton = document.querySelector("#import-tasks");
const importFile = document.querySelector("#import-file");

let tasks = loadTasks();
let currentFilter = "all";
let searchTerm = "";
let deletedTask = null;

function showMessage(message) {
  let messageElement = document.querySelector("#app-message");

  if (!messageElement) {
    messageElement = document.createElement("p");
    messageElement.id = "app-message";
    messageElement.setAttribute("role", "status");
    form.after(messageElement);
  }

  messageElement.textContent = message;
}

function updateTasks() {
  saveTasks(tasks);
  renderTasks();
}

function renderTasks() {
  taskList.replaceChildren();

  let visibleTasks = searchTasks(tasks, searchTerm);

  if (currentFilter === "open") {
    visibleTasks = visibleTasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    visibleTasks = visibleTasks.filter(task => task.completed);
  }

  visibleTasks.forEach(task => {
    const item = document.createElement("li");

    const title = document.createElement("span");
    title.textContent = task.title;

    if (task.completed) {
      title.style.textDecoration = "line-through";
    }

    const priority = document.createElement("span");
    priority.textContent = `Priority: ${task.priority}`;

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = task.completed ? "Undo" : "Complete";
    completeButton.dataset.action = "toggle";
    completeButton.dataset.id = task.id;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.dataset.id = task.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = task.id;

    item.append(
      title,
      priority,
      completeButton,
      editButton,
      deleteButton
    );

    taskList.appendChild(item);
  });

  const stats = getTaskStats(tasks);

  statsElement.textContent =
    `Total: ${stats.total} | Open: ${stats.open} | ` +
    `Completed: ${stats.completed} | Progress: ${stats.percentage}%`;

  undoButton.disabled = !deletedTask;
}

// Add a task
form.addEventListener("submit", event => {
  event.preventDefault();

  const title = input.value.trim();

  if (!title) {
    showMessage("Please enter a task.");
    return;
  }

  if (title.length > 80) {
    showMessage("Task title must be 80 characters or fewer.");
    return;
  }

  try {
    const priority = priorityInput.value;
    const newTask = new Task(title, priority);

    tasks = addTask(tasks, newTask);

    input.value = "";
    showMessage("Task added successfully.");
    updateTasks();

  } catch (error) {
    showMessage(error.message);
  }
});

// Complete, edit and delete tasks
taskList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const task = tasks.find(item => item.id === button.dataset.id);

  if (!task) return;

  if (button.dataset.action === "toggle") {
    task.toggleComplete();
    showMessage("Task updated.");
  }

  if (button.dataset.action === "edit") {
    const newTitle = prompt("Enter the new task title:", task.title);

    if (newTitle === null) return;

    try {
      task.rename(newTitle);
    } catch (error) {
      showMessage(error.message);
      return;
    }
  }

  if (button.dataset.action === "delete") {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    const taskIndex = tasks.findIndex(item => item.id === task.id);

    deletedTask = {
      task: task,
      index: taskIndex
    };

    tasks = tasks.filter(item => item.id !== task.id);

    showMessage("Task deleted. You can undo this action.");
  }

  updateTasks();
});

// Search tasks
searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderTasks();
});

// Filter tasks
document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Undo the most recent deletion
undoButton.addEventListener("click", () => {
  if (!deletedTask) return;

  tasks.splice(
    deletedTask.index,
    0,
    deletedTask.task
  );

  deletedTask = null;

  showMessage("Task restored to its original position.");
  updateTasks();
});

// Load online suggestions
suggestionsButton.addEventListener("click", async () => {
  suggestionsButton.disabled = true;
  suggestionsButton.textContent = "Loading...";

  try {
    const suggestions = await fetchSuggestions();
    showMessage(`Loaded ${suggestions.length} online suggestions.`);
  } catch (error) {
    showMessage(error.message);
  } finally {
    suggestionsButton.disabled = false;
    suggestionsButton.textContent = "Load Suggestions";
  }
});

// Export tasks
exportButton.addEventListener("click", () => {
  const data = JSON.stringify(tasks, null, 2);

  const blob = new Blob([data], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "focus-board-tasks.json";
  link.click();

  URL.revokeObjectURL(url);

  showMessage("Tasks exported successfully.");
});

// Open the import file picker
importButton.addEventListener("click", () => {
  importFile.value = "";
  importFile.click();
});

// Import tasks
importFile.addEventListener("change", () => {
  const file = importFile.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid or empty file.");
      }

      const importedTasks = data
        .map(item => Task.fromData(item))
        .filter(task => task !== null);

      if (importedTasks.length !== data.length) {
        throw new Error("Invalid task data.");
      }

      const confirmed = confirm(
        "Are you sure you want to replace your current tasks?"
      );

      if (!confirmed) return;

      tasks = importedTasks;
      deletedTask = null;

      updateTasks();
      showMessage("Tasks imported successfully.");

    } catch (error) {
      showMessage(
        "Import failed. Your existing tasks have been kept."
      );
    }
  };

  reader.onerror = () => {
    showMessage("Could not read the selected file.");
  };

  reader.readAsText(file);
});

// Display saved tasks when the page opens
renderTasks();

