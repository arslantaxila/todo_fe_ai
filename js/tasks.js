document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    const addTaskForm = document.getElementById('add-task-form');
    const tasksContainer = document.getElementById('tasks-container');

    const fetchTasks = async () => {
        const response = await fetch('http://localhost:3000/api/tasks/view', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const tasks = await response.json();
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.status === 'Completed' ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>Due: ${task.due_date || 'No due date'}</p>
                <p>Priority: ${task.priority}</p>
                <button onclick="completeTask(${task.id})">Complete</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
            tasksContainer.appendChild(taskElement);
        });
    };

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const dueDate = document.getElementById('due-date').value;
            const priority = document.getElementById('priority').value;

            const response = await fetch('http://localhost:3000/api/tasks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, dueDate, priority })
            });

            if (response.ok) {
                fetchTasks();
                addTaskForm.reset();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        });
    }

    window.completeTask = async (taskId) => {
        const response = await fetch('http://localhost:3000/api/tasks/completed', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: taskId })
        });

        if (response.ok) {
            fetchTasks();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    };

    window.deleteTask = async (taskId) => {
        const response = await fetch('http://localhost:3000/api/tasks/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: taskId })
        });

        if (response.ok) {
            fetchTasks();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    };

    fetchTasks();
});