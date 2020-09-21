var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // create list item
    var taskItemE1 = document.createElement("li");
    taskItemE1.className = "task-item";

    // create div to hold task info and add to list item
    var taskInfoE1 = document.createElement("div");
    // give newly created div a class name
    taskInfoE1.className = 'task-info';
    // add HTML content to newly created div
    // taskInfoE1.innerHTML = "<h3 class = 'task-name'>" + taskNameInput + "</h3><span class = 'task-type'>" + taskTypeInput + "</span>";
    
    taskItemE1.appendChild(taskInfoE1);

    // add entire list item to list
    tasksToDoE1.appendChild(taskItemE1);

    taskItemE1.textContent = taskNameInput;
    tasksToDoE1.appendChild(taskItemE1);
}

formE1.addEventListener("submit", createTaskHandler);


