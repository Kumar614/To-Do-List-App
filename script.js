document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const todoList = document.getElementById('todo-list');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const dateDayDisplay = document.querySelector('.date-day');

  // Display current date and day
  function updateDateDay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    dateDayDisplay.textContent = formattedDate;
  }

  updateDateDay();

  // Load tasks from localStorage or start with empty array
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Render tasks in the list
  function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (task.completed) {
        li.classList.add('completed');
      }
      li.setAttribute('data-index', index);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.id = `task-${index}`;
      checkbox.setAttribute('aria-label', `Mark task '${task.text}' as complete`);

      const label = document.createElement('label');
      label.htmlFor = `task-${index}`;
      label.textContent = task.text;

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.setAttribute('aria-label', `Delete task '${task.text}'`);
      delBtn.textContent = '×';

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  }

  // Add new task
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  });

  // Toggle completion or delete task using event delegation
  todoList.addEventListener('click', e => {
    const li = e.target.closest('li.todo-item');
    if (!li) return;
    const index = parseInt(li.getAttribute('data-index'));

    if (e.target.matches('input[type="checkbox"]')) {
      tasks[index].completed = e.target.checked;
      saveTasks();
      renderTasks();
    } else if (e.target.matches('button.delete-btn')) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  });

  // Clear all completed tasks
  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
  });

  // Initial rendering
  renderTasks();
});
