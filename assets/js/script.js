var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // create list item
    var taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give newly created div a class name
    taskInfoEl.className = 'task-info';
    // add HTML content to newly created div; will be read as an HTML tag and rendered as an HTML element in the DOM; the h3 and span tags could also be created as separate variables and added individually as elements in the DOM
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskNameInput + "</h3><span class = 'task-type'>" + taskTypeInput + "</span>";
    
    taskItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    tasksToDoEl.appendChild(taskItemEl);
}

formEl.addEventListener("submit", createTaskHandler);


