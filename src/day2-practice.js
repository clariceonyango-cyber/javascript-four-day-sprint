
/* =========================================
   DAY 2: MODEL COLLECTIONS AND DESIGN
   ========================================= */

// BLOCK 1: ARRAYS AND OBJECT RECORDS

// Create five sample task objects
const sampleTasks = [
  {
    id: 1,
    title: "Read brief",
    completed: false,
    priority: "high",
    createdAt: "2026-11-01"
  },
  {
    id: 2,
    title: "Draft outline",
    completed: true,
    priority: "medium",
    createdAt: "2026-11-01"
  },
  {
    id: 3,
    title: "Complete JavaScript exercises",
    completed: false,
    priority: "high",
    createdAt: "2026-11-02"
  },
  {
    id: 4,
    title: "Review GitHub repository",
    completed: true,
    priority: "low",
    createdAt: "2026-11-02"
  },
  {
    id: 5,
    title: "Write daily reflection",
    completed: false,
    priority: "medium",
    createdAt: "2026-11-02"
  }
];

// Read an array item using its index
console.log("First task:", sampleTasks[0]);

// Read an object property
console.log("Task title:", sampleTasks[0].title);

// Demonstrate reference behaviour
const referencedTasks = sampleTasks;
referencedTasks[0].title = "Updated task title";

console.log("Original array after reference change:", sampleTasks[0].title);

// Restore the original title
sampleTasks[0].title = "Read brief";

// Create a separate array copy
const copiedTasks = [...sampleTasks];
copiedTasks[0] = { ...copiedTasks[0], title: "Copied task title" };

console.log("Original after copying:", sampleTasks[0].title);
console.log("Copied version:", copiedTasks[0].title);


// BLOCK 1: TASK FUNCTIONS

function addTask(tasks, task) {
  if (!task.title || !task.title.trim()) {
    throw new Error("Title is required");
  }

  if (tasks.some(item => item.id === task.id)) {
    throw new Error("Task ID already exists");
  }

  return [...tasks, task];
}

function completeTask(tasks, id) {
  if (!tasks.some(task => task.id === id)) {
    throw new Error("Task not found");
  }

  return tasks.map(task =>
    task.id === id ? { ...task, completed: true } : task
  );
}

function deleteTask(tasks, id) {
  if (!tasks.some(task => task.id === id)) {
    throw new Error("Task not found");
  }

  return tasks.filter(task => task.id !== id);
}

function renameTask(tasks, id, newTitle) {
  if (!newTitle || !newTitle.trim()) {
    throw new Error("Title is required");
  }

  if (!tasks.some(task => task.id === id)) {
    throw new Error("Task not found");
  }

  return tasks.map(task =>
    task.id === id
      ? { ...task, title: newTitle.trim() }
      : task
  );
}

// Test task functions
const addedTasks = addTask(sampleTasks, {
  id: 6,
  title: "Practise JavaScript",
  completed: false,
  priority: "high",
  createdAt: "2026-11-02"
});

console.log("After adding:", addedTasks);

const completedTasks = completeTask(addedTasks, 6);
console.log("After completing:", completedTasks);

const renamedTasks = renameTask(completedTasks, 6, "Study JavaScript");
console.log("After renaming:", renamedTasks);

const deletedTasks = deleteTask(renamedTasks, 6);
console.log("After deleting:", deletedTasks);


// REQUIRED CHALLENGE 5: IMMUTABLE TOGGLE

function toggleTask(tasks, id) {
  return tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );
}

const originalTasks = [...sampleTasks];
const toggledTasks = toggleTask(sampleTasks, 1);

console.log("Original completed status:", sampleTasks[0].completed);
console.log("New completed status:", toggledTasks[0].completed);
console.log("Original array unchanged:", sampleTasks[0].completed === originalTasks[0].completed);


// BLOCK 2: ARRAY METHODS

// filter: select incomplete tasks
const incompleteTasks = sampleTasks.filter(task => !task.completed);

// map: return task titles
const taskTitles = sampleTasks.map(task => task.title);

// find: find a task using its ID
const foundTask = sampleTasks.find(task => task.id === 3);

// some: check whether any task is overdue
const hasOverdueTask = sampleTasks.some(task => task.overdue === true);

// every: check whether all tasks are completed
const allTasksCompleted = sampleTasks.every(task => task.completed);

// reduce: count completed tasks by priority
const completedByPriority = sampleTasks.reduce((summary, task) => {
  if (task.completed) {
    summary[task.priority] = (summary[task.priority] || 0) + 1;
  }
  return summary;
}, {});

console.log("Incomplete tasks:", incompleteTasks);
console.log("Task titles:", taskTitles);
console.log("Found task:", foundTask);
console.log("Has overdue task:", hasOverdueTask);
console.log("All tasks completed:", allTasksCompleted);
console.log("Completed by priority:", completedByPriority);

// Chain filter and map
const openTitles = sampleTasks
  .filter(task => !task.completed)
  .map(task => task.title);

console.log("Open task titles:", openTitles);

// Rewrite using named intermediate variables
const openTasks = sampleTasks.filter(task => !task.completed);
const openTaskTitles = openTasks.map(task => task.title);

console.log("Open titles using separate variables:", openTaskTitles);


// REQUIRED CHALLENGE 6: PURCHASE SUMMARY

function getPurchaseSummary(purchases) {
  if (purchases.length === 0) {
    return {
      total: 0,
      count: 0,
      average: 0,
      mostExpensive: null
    };
  }

  const total = purchases.reduce((sum, purchase) => sum + purchase, 0);

  const mostExpensive = purchases.reduce((highest, purchase) =>
    purchase > highest ? purchase : highest
  );

  return {
    total,
    count: purchases.length,
    average: total / purchases.length,
    mostExpensive
  };
}

console.log("Empty purchase list:", getPurchaseSummary([]));

console.log("One purchase:", getPurchaseSummary([50]));

console.log("Multiple purchases:", getPurchaseSummary([20, 50, 50, 30]));


// BLOCK 3: OBJECT-ORIENTED PROGRAMMING

// Reusable title validation
function validateTitle(title) {
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Title is required");
  }

  return title.trim();
}

// Task class
class Task {
  #completed = false;

  constructor(id, title, priority = "normal", reminder = null) {
    this.id = id;
    this.title = validateTitle(title);
    this.priority = priority;
    this.reminder = reminder;
  }

  get completed() {
    return this.#completed;
  }

  complete() {
    this.#completed = true;
  }

  toggle() {
    this.#completed = !this.#completed;
  }

  rename(newTitle) {
    this.title = validateTitle(newTitle);
  }

  describe() {
    return `${this.title} (${this.priority})`;
  }
}

// Create a Task instance
const myTask = new Task(10, "Learn JavaScript", "high");

console.log("New task:", myTask.describe());
console.log("Initially completed:", myTask.completed);

myTask.complete();

console.log("After completing:", myTask.completed);


// TASK LIST CLASS

class TaskList {
  #tasks = [];

  add(task) {
    if (this.#tasks.some(item => item.id === task.id)) {
      throw new Error("Task ID already exists");
    }

    this.#tasks = [...this.#tasks, task];
  }

  remove(id) {
    this.#tasks = this.#tasks.filter(task => task.id !== id);
  }

  findById(id) {
    return this.#tasks.find(task => task.id === id);
  }

  getOpenTasks() {
    return this.#tasks.filter(task => !task.completed);
  }

  getAll() {
    return [...this.#tasks];
  }
}

// Test TaskList
const taskList = new TaskList();

taskList.add(new Task(11, "Practise arrays", "high"));
taskList.add(new Task(12, "Practise objects", "medium"));

console.log("All tasks:", taskList.getAll());
console.log("Find task:", taskList.findById(11));
console.log("Open tasks:", taskList.getOpenTasks());

taskList.remove(12);

console.log("After removal:", taskList.getAll());


// REQUIRED CHALLENGE 7: INHERITANCE AND COMPOSITION

// Inheritance example
class ReminderTask extends Task {
  constructor(id, title, priority, dueDate) {
    super(id, title, priority);
    this.dueDate = dueDate;
  }

  describe() {
    return `${this.title} (${this.priority}) - Due: ${this.dueDate}`;
  }
}

const reminderTask = new ReminderTask(
  13,
  "Submit assignment",
  "high",
  "2026-11-03"
);

console.log("Inheritance example:", reminderTask.describe());

// Composition example
const composedTask = new Task(
  14,
  "Prepare project",
  "medium",
  {
    dueDate: "2026-11-04",
    reminderMessage: "Remember to submit the project"
  }
);

console.log("Composition example:", composedTask.reminder);


// BLOCK 4: REPOSITORY AND TESTING

// Repository separates data storage from task behaviour.
class TaskRepository {
  #records = [];

  saveAll(tasks) {
    this.#records = tasks.map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      completed: task.completed
    }));
  }

  loadAll() {
    return this.#records.map(record => ({ ...record }));
  }
}

const repository = new TaskRepository();

repository.saveAll(taskList.getAll());

console.log("Saved records:", repository.loadAll());


// REQUIRED CHALLENGE 8: TASK STATISTICS

function getTaskStats(tasks) {
  const total = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  const open = total - completed;

  const completionRate = total === 0
    ? 0
    : (completed / total) * 100;

  const countsByPriority = tasks.reduce((counts, task) => {
    counts[task.priority] = (counts[task.priority] || 0) + 1;
    return counts;
  }, {});

  return {
    total,
    completed,
    open,
    completionRate,
    countsByPriority
  };
}

console.log("Task statistics:", getTaskStats(sampleTasks));

console.log("Empty statistics:", getTaskStats([]));


// MANUAL TESTS

function runTest(name, testFunction) {
  try {
    testFunction();
    console.log("PASS:", name);
  } catch (error) {
    console.error("FAIL:", name, error.message);
  }
}

runTest("Create a task", () => {
  const task = new Task(20, "Test task");
  if (task.title !== "Test task") throw new Error("Task creation failed");
});

runTest("Complete a task", () => {
  const task = new Task(21, "Complete me");
  task.complete();
  if (!task.completed) throw new Error("Completion failed");
});

runTest("Filter open tasks", () => {
  const open = sampleTasks.filter(task => !task.completed);
  if (open.length !== 3) throw new Error("Open task count is incorrect");
});

runTest("Reject blank title", () => {
  let rejected = false;

  try {
    new Task(22, "   ");
  } catch (error) {
    rejected = true;
  }

  if (!rejected) throw new Error("Blank title was accepted");
});

runTest("Reject duplicate task ID", () => {
  let rejected = false;

  try {
    addTask(sampleTasks, {
      id: 1,
      title: "Duplicate",
      completed: false,
      priority: "low"
    });
  } catch (error) {
    rejected = true;
  }

  if (!rejected) throw new Error("Duplicate ID was accepted");
});

runTest("Unknown ID preserves tasks when toggling", () => {
  const result = toggleTask(sampleTasks, 999);

  if (result.some((task, index) => task.completed !== sampleTasks[index].completed)) {
    throw new Error("Unknown ID changed a task");
  }
});

runTest("Empty task statistics return zero", () => {
  const stats = getTaskStats([]);

  if (stats.total !== 0 || stats.completionRate !== 0) {
    throw new Error("Empty statistics are incorrect");
  }
});

runTest("Priority counts equal total", () => {
  const stats = getTaskStats(sampleTasks);

  const priorityTotal = Object.values(stats.countsByPriority)
    .reduce((sum, count) => sum + count, 0);

  if (priorityTotal !== stats.total) {
    throw new Error("Priority counts do not equal total");
  }
});

console.log("DAY 2 PRACTICE COMPLETED");

