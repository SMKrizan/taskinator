var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createFormHandler = function (event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check whether input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("Please enter a task into the task form!");
        return false;
    }

    formEl.reset();

    //package data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send object as an argument to createTaskEl
    createTaskEl(taskDataObj);
}

// this function will be provided with both the task's title and type - we could set up two parameters, one for each piece of data, but this may require providing more info for each task, so instead we are settin up the function to accept an object as an argument.
var createTaskEl = function (taskDataObj) {
    // create list item
    var taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give newly created div a class name
    taskInfoEl.className = 'task-info';
    // add HTML content to newly created div; will be read as an HTML tag and rendered as an HTML element in the DOM; the h3 and span tags could also be created as separate variables and added individually as elements in the DOM
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";

    taskItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    tasksToDoEl.appendChild(taskItemEl);
}

formEl.addEventListener("submit", createFormHandler);


