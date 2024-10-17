import React, { useState, useEffect } from 'react';
import TaskList from './Tasklist';
import SearchFilter from './Searchfilter';
import Modal from './Modal';
import axios from 'axios';

const TaskBoard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          withCredentials: true,
        });
        console.log(response.data);
        setTasks(response.data.tasks);
        filterTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Search tasks when the search query changes
  useEffect(() => {
    const searchTasks = async () => {
      if (searchQuery.trim() === "") {
        filterTasks(tasks);
        return;
      }

      try {
        const response = await axios.post('/api/tasks/search', { query: searchQuery }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setTasks(response.data.tasks);
        filterTasks(response.data.tasks);
      } catch (error) {
        console.error('Error searching tasks:', error);
      }
    };

    searchTasks();
  }, [searchQuery, tasks]);

  const filterTasks = (tasksArray) => {
    const todo = tasksArray.filter(task => task.status === 'TODO');
    const inProgress = tasksArray.filter(task => task.status === 'INPROGRESS');
    const done = tasksArray.filter(task => task.status === 'DONE');

    setFilteredTasks({ todo, inProgress, done });
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      console.log(taskId);
      const response = await axios.patch(`/api/tasks/status/${taskId}`, { status: newStatus }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedTask = response.data.task;
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        filterTasks(updatedTasks);
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDropTask = (droppedTask, newStatus) => {
    const statusMapping = {
      "TODO": "TODO",
      "INPROGRESS": "INPROGRESS",
      "DONE": "DONE",
    };

    const mappedStatus = statusMapping[newStatus];
    console.log(droppedTask._id);
    if (droppedTask.status !== mappedStatus) {
      updateTaskStatus(droppedTask._id, mappedStatus);
    }
  };

  const handleAddTask = async () => {
    const newTask = {
      taskName,
      taskDescription,
      status: 'TODO', // Default status
    };

    try {
      const response = await axios.post('/api/tasks/add', newTask, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTasks((prevTasks) => [...prevTasks, response.data.task]);
      filterTasks([...tasks, response.data.task]);
      setModalVisible(false);
      setTaskName("");
      setTaskDescription("");
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleEditTask = async (task) => {
    const updatedTask = {
      ...task,
      taskName,
      taskDescription,
    };

    try {
      const response = await axios.put(`/api/tasks/update/${task._id}`, updatedTask, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedTaskResponse = response.data.task;
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map(t =>
          t._id === updatedTaskResponse._id ? updatedTaskResponse : t
        );
        filterTasks(updatedTasks);
        return updatedTasks;
      });
      setModalVisible(false);
      setTaskName(""); 
      setTaskDescription(""); 
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/delete/${taskId}`, {
        withCredentials: true,
      });
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task._id !== taskId);
        filterTasks(updatedTasks);
        return updatedTasks;
      });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleViewDetails = (task) => {
    console.log(task)
    setSelectedTask(task);
    setTaskName(task.taskName); 
    setTaskDescription(task.taskDescription); 
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
    // Only clear inputs when not editing
    if (!selectedTask) {
      setTaskName(""); 
      setTaskDescription(""); 
    }
  };

  return (
    <div className="flex flex-col items-center p-4 h-full">
      <button
        onClick={() => {
          setModalVisible(true);
          setTaskName(""); 
          setTaskDescription(""); 
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Task
      </button>
      <div className="flex flex-wrap justify-center gap-4 h-full">
        <TaskList title="TODO" tasks={filteredTasks.todo} onDropTask={handleDropTask} onViewDetails={handleViewDetails} onDelete={handleDeleteTask} />
        <TaskList title="INPROGRESS" tasks={filteredTasks.inProgress} onDropTask={handleDropTask} onViewDetails={handleViewDetails} onDelete={handleDeleteTask} />
        <TaskList title="DONE" tasks={filteredTasks.done} onDropTask={handleDropTask} onViewDetails={handleViewDetails} onDelete={handleDeleteTask} />
      </div>

      {modalVisible && (
        <Modal
        isVisible={modalVisible}
        onClose={handleCloseModal}
        task={selectedTask} // Pass the selected task for editing
        taskName={taskName}
        setTaskName={setTaskName}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        onSubmit={selectedTask ? handleEditTask : handleAddTask}
        />
      )}
    </div>
  );
};

export default TaskBoard;
