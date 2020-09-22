// set up for delegating click responsibility to the <main> element containing the DOM button elements
var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;
// the document method 'querySelector' returns the first element within the document that matches the specified selector/s - if none found, returns 'null'
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

    //add task id as a custom attribute
    taskItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give newly created div a class name
    taskInfoEl.className = 'task-info';
    // add HTML content to newly created div; will be read as an HTML tag and rendered as an HTML element in the DOM; the h3 and span tags could also be created as separate variables and added individually as elements in the DOM
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
    taskItemEl.appendChild(taskInfoEl);

    // we're using 'taskIdCounter' as the argument to create buttons that correspond to the current task ID; 'createTaskActions' returns a DOM element which is being stored in the variable 'taskActionsEl'
    var taskActionsEl = createTaskActions(taskIdCounter);
    taskItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(taskItemEl);

    //increase task counter for next unique id
    taskIdCounter++;
}

var createTaskActions = function(taskId) {
    // this div will act as container for other elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    // adds edit button to the div
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    // adds delete button to the div
    actionContainerEl.appendChild(deleteButtonEl);

    // this will add an empty select element to the div; the option elements will come next
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("Name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // these will provide the basis for the option elements to the select element dropdown; adding as an array makes it easy to add new options to this dropdown at a later date
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i=0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", createFormHandler);

var taskButtonHandler = function(event) {
    // 'event.target' reports the element on which the event occurs e.g. the click event, in this case.
    console.log(event.target);

    // the 'matches' method works similarly to 'querySelector' except it checks to see if an element matches certain criteria and returns "true" if so and "false" if not, whereas 'querySelector' finds and returns an element.
    if (event.target.matches(".delete-btn")) {
        // // testing to see whether the matches method is working properly
        // console.log("you clicked a delete button!");
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        // console.log(taskId);
    }

    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
    
};

// a separate function to handle the deletion of tasks
var deleteTask = function(taskId) {
    // // another check to make sure the new function is reporting as expected
    // console.log(taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // // checking to see whether the correct task item is selected for deletion
    // console.log(taskSelected);
    taskSelected.remove()
}

// an event listener for the 'edit', 'delete' and 'status' buttons
pageContentEl.addEventListener("click", taskButtonHandler);


