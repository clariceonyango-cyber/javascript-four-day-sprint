
/* =========================================
   DAY 3: INTERACTIVE AND PERSISTENT TASKS
   ========================================= */

const STORAGE_KEY = "jsSprint.tasks.day3.v1";

const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const titleInput = document.querySelector("#task-title");
const titleError = document.querySelector("#title-error");
const searchInput = document.querySelector("#search-input");
const statusFilter = document.querySelector("#status-filter");
const appStatus = document.querySelector("#app-status");

if (!taskForm || !taskList || !titleInput || !appStatus) {
  throw new Error("Required page elements could not be found.");
}


// BLOCK 1: SAMPLE TASKS

const sampleTasks = [
  { id: 1, title: "Read JavaScript guide", completed: false, priority: "high" },
  { id: 2, title: "Practise DOM selection", completed: false, priority: "medium" },
  { id: 3, title: "Learn event listeners", completed: true, priority: "normal" },
  { id: 4, title: "Test localStorage", completed: false, priority: "low" },
  { id: 5, title: "Write daily reflection", completed: true, priority: "medium" }
];


// BLOCK 2: VALIDATION

function validateTaskInput(value) {
  const title = typeof value === "string" ? value.trim() : "";

  if (title.length === 0) {
    return { valid: false, error: "Please enter a task title." };
  }

  if (title.length > 80) {
    return { valid: false, error: "Title must not exceed 80 characters." };
  }

  return { valid: true, value: title };
}


// BLOCK 3: SAFE STORAGE

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === "object" &&
    Number.isSafeInteger(task.id) &&
    typeof task.title === "string" &&
    task.title.trim().length > 0 &&
    task.title.length <= 80 &&
    typeof task.completed === "boolean" &&
    ["high", "medium", "low", "normal"].includes(task.priority)
  );
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Could not save tasks:", error);
    appStatus.textContent = "Your changes could not be saved in this browser.";
    return false;
  }
}


function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    // If there are no saved tasks, load sample tasks.
    if (stored === null) {
      return {
        tasks: [...sampleTasks],
        notice: "Sample tasks loaded. Your changes will be saved.",
        shouldSave: true
      };
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || !parsed.every(isValidTask)) {
      throw new Error("Stored task data is invalid.");
    }

    return {
      tasks: parsed,
      notice: "",
      shouldSave: false
    };

  } catch (error) {
    console.error("Storage recovery:", error);

    // If saved data is damaged, start with an empty list.
    return {
      tasks: [],
      notice: "Saved data could not be read. The task list was safely reset.",
      shouldSave: true
    };
  }
}



const loadedData = loadTasks();
let tasks = loadedData.tasks;

if (loadedData.notice) {
  appStatus.textContent = loadedData.notice;
}

if (loadedData.shouldSave) {
  saveTasks(tasks);
}


// BLOCK 4: RENDER TASKS SAFELY

function renderTasks() {
  taskList.replaceChildren();

  const visibleTasks = getVisibleTasks(
    tasks,
    searchInput.value,
    statusFilter.value
  );

  if (visibleTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No tasks yet.";
    taskList.append(emptyMessage);
    return;
  }

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.classList.toggle("completed", task.completed);

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const priority = document.createElement("span");
    priority.textContent = ` — ${task.priority} priority`;

    const actions = document.createElement("span");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.dataset.action = "complete";
    completeButton.dataset.taskId = String(task.id);
    completeButton.textContent = task.completed ? "Undo" : "Complete";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.taskId = String(task.id);
    deleteButton.textContent = "Delete";

    actions.append(completeButton, deleteButton);
    item.append(title, priority, actions);

    taskList.append(item);
  });
}


// BLOCK 5: SEARCH AND COMPOSABLE FILTERS

function getVisibleTasks(allTasks, query, status) {
  const normalizedQuery = query.trim().toLowerCase();

  const matchingSearch = allTasks.filter(task =>
    task.title.toLowerCase().includes(normalizedQuery)
  );

  if (status === "open") {
    return matchingSearch.filter(task => !task.completed);
  }

  if (status === "completed") {
    return matchingSearch.filter(task => task.completed);
  }

  return matchingSearch;
}


// REQUIRED CHALLENGE 9: CASE-INSENSITIVE SEARCH

function searchTasks(allTasks, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return allTasks.filter(task =>
    task.title.toLowerCase().includes(normalizedQuery)
  );
}

console.log("Search test - mixed case:", searchTasks(sampleTasks, "JAVASCRIPT"));
console.log("Search test - spaces:", searchTasks(sampleTasks, "  DOM  "));
console.log("Search test - empty:", searchTasks(sampleTasks, ""));
console.log("Search test - no matches:", searchTasks(sampleTasks, "unavailable"));


// REQUIRED CHALLENGE 10: COMPOSABLE FILTERS

const originalTaskCount = tasks.length;

const openSearchResults = getVisibleTasks(tasks, "task", "open");

console.log("Open search results:", openSearchResults);
console.log("Original tasks unchanged:", tasks.length === originalTaskCount);


// BLOCK 6: FORM SUBMISSION AND DUPLICATE PREVENTION

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const validation = validateTaskInput(formData.get("title"));

  if (!validation.valid) {
    titleError.textContent = validation.error;
    titleInput.focus();
    return;
  }

  const normalizedTitle = validation.value;

  const duplicate = tasks.some(task =>
    task.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
  );

  if (duplicate) {
    titleError.textContent = "A task with this title already exists.";
    titleInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    title: normalizedTitle,
    completed: false,
    priority: formData.get("priority")
  };

  tasks = [...tasks, newTask];

  saveTasks(tasks);

  taskForm.reset();
  titleError.textContent = "";
  titleInput.focus();

  appStatus.textContent = "Task added successfully.";

  renderTasks();
});


// REQUIRED CHALLENGE 11: DUPLICATE PREVENTION

function isDuplicateTitle(allTasks, title) {
  const normalizedTitle = title.trim().toLowerCase();

  return allTasks.some(task =>
    task.title.trim().toLowerCase() === normalizedTitle
  );
}

console.log(
  "Duplicate test:",
  isDuplicateTitle(sampleTasks, " READ JAVASCRIPT GUIDE ")
);

console.log(
  "Distinct title test:",
  isDuplicateTitle(sampleTasks, "Learn CSS")
);


// BLOCK 7: EVENT DELEGATION

taskList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button || !taskList.contains(button)) {
    return;
  }

  const id = Number(button.dataset.taskId);

  if (!Number.isSafeInteger(id)) {
    return;
  }

  const action = button.dataset.action;

  if (action === "complete") {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    appStatus.textContent = "Task status updated.";

  } else if (action === "delete") {
    tasks = tasks.filter(task => task.id !== id);
    appStatus.textContent = "Task deleted.";

  } else {
    return;
  }

  saveTasks(tasks);
  renderTasks();
});


// BLOCK 8: SEARCH AND FILTER EVENTS

searchInput.addEventListener("input", renderTasks);

statusFilter.addEventListener("change", renderTasks);


// BLOCK 9: CORRUPTED STORAGE RECOVERY

function testCorruptedStorageRecovery() {
  const testKey = `${STORAGE_KEY}.test`;

  try {
    localStorage.setItem(testKey, "not-json");

    const stored = localStorage.getItem(testKey);

    try {
      JSON.parse(stored);
    } catch (error) {
      console.log("PASS: Corrupted JSON was detected.");
      return true;
    }

  } catch (error) {
    console.error("Storage test could not run:", error);
  } finally {
    localStorage.removeItem(testKey);
  }

  return false;
}

console.log(
  "Corrupted storage recovery test:",
  testCorruptedStorageRecovery()
);


// INITIAL RENDER

renderTasks();

console.log("DAY 3 PRACTICE READY");

