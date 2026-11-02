// DAY 4 - CHALLENGE 49
// Understanding Promise states

console.log("Promise practice started");

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise completed successfully!");
  }, 2000);
});

myPromise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });

async function showMessage() {
  console.log("Waiting for the Promise...");

  const result = await myPromise;

  console.log("Async result:", result);
}

showMessage();


// CHALLENGE 50, 51 AND 52
// Fetch, display and retry suggestions
let currentController = null;

async function loadSuggestions() {
    if (currentController) {
  currentController.abort();
}

currentController = new AbortController();

  const status = document.querySelector("#suggestion-status");
  const suggestionsList = document.querySelector("#suggestions-list");
  const retryButton = document.querySelector("#retry-suggestions");
retryButton.disabled = true;


  try {
    status.textContent = "Loading suggestions...";
    retryButton.disabled = false;


    console.log("Loading suggestions...");

   const response = await fetch(
"https://jsonplaceholder.typicode.com/todos?_limit=5",



  {
    signal: currentController.signal
  }
);


    if (!response.ok) {
      throw new Error("Failed to load suggestions.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data received.");
    }
    if (data.length === 0) {
  status.textContent = "No suggestions found. Please try again.";
  retryButton.disabled = false;
  suggestionsList.innerHTML = "";
  return;
}


    console.log("Suggestions loaded:", data);

    status.textContent = "Suggestions loaded successfully.";

    suggestionsList.innerHTML = "";

    data.forEach(suggestion => {
      const item = document.createElement("li");
      const button = document.createElement("button");

      button.textContent = suggestion.title;

      button.addEventListener("click", () => {
        document.querySelector("#suggestion-task-title").value =
          suggestion.title;
      });

      item.appendChild(button);
      suggestionsList.appendChild(item);
    });

  } catch (error) {
    console.error("Error:", error.message);
    if (error.name === "AbortError") {
  console.log("Previous request cancelled.");
  return;
}


    status.textContent =
      "Could not load suggestions. Please try again.";
      retryButton.disabled = false;

  }
} // THIS CLOSING BRACE WAS MISSING!
// Initial idle state
document.querySelector("#suggestion-status").textContent =
  "Ready to load suggestions.";

// Load suggestions when the page opens
loadSuggestions();

// Retry button
document
  .querySelector("#retry-suggestions")
  .addEventListener("click", loadSuggestions);
