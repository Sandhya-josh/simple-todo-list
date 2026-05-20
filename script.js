// Selecting UI elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');

// Load existing tasks from VS Code local storage memory on startup
document.addEventListener('DOMContentLoaded', getTodos);
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', handleTaskAction);

// 1. Add Task
function addTask(e) {
    e.preventDefault();

    const taskText = todoInput.value.trim();
    if (taskText === '') return;

    createTodoElement(taskText, false);
    
    // Save to local storage array
    saveLocalTodos(taskText);

    todoInput.value = '';
    updateStats();
}

// Helper to render an item in the HTML list
function createTodoElement(text, isCompleted) {
    const todoLi = document.createElement('li');
    todoLi.classList.add('todo-item');
    if (isCompleted) {
        todoLi.classList.add('completed');
    }

    todoLi.innerHTML = `
        <div class="task-content">
            <button class="check-btn"><i class="fas fa-check"></i></button>
            <span class="task-text">${escapeHTML(text)}</span>
        </div>
        <button class="delete-btn"><i class="far fa-trash-alt"></i></button>
    `;

    todoList.appendChild(todoLi);
}

// 2. Handle Check and Delete buttons
function handleTaskAction(e) {
    const item = e.target;
    const todoItem = item.closest('.todo-item');
    if (!todoItem) return;

    const taskText = todoItem.querySelector('.task-text').innerText;

    // Toggle Checkmark
    if (item.classList.contains('check-btn') || item.parentElement.classList.contains('check-btn')) {
        todoItem.classList.toggle('completed');
        toggleLocalTodoStatus(taskText);
        updateStats();
    }

    // Handle Delete with smooth CSS transition
    if (item.classList.contains('delete-btn') || item.parentElement.classList.contains('delete-btn')) {
        todoItem.classList.add('fall');
        removeLocalTodos(taskText);
        
        todoItem.addEventListener('transitionend', function() {
            todoItem.remove();
            updateStats();
        });
    }
}

// 3. Counter Calculations
function updateStats() {
    const totalTasks = todoList.querySelectorAll('.todo-item').length;
    const completedTasks = todoList.querySelectorAll('.todo-item.completed').length;

    totalCount.textContent = totalTasks;
    completedCount.textContent = completedTasks;
}

// 4. Local Storage Functions
function saveLocalTodos(todoText) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push({ text: todoText, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.forEach(todo => {
        createTodoElement(todo.text, todo.completed);
    });
    updateStats();
}

function removeLocalTodos(todoText) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleLocalTodoStatus(todoText) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.forEach(todo => {
        if (todo.text === todoText) {
            todo.completed = !todo.completed;
        }
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}