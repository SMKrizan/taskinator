var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {

    event.preventDefault();

    var taskItemE1 = document.createElement("li");
    taskItemE1.className = "task-item";
    taskItemE1.textContent = "This is a new task.";
    tasksToDoE1.appendChild(taskItemE1);
}

formE1.addEventListener("submit", createTaskHandler);


