const SUGGESTIONS_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchSuggestions() {
  const response = await fetch(SUGGESTIONS_URL);

  if (!response.ok) {
    throw new Error("Could not load suggestions. Please try again.");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("The server returned invalid information.");
  }

  return data.slice(0, 10).map(item => ({
    id: item.id,
    title: String(item.title || "").trim(),
    completed: Boolean(item.completed)
  })).filter(item => item.title.length > 0);
}
