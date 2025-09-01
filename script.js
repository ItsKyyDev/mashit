const dayList = document.querySelectorAll("#day-list li");
const dayTitle = document.getElementById("day-title");
const taskList = document.getElementById("task-list");
const taskText = document.getElementById("task-text");
const taskDate = document.getElementById("task-date");
const addTaskBtn = document.getElementById("add-task");

let currentDay = "Senin";
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  const today = new Date();
  const dayTasks = tasks[currentDay] || [];

  dayTasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("task");

    // hitung selisih hari deadline
    const deadline = new Date(task.deadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      div.classList.add("overdue");
    } else if (diffDays <= 3) {
      div.classList.add("deadline-soon");
    }

    div.innerHTML = `
      <p>${task.text}</p>
      <small>Deadline: ${task.deadline}</small>
      <button>✖</button>
    `;

    // hapus tugas
    div.querySelector("button").addEventListener("click", () => {
      tasks[currentDay].splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(div);
  });
}

addTaskBtn.addEventListener("click", () => {
  if (taskText.value.trim() === "" || taskDate.value === "") return;
  if (!tasks[currentDay]) tasks[currentDay] = [];
  tasks[currentDay].push({ text: taskText.value, deadline: taskDate.value });
  taskText.value = "";
  taskDate.value = "";
  saveTasks();
  renderTasks();
});

// Ganti hari
dayList.forEach(li => {
  li.addEventListener("click", () => {
    dayList.forEach(l => l.classList.remove("active"));
    li.classList.add("active");
    currentDay = li.dataset.day;
    dayTitle.textContent = li.dataset.day;
    renderTasks();
  });
});

// render awal
renderTasks();