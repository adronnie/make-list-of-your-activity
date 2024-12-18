document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskName = document.getElementById('task-name');
    const taskDue = document.getElementById('task-due');
    const taskPriority = document.getElementById('task-priority');
    const taskSearch = document.getElementById('task-search');
    const taskList = document.getElementById('task-list');
    const totalTasksElem = document.getElementById('total-tasks');
    const completedTasksElem = document.getElementById('completed-tasks');
    const overdueTasksElem = document.getElementById('overdue-tasks');
    const celebrationElem = document.createElement('div');
    celebrationElem.classList.add('celebration');
    celebrationElem.textContent = 'All tasks completed! 🎉';
    document.body.appendChild(celebrationElem);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Load tasks from localStorage
    function loadTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(task.priority + '-priority');
            if (task.completed) li.classList.add('completed');
            if (new Date(task.dueDate) < new Date() && !task.completed) {
                li.classList.add('overdue');
            }
            li.innerHTML = `
                <span>${task.name} (Due: ${task.dueDate})</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="complete">Complete</button>
            `;
            taskList.appendChild(li);

            const deleteBtn = li.querySelector('.delete');
            const completeBtn = li.querySelector('.complete');
            const editBtn = li.querySelector('.edit');

            // Complete task functionality
            completeBtn.addEventListener('click', () => {
                task.completed = true;
                saveTasks();
                loadTasks();
            });

            // Edit task functionality
            editBtn.addEventListener('click', () => {
                taskName.value = task.name;
                taskDue.value = task.dueDate;
                taskPriority.value = task.priority;
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                loadTasks();
            });

            // Delete task functionality
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                loadTasks();
            });
        });

        totalTasksElem.textContent = tasks.length;
        completedTasksElem.textContent = tasks.filter(task => task.completed).length;
        overdueTasksElem.textContent = tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length;

        if (tasks.every(task => task.completed)) {
            celebrationElem.style.display = 'block';
        } else {
            celebrationElem.style.display = 'none';
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
            name: taskName.value,
            dueDate: taskDue.value,
            priority: taskPriority.value,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        loadTasks();
        taskForm.reset();
    });

    // Search/filter tasks
    taskSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(query));
        taskList.innerHTML = '';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(task.priority + '-priority');
            if (task.completed) li.classList.add('completed');
            li.innerHTML = `
                <span>${task.name} (Due: ${task.dueDate})</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="complete">Complete</button>
            `;
            taskList.appendChild(li);
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.querySelector('.container').classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });

    loadTasks();
});
