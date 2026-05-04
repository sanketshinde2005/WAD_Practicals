window.onload = function () {
    loadTasks();
};

function loadTasks() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/tasks", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var tasks = JSON.parse(xhr.responseText);
            var list = document.getElementById("taskList");
            list.innerHTML = "";

            tasks.forEach((task, index) => {
                list.innerHTML += `
                    <li>
                        ${task.name} 
                        [${task.completed ? "Done" : "Pending"}]
                        <button onclick="updateTask(${index})">Done</button>
                        <button onclick="deleteTask(${index})">Delete</button>
                    </li>
                `;
            });
        }
    };
    xhr.send();
}

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskName = taskInput.value;
    if (!taskName) return;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/tasks", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        taskInput.value = ""; // Clear input
        loadTasks(); // Refresh list via AJAX
    };
    xhr.send(JSON.stringify({ name: taskName }));
}

function updateTask(index) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/tasks/" + index, true);
    xhr.onload = function () {
        loadTasks();
    };
    xhr.send();
}

// DELETE: Remove task from the server
function deleteTask(index) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/tasks/" + index, true);
    xhr.onload = function () {
        loadTasks();
    };
    xhr.send();
}
