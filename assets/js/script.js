var buttonE1 = document.querySelector("#save-task");
console.log(buttonE1);

var taskItemE1 = document.createElement("li");
taskItemE1.textContent = "hello";
taskItemE1.className = "task-item";

var tasksToDoE1 = document.querySelector("#tasks-to-do");
tasksToDoE1.appendChild(taskItemE1);