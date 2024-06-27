import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const newSocket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.on('addTask', (task) => {
      addTask(task);
    });

    newSocket.on('removeTask', (id) => {
      removeTask(id);
    });

    newSocket.on('updateData', (initialTasks) => {
      updateTasks(initialTasks);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskDescription = taskName.trim();

    if (taskDescription) {
      const newTask = { id: Date.now(), description: taskDescription };
      addTask(newTask);

      if (socket) {
        socket.emit('addTask', newTask);
      }

      setTaskName('');
    }
  };

  const removeTask = (id) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));

    if (socket) {
      socket.emit('removeTask', id);
    }
  };

  const updateTasks = (initialTasks) => {
    setTasks(initialTasks);
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleAddTask(e);
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => (
            <li key={task.id} className="task">
              {task.description}
              <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}

export default App;
