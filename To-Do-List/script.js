// Initial Setup
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");
const greeting = document.getElementById("greeting");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let userName = localStorage.getItem("userName") || "";

// Load user data and tasks
if (userName) {
    greeting.textContent = `Hi ${userName}, create your to-do list with Samie`;
}
renderTasks();

// Set User Name
function setUserName() {
    userName = document.getElementById("userName").value;
    if (userName) {
        localStorage.setItem("userName", userName);
        greeting.textContent = `Hi ${userName}, create your to-do list with Samie`;
    }
}

// Add a New Task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");

    if (taskInput.value && taskTime.value) {
        const newTask = {
            id: Date.now(),
            text: taskInput.value,
            time: taskTime.value,
            completed: false
        };
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        taskTime.value = "";
        renderTasks();
        showLoader();
    }
}

// Render Tasks on Screen
function renderTasks() {
    taskList.innerHTML = "";
    let completedTasks = 0;
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.toggle("completed", task.completed);
        li.innerHTML = `
            <span>${task.text} - ${task.time}</span>
            <button onclick="markComplete(${task.id})">✔️</button>
            <button onclick="editTask(${task.id})">✏️</button>
            <button onclick="deleteTask(${task.id})">❌</button>
        `;
        taskList.appendChild(li);

        if (task.completed) completedTasks++;
    });

    const totalTasks = tasks.length;
    progressText.textContent = `${completedTasks}/${totalTasks}`;
    hideLoader();
}

// Mark Task as Complete
function markComplete(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    task.completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    setTimeout(() => alert("Well done! You completed a task! 🎉"), 500);
}

// Edit Task
function editTask(taskId) {
    const newTaskText = prompt("Edit your task:");
    if (newTaskText) {
        const task = tasks.find((t) => t.id === taskId);
        task.text = newTaskText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

// Delete Task
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Show Loader
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

// Hide Loader
function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// Email Notification (using EmailJS)
function sendEmailNotification(task) {
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: 'user@example.com',
        subject: 'Your To-Do is Up!',
        message: `It's time for your task: ${task.text} at ${task.time}`
    }).then(response => {
        console.log('Email sent successfully:', response);
    }).catch(err => {
        console.error('Error sending email:', err);
    });
}

// Listen for task times to trigger notifications (every minute check)
setInterval(() => {
    const now = new Date().toLocaleTimeString();
    tasks.forEach(task => {
        if (task.time === now && !task.completed) {
            sendEmailNotification(task);
        }
    });
}, 60000); // Check every minute
