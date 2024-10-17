import React, { useEffect } from 'react';

const Modal = ({ isVisible, onClose, onSubmit, task, taskName, setTaskName, taskDescription, setTaskDescription }) => {
  // useEffect to set task details when the modal opens
  useEffect(() => {
    if (task) {
      setTaskName(task.taskName);
      setTaskDescription(task.taskDescription);
    } else {
      setTaskName('');
      setTaskDescription('');
    }
  }, [task, setTaskName, setTaskDescription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task); // Pass the task for edit or use state for new task
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Task Name</label>
            <input
              type="text"
              value={taskName} // Use taskName from state
              onChange={(e) => setTaskName(e.target.value)} // Update taskName state
              className="w-full border px-3 py-2 rounded focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Task Description</label>
            <textarea
              value={taskDescription} // Use taskDescription from state
              onChange={(e) => setTaskDescription(e.target.value)} // Update taskDescription state
              className="w-full border px-3 py-2 rounded focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {task ? 'Update' : 'Add'} Task
            </button>
            <button
              type="button" // Change to type="button" to prevent form submission
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
