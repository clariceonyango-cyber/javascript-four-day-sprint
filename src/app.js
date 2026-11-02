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

    item.append(title, priority, completeButton, editButton, deleteButton);
    taskList.appendChild(item);
  });

  const stats = getTaskStats(tasks);

  statsElement.textContent =
    `Total: ${stats.total} | Open: ${stats.open} | ` +
    `Completed: ${stats.completed} | Progress: ${stats.percentage}%`;

  undoButton.disabled = !deletedTask;
}

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
    if (!confirm("Are you sure you want to delete this task?")) return;

    deletedTask = task;
    tasks = tasks.filter(item => item.id !== task.id);
    showMessage("Task deleted. You can undo this action.");
  }

  updateTasks();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderTasks();
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

undoButton.addEventListener("click", () => {
  if (!deletedTask) return;

  tasks = [...tasks, deletedTask];
  deletedTask = null;

  showMessage("Task restored.");
  updateTasks();
});

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

renderTasks();
const exportButton = document.querySelector("#export-tasks");

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
});const importButton = document.querySelector("#import-tasks");
console.log("Import button found:", importButton);

const importFile = document.querySelector("#import-file");
importFile.addEventListener("change", () => {
  console.log("File selected:", importFile.files[0]);
});

console.log("Import file found:", importFile);


importButton.addEventListener("click", () => {
  console.log("Import button clicked!");

  const file = importFile.files[0];
  console.log("Selected file:", file);


  if (!file) {
    showMessage("Please select a JSON file first.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      console.log("Imported JSON data:", data);
    



      if (!Array.isArray(data)) {
        throw new Error("Invalid file format.");
      }

      const importedTasks = data
        .map(item => Task.fromData(item))
        .filter(task => task !== null);
        console.log("Converted tasks:", importedTasks);


     tasks = importedTasks;
updateTasks();
showMessage("Tasks imported successfully.");


    } catch (error) {
      showMessage("Import failed. Please choose a valid JSON file.");
    }
  };

  reader.readAsText(file);
});

