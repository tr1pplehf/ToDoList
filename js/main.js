// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const emptyListTitle = document.querySelector('#emptyListTitle');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault();

    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTask)

    // Добавляем в хранилище
    saveToLocalStorage();

    renderTask(newTask);

    // Очищаем поле ввода после добавления задачи и возращаем на него фокус
    taskInput.value = '';
    taskInput.focus();

    if (tasksList.children.length > 1) {
        emptyListTitle.textContent = 'Ваш список дел'
    } else {
        emptyListTitle.textContent = 'Список дел пуст'
    }
}

function deleteTask(event) {
    // Проверяем что клик был по кнопке удалить задачу
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('li');

        // Определяем id задачи
        const id = parentNode.id

        // Находим индекс задачи в массиве
        const index = tasks.findIndex((task) => task.id === id);

        // Удаляем задачу из массива
        tasks.splice(index, 1)
        parentNode.remove();

        // Добавляем в хранилище
        saveToLocalStorage();

        if (tasksList.children.length > 1) {
            emptyListTitle.textContent = 'Ваш список дел'
        } else {
            emptyListTitle.textContent = 'Список дел пуст'
        }
    }
}

function doneTask(event) {
    // Проверяем что клик был по кнопке завершения задачи
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('li')

        // Определяем id задачи
        const id = Number(parentNode.id);
        const task = tasks.find((task) => task.id === id)
        task.done = !task.done

        // Добавляем в хранилище
        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('span');
        taskTitle.classList.toggle('task-title--done');
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHtml = `<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
					<span class='${cssClass}'>${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHtml);
}