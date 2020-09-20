var buttonE1 = document.querySelector("#save-task");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var taskItemE1 = document.createElement("li");
    taskItemE1.className = "task-item";
    taskItemE1.textContent = "This is a new task.";
    tasksToDoE1.appendChild(taskItemE1);
}

buttonE1.addEventListener("click", createTaskHandler);


