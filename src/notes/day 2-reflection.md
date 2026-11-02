
# Day 2 – Model Collections and Design with Objects

## 1. What I Learned

Today I learned how to represent information using JavaScript arrays and objects.

An array stores an ordered collection of values, while an object stores related information using named properties.

I practised creating task objects containing an ID, title, completion status, priority and creation date.

## 2. Arrays and Objects

I learned that arrays start counting from index 0.

I also learned how to access and update object properties using dot notation.

Objects make it easier to organise related information about individual tasks.

## 3. References and Immutability

Arrays and objects are reference values.

Assigning an array to another variable does not automatically create a separate copy.

I practised using the spread operator to create copies and return updated arrays without directly changing the original array.

## 4. Array Methods

I practised the following methods:

- map() transforms array items.
- filter() selects items that meet a condition.
- find() returns the first matching item.
- some() checks whether at least one item meets a condition.
- every() checks whether all items meet a condition.
- reduce() combines array items into a summary.

## 5. Object-Oriented Programming

I created a Task class with a constructor, properties and methods.

I learned that a constructor initialises an object, an instance is an object created from a class, and methods define the behaviour of that object.

I also used a private field to protect the completion status of a task.

## 6. Inheritance and Composition

I practised inheritance by creating a ReminderTask class that extends Task.

I also practised composition by attaching optional reminder information to a task.

I chose composition as the simpler approach for my Task Manager because reminders are optional information attached to tasks rather than a completely different type of task.

## 7. Task Management and Repository

I created a TaskList class to manage tasks and a TaskRepository class to demonstrate separate data-storage responsibilities.

This helped me understand why application data, task behaviour and user interface code should be organised separately.

## 8. Required Challenges

I completed the following challenges:

- Challenge 5: Immutable toggle.
- Challenge 6: Purchase summary.
- Challenge 7: Inheritance and composition.
- Challenge 8: Task statistics.

I also tested task creation, completion, filtering, blank titles, duplicate IDs, unknown IDs and empty task lists.

## 9. Challenges and Debugging

I learned that invalid data should be handled carefully.

For example, a task should not be created with an empty title, and duplicate task IDs should be rejected.

I also learned that returning a new array helps prevent unexpected changes to existing data.

## 10. Conclusion

Day 2 improved my understanding of JavaScript collections, objects, array methods, classes, encapsulation and composition.

These concepts are useful when building a task management application because they make the code easier to organise, maintain and test.

