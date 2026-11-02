
# Day 3 – Make the Browser Interactive and Persistent

## 1. What I Learned

Today I learned how JavaScript interacts with HTML through the Document Object Model (DOM).

The DOM allows JavaScript to select, create, update and remove elements on a web page.

## 2. DOM Selection and Rendering

I practised selecting HTML elements using querySelector().

I used createElement(), textContent() and append() to display tasks on the page.

I also created an empty-state message for when there are no matching tasks.

## 3. Events and Event Delegation

I learned how event listeners respond to user actions such as clicking buttons and submitting forms.

I used event delegation to manage task actions from one listener on the task list.

The closest() method identifies which action button was clicked, while data attributes identify the task.

## 4. Form Validation

I created form validation to ensure task titles are not empty and do not exceed 80 characters.

I also prevented duplicate task titles by comparing trimmed, lowercase versions of the titles.

Error messages are displayed near the input field, and the user can correct the information without losing the typed value.

## 5. Search and Filtering

I practised case-insensitive search and created All, Open and Completed filters.

I used filter() to display matching tasks without changing the original task collection.

## 6. Local Storage and JSON

I learned that localStorage saves information in the browser between page loads.

JSON.stringify() converts JavaScript data into a string, while JSON.parse() converts stored JSON back into JavaScript data.

I used a versioned storage key and added error handling for missing, invalid and corrupted data.

## 7. Safe Text and Accessibility

I used textContent instead of innerHTML when displaying task titles.

I added labels, keyboard-friendly buttons, visible focus styling and an aria-live status region to improve accessibility.

## 8. Required Challenges

I completed the following challenges:

- Challenge 9: Case-insensitive search.
- Challenge 10: Composable filters.
- Challenge 11: Duplicate prevention.
- Challenge 12: Corrupted storage recovery.

## 9. Testing

I tested task creation, task completion, deletion, search, filtering, duplicate titles and storage recovery.

I also checked that task information remains available after refreshing the browser.

## 10. Conclusion

Day 3 helped me understand how to connect JavaScript application data to a working browser interface.

I learned how DOM manipulation, events, validation, accessibility and localStorage work together to create a usable task manager.

