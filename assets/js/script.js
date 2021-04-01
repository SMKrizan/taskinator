var taskIdCounter = 0;

// 'querySelector' document method returns 1st element within the document that matches specified selector/s - if none found, returns 'null'
// 'pageContentEl' delegates click responsibility to <main> element that will contain DOM button elements
var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// setting up an empty array to hold task data as objects
var tasks = [];

var createFormHandler = function (event) {
    // prevents legacy browser behavior e.g. auto page-reloading
    event.preventDefault();
    // square brackets in a selector indicate selection of an element by one of its attributes
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check whether input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("Please enter a task into the task form!");
        return false;
    }
    // calls function which resets form fields following each submission
    formEl.reset();

    // lets us know whether an element has a certain attribute, in this case, upon clicking the 'add task/edit task' button it will tell us whether the task is a new or edited (old) task.
    var isEdit = formEl.hasAttribute("data-task-id");

    // if 'isEdit' is true, this function will be called
    var completeEditTask = function (taskName, taskType, taskId) {
        // tests whether 'completeEditTask' works properly
        // console.log(taskName, taskType, taskId);
        //finds matching task list item
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

        // sets new values; note: 'h3.task-name' yields a different query result than 'h3 .task-name'. The former will look for an h3. element with a class of 'task-name', whereas the latter will look for an element with class of 'task-name' that is a descendent element of an <h3> element.
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;

        // loops through tasks array and task object with new content; since 'taskId' is a string and 'tasks[i].id' is a number we wrap taskId with parsInt() to convert it to a number for comparison. If the two ID values match, the the name and type properties will be updated.
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === taskIdCounter) {
                tasks[i].name = taskName;
                tasks[i].type = taskType;
            }
        }

        saveTasks()

        alert("Task Updated!");

        // resets task entry form by removing task ID and changing the button text back to 'add task' from 'edit task'
        formEl.removeAttribute("data-task-id");
        document.querySelector("#save-task").textContent = "Add Task";
    };

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj);
    }
}

// function is provided task's title and type within 'taskDataObj' as an argument, rather than passing two parameters, one for each piece of data.
var createTaskEl = function (taskDataObj) {
    // creates list item
    var taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    //adds task id as a custom attribute
    taskItemEl.setAttribute("data-task-id", taskIdCounter);

    // dynamically adds 'draggable' attribute to tasks
    taskItemEl.setAttribute("draggable", "true");

    // creates div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // gives class name to newly created div 
    taskInfoEl.className = 'task-info';
    // adds HTML content to newly created div; will be read as an HTML tag and rendered as an HTML element in the DOM
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
    taskItemEl.appendChild(taskInfoEl);

    // uses 'taskIdCounter' as argument to create buttons corresponding to current task ID; 'createTaskActions' returns a DOM element which is stored in the variable 'taskActionsEl'
    var taskActionsEl = createTaskActions(taskIdCounter);
    taskItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(taskItemEl);

    // adds value of ID as a property to the 'taskDataObj' argument variable and adds entire oject to tasks array; will use this ID to identify which task has changed for both the DOM and the 'tasks' array. The 'push' method adds any content between the parentheses to the end of the specified array ('tasks').
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks()

    //increase task counter for next unique id
    taskIdCounter++;

    // // tests whether 'taskDataObj' contains/displays all desired data
    // console.log(taskDataObj);
    // console.log(taskDataObj.status);
}

var createTaskActions = function (taskId) {
    // acts as container for other elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // creates edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    // adds edit button to div
    actionContainerEl.appendChild(editButtonEl);

    //creates delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    // adds delete button to div
    actionContainerEl.appendChild(deleteButtonEl);

    // adds empty select element to div
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("Name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // provides the basis for option elements to the select element dropdown; adding as an array makes it easy to add new options to this dropdown at a later date
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // creates option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // appends to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

//this function listens to events on the entire <main> element of the document
var taskButtonHandler = function (event) {
    // // 'event.target' reports the element on which the event occurs e.g. the click event
    // console.log(event.target);

    // get target element from event
    var targetEl = event.target;

    // EDIT BUTTON was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // DELETE BUTTON was clicked; the 'matches' method works similarly to 'querySelector' except its response is boolean, whereas 'querySelector' finds and returns an element.
    else if (targetEl.matches(".delete-btn")) {
        // // tests whether 'matches' method is working properly
        // console.log("you clicked a delete button!");
        // gets element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        // console.log(taskId);
        deleteTask(taskId);
    }
};

// handles task editing
var editTask = function (taskId) {
    // // tests whether new elements are producing expected results
    // console.log("editing task #" + taskId);

    // gets task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // gets content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // // tests whether the query is set up correctly
    // console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // // tests whether the query is set up correctly
    // console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // 'add task' button will change to 'save task' once the 'edit' button has been clicked
    document.querySelector("#save-task").textContent = "Save Task";

    // uses 'taskId' to create 'data-task-id' attribute on the form in order save the correct task
    formEl.setAttribute("data-task-id", taskId);
    // console.log(formEl);
};

// handles task deletion
var deleteTask = function (taskId) {
    // // checks whether new function is reporting as expected
    // console.log(taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // // checks whether correct task item is selected for deletion
    // console.log(taskSelected);
    taskSelected.remove()

    // creates new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loops through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id does not match the value of taskId, task is kept
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // when updating task info we only have to overwrite the info, but to delete we have to create a new array of tasks that does not include the deleted task; reassigns tasks array to values of updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks()
}

// handles changing of options within the 'status' button
var taskStatusChangeHandler = function (event) {
    // // 'event.target' is a reference to a 'select' element, meaning we can use additional DOM methods to get this element's properties
    // console.log(event.target);
    // console.log(event.target.getAttribute("data-task-id"));
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // gets currently-selected option's value and converts to lowercase - can help down the road if we ever change how the status text is displayed; this way we'll always check against the lowercase version, code-wise.
    var statusValue = event.target.value.toLowerCase();

    // finds parent task item element by id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // elements 'tasksToDoEl', 'tasksInProgressEl' and 'tasksCompletedEl', reference <ul> elements created earlier; if user selects one of these from the dropdown, it will append the current task item to the <ul id="tasks-in-progress"> element with the 'tasksInProgressEl.appendChild(taskSelected)' method. Also note - using 'appendChild' here does not create a copy of the task, it moves the task from its original location in the DOM into the other <ul>. Also note - the 'taskSelected' didn't create a second <li>, it references an existing DOM element which we appended somewhere else.
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // upates task status in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks()
};

var dragTaskHandler = function (event) {
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
    // // verifies that 'data-task-id' is stored successfully in the 'dattaTransfer' property object, with taskId reporting unique numerical ID and type of taskId reporting 'string'; because the drag and drop actions are both of the type 'DragEvent', we can access their properties during dragging and later during dropping.
    // console.log("getId:", getId, typeof getId);
}

var dropZoneDragHandler = function (event) {
    // verifies dragover event listener is working and checks which element is being targeted
    // console.log("Dragover Event Target:", event.target);
    // limits droppable area to the task list or a child element thereof
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        // verifies drop area
        // console.dir(taskListEl);

        // adds styling to the drop zone in order to signal to the user where the tasks can be placed
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}

var dropTaskHandler = function (event) {
    // 'data'task'id' value was stored in the 'dataTransfer' property using 'setData' method, and now retrieved using 'getData' method
    var id = event.dataTransfer.getData("text/plain");
    // // tests whether unique task id is identified and drop destination are identified properly
    // console.log("Drop Event Target:", event.target, event.dataTransfer, id);
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    // // uses 'querySelector' method on 'data-task-id' attribute to locate dragged task item with unique task ID and confirms it is stored within the dataTransfer object
    // console.log(draggableElement);
    // console.dir(draggableElement);
    // uses 'closest' method to return corresponding task list element of the drop zone 
    var dropZoneEl = event.target.closest(".task-list");
    // uses 'id' property of task list element to retrieve 'id' attribute to and identify which task list was dropped on, to designate task status
    var statusType = dropZoneEl.id;
    // console.log(statusType);
    // console.dir(dropZoneEl);
    //sets status of task based on dropZone id; note the use of 'draggableElement' rather than 'document' as the reference point of the 'querySelector' method; 'document' would choose the first of all task items in the DOM tree, rather than the one that needs to change which is the one that was dragged.
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    // console.dir(statusSelectEl);
    // console.log(statusSelectEl);

    // uses 'selectedIndex' property to map the 'status' option to a list value by specifying option's position in order to assign appropriate status value.
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

    //loops through tasks array to find and update task status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks()
}

// delegates dragLeave to parent of the three task lists
var dragLeaveHandler = function (event) {
    // // displays 'dragLeave' DOM element which stores every element that dragged task item has been dragged over but no longer actively dragged on 
    // console.dir(event.target);
    // should execute only when dragged element leaves a task list or child thereof 
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// saves packaged task info array to localStorage (localStorage can only read strings, so data is converted via JavaScriptObjectNotation (JSON))
var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// gets tasks from localStorage, converts from string format back into an array of objects and iterates through tasks array to create the elements on the page
var loadTasks = function () {
    // gets tasks from localStorage and accounts for instance of no saved tasks
    var savedTasks = localStorage.getItem("tasks");
    
    if (savedTasks === null) {
        return false;
    }
    // converts from string to array of objects
    savedTasks = JSON.parse(savedTasks);

    // iterates through tasks array to create elements on the page
    for (var i = 0; i < savedTasks.length; i++) {
    // passes each task object into the 'createTaskEl()' function
    createTaskEl(savedTasks[i]);
    }
}


formEl.addEventListener("submit", createFormHandler);

// event listener for 'edit', 'delete' and 'status' buttons
pageContentEl.addEventListener("click", taskButtonHandler);
// event listener for 'status' button options
pageContentEl.addEventListener("change", taskStatusChangeHandler);
// event listener to facilitate task drag-and-drop
pageContentEl.addEventListener("dragstart", dragTaskHandler);
// event listener for dragover event to <main>, the parent element of all three task lists. The 'dropZoneDragHandler' is passed as a callback; if we included the () at the end it would immediately call the function.
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks()