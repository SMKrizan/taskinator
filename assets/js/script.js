// set up for delegating click responsibility to the <main> element containing the DOM button elements
var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;
// the document method 'querySelector' returns the first element within the document that matches the specified selector/s - if none found, returns 'null'
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// two variables for interacting with 'Tasks in Progress' and 'Tasks Completed' columns
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// setting up an empty array to hold task data as objects
var tasks = [];

var createFormHandler = function(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check whether input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("Please enter a task into the task form!");
        return false;
    }

    formEl.reset();

    // will let us know whether an element has a certain attribute, in this case, upon clicking the 'add task/edit task' button it will tell us whether the task is a new or edited (old) task.
    var isEdit = formEl.hasAttribute("data-task-id");

    // //package data as an object
    // var taskDataObj = {
    //     name: taskNameInput,
    //     type: taskTypeInput,
    //     status: "to do",
    // };

    // if 'isEdit' is true, this function will be called
    var completeEditTask = function(taskName, taskType, taskId) {
        // // testing to see whether completeEditTask is working properly
        // console.log(taskName, taskType, taskId);
        //find the matching task list item
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

        // set new values; note: 'h3.task-name' will yield a different query result from 'h3 .task-name'. The former will look for ,h3. elements with a class of 'task-name', whereas the latter will look for elements with a class of 'task-name' that are descendent elements of an <h3> element.
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;

        debugger
        // loop through tasks array and task object with new content; since 'taskId' is a string and 'tasks[i].id' is a number we wrap taskId with parsInt() to convert it to a number for comparison. If the two ID values match, the the name and type properties will be updated.
        for (var i=0; i<tasks.length; i++) {
            if (tasks[i].id === parseInt(taskId)) {
                tasks[i].name = taskName;
                tasks[i].type = taskType;
            }
        }
        debugger

        alert("Task Updated!");

        // reset task entry form by removing task ID and changing the button text back to 'add task' from 'edit task'
        formEl.removeAttribute("data-task-id");
        document.querySelector("#save-task").textContent = "Add Task";
    };

    // wraps the 'createTaskEl' call and 'taskDataObj' variable in an if/else statement
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    // no data attribute ('isEdit" is false), so create object as normal and pass to 'createTaskEl' function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
}

// this function will be provided with both the task's title and type - we could set up two parameters, one for each piece of data, but this may require providing more info for each task, so instead we are settin up the function to accept an object as an argument.
var createTaskEl = function (taskDataObj) {
    // create list item
    var taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    //add task id as a custom attribute
    taskItemEl.setAttribute("data-task-id", taskIdCounter);

    // dynamically adding the 'draggable' attribute to tasks
    taskItemEl.setAttribute("draggable", "true");

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

    // adding value of ID as a property to the 'taskDataObj' argument variable and adding entire oject to the tasks array; will use this ID to identify which task has changed for both the DOM and the 'tasks' array. The 'push' method adds any content between the parentheses to the end of the specified array ('tasks').
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    //increase task counter for next unique id
    taskIdCounter++;

    // testing whether 'taskDataObj' contains/displays all desired data
    console.log(taskDataObj);
    console.log(taskDataObj.status);
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

//this function listens to events on the entire <main> element of the document
var taskButtonHandler = function(event) {
    // // 'event.target' reports the element on which the event occurs e.g. the click event, in this case.
    // console.log(event.target);

    // get target element from event
    var targetEl = event.target;

    // EDIT BUTTON was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }


    // DELETE BUTTON was clicked; the 'matches' method works similarly to 'querySelector' except it checks to see if an element matches certain criteria and returns "true" if so and "false" if not, whereas 'querySelector' finds and returns an element.
    else if (targetEl.matches(".delete-btn")) {
        // // testing to see whether the matches method is working properly
        // console.log("you clicked a delete button!");
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        // console.log(taskId);
        deleteTask(taskId);
    }    
};

// a seperate function to handle task editing
var editTask = function(taskId) {
    // // test to make sure the new elements are producing the expected results
    // console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // // testing to see whether the query is set up correctly
    // console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // // testing to see whether the query is set up correctly
    // console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // the 'add task' button will change to 'save task' once the 'edit' button has been clicked
    document.querySelector("#save-task").textContent = "Save Task";

    // add the 'taskId' to a 'data-task-id' attribute on the form itself; users will not see this attribute but it can be used later to save the correct task
    formEl.setAttribute("data-task-id", taskId);
    console.log(formEl);
};

// a separate function to handle the deletion of tasks
var deleteTask = function(taskId) {
    // // another check to make sure the new function is reporting as expected
    // console.log(taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // // checking to see whether the correct task item is selected for deletion
    // console.log(taskSelected);
    taskSelected.remove()

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i=0; i<tasks.length; i++) {
        // if tasks[i].id does not match the value of taskId, task is kept
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // when updating task info all we have to to is overwrite the info, but to delete we have to create a new array of tasks that does not include the deleted task; reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
}

// a function to handle the changing of options within the 'status' button
var taskStatusChangeHandler = function(event) {
// // 'event.target' is a reference to a 'select' element, meaning we can use additional DOM methods to get this element's properties
// console.log(event.target);
// console.log(event.target.getAttribute("data-task-id"));
// get the task item's id
var taskId = event.target.getAttribute("data-task-id");

// get the currently selected option's value and convert to lowercase - this may help down the road if we ever change how the status text is displayed; this way we'll always check against the lowercase version, code-wise.
var statusValue = event.target.value.toLowerCase();

// find the parent task item element based on the id
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// the following elements ('tasksToDoEl', 'tasksInProgressEl' and 'tasksCompletedEl') reference the <ul> elements created earlier; if user selects one of these from the dropdown, it will append the current task item to the <ul id="tasks-in-progress"> element with the 'tasksInProgressEl.appendChild(taskSelected)' method. Also note - using 'appendChild' here does not create a copy of the task, it moves the task from its original location in the DOM into the other <ul>. Also note - the 'taskSelected' didn't create a second <li>, it references an existing DOM element which we appended somewhere else.
if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
}
else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
}
else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
}

// upate task status in tasks array
for (var i=0; i<tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
    }
    console.log(tasks);
}
};

var dragTaskHandler = function(event) {
    // // the 'event.target' DOM element is the task item element that has the 'data-task-id' attribute with numerical value unique to the task item being moved
    // console.log("event.target:", event.target);
    // // with this DOM element we can verify this as a 'dragstart' event
    // console.log("event.type:", event.type);
    var taskId = event.target.getAttribute("data-task-id");
    // console.log("Task ID:", taskId);
    // // within the DOM element 'event' is 'dataTransfer', a data storage property; we will save 'taskId' within this property using 'setData' and 'getData' methods
    // console.log("event", event);
    // store the unique 'taskId' in the 'dataTransfer' property of the 'event' element using the 'setData' method, which takes two arguments: data format and data value.
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    // testing to verify the 'data-task-id' is stored successfully in the 'dattaTransfer' property object, with taskId reporting the unique numerical ID and the type of taskId reporting 'string'; because the drag and drop actions are both of the type 'DragEvent', we can access their properties during dragging and later during dropping.
    console.log("getId:", getId, typeof getId);
}

var dropZoneDragHandler = function(event) {
    // // verify that the dragover event listener is working and check which element is being targeted
    // console.log("Dragover Event Target:", event.target);
    // this limits the droppable area to be the task list or a child element thereof
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        // // verify the drop area
        // console.dir(taskListEl);

        // adding styling to the drop zone in order to signal to the user where the tasks can be placed
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}

var dropTaskHandler = function(event) {
    // the 'data'task'id' value was stored in the 'dataTransfer' property using the 'setData' method, and now it is being retrieved using the 'getData' method
    var id = event.dataTransfer.getData("text/plain");
    // // testing to ensure the unique task id is identified and drop destination are identified properly
    // console.log("Drop Event Target:", event.target, event.dataTransfer, id);
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    // // using 'querySelector' method on 'data-task-id' attribute to locate dragged task item with unique task ID and then confirm that it is stored within the dataTransfer object
    // console.log(draggableElement);
    // console.dir(draggableElement);
    // using 'closest' method to return corresponding task list element of the drop zone 
    var dropZoneEl = event.target.closest(".task-list");
    // use 'id' property of task list element to retrieve 'id' attribute to and identify which task list was dropped on, to designate task status
    var statusType = dropZoneEl.id;
    // console.log(statusType);
    // console.dir(dropZoneEl);
    //set status of task based on dropZone id; note the use of 'draggableElement' rather than 'document' as the reference point of the 'querySelector' method; 'document' would choose the first of all task items in the DOM tree, rather than specifically the one that needs to change, which is the one that was dragged.
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    // console.dir(statusSelectEl);
    // console.log(statusSelectEl);
    // using 'selectedIndex' property to map the 'status' option to a list value by specifying the option's position in order to assign the appropriate status value.
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }

    // removes dragover styling just before task item is attached to new task list
    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);

    //loop through tasks array to find and update task status
    for (var i=0; i<tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    console.log(tasks);
}

// delegating dragLeave to the parent of the three task lists
var dragLeaveHandler = function(event) {
    // // displays 'dragLeave' DOM element which stores every element that dragged task item has been dragged over but no longer actively dragged on 
    // console.dir(event.target);
    // should execute only when dragged element leaves a task list or child thereof 
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// an event listener for the 'edit', 'delete' and 'status' buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// an event listener for the 'status' button options
pageContentEl.addEventListener("change", taskStatusChangeHandler);

// an event listener to facilitate task drag-and-drop
pageContentEl.addEventListener("dragstart", dragTaskHandler);

// an event listener for dragover event to <main>, the parent element of all three task lists. The 'dropZoneDragHandler' is passed as a callback if we included the () at the end it would immediately call the function.
pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);


