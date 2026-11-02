const SUGGESTIONS_URL =
  "https://jsonplaceholder.typicode.com/todos?_limit=5";

// REQUIRED CHALLENGE 14
// Clean and validate suggestions from an external source.
export function normalizeSuggestions(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter(item =>
      item !== null &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      typeof item.title === "string" &&
      item.title.trim().length > 0
    )
    .slice(0, 5)
    .map(item => ({
      id: item.id,
      title: item.title.trim(),
      completed: Boolean(item.completed)
    }));
}

// Load suggestions from the internet.
export async function fetchSuggestions() {
  const response = await fetch(SUGGESTIONS_URL);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();

  return normalizeSuggestions(data);
}
// CHALLENGE 14 TESTS

console.log("Test null:", normalizeSuggestions(null));

console.log("Test wrong type:", normalizeSuggestions("hello"));

console.log("Test empty array:", normalizeSuggestions([]));

console.log(
  "Test empty title:",
  normalizeSuggestions([
    { id: 1, title: "" },
    { id: 2, title: "   " },
    { id: 3, title: "Learn JavaScript" }
  ])
);

console.log(
  "Test more than five:",
  normalizeSuggestions([
    { id: 1, title: "Task 1" },
    { id: 2, title: "Task 2" },
    { id: 3, title: "Task 3" },
    { id: 4, title: "Task 4" },
    { id: 5, title: "Task 5" },
    { id: 6, title: "Task 6" }
  ])
);
// CHALLENGE 13: Load two independent requests together

export async function fetchDashboardData() {
  const [todosResponse, usersResponse] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5"),
    fetch("https://jsonplaceholder.typicode.com/users?_limit=5")
  ]);

  if (!todosResponse.ok || !usersResponse.ok) {
    throw new Error("One or more requests failed.");
  }

  const [todos, users] = await Promise.all([
    todosResponse.json(),
    usersResponse.json()
  ]);

  return {
    todos,
    users
  };
}
// TEST CHALLENGE 13

fetchDashboardData()
  .then(data => {
    console.log("Promise.all test - Todos:", data.todos);
    console.log("Promise.all test - Users:", data.users);
  })
  .catch(error => {
    console.error("Promise.all test failed:", error.message);
  });
  