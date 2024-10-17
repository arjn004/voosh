import React from 'react';
import { useDrag } from 'react-dnd';

const TaskItem = ({ task, onViewDetails, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { ...task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-blue-100 p-4 mb-4 rounded-lg shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <h4 className="font-bold">{task.taskName}</h4>
      <p>{task.taskDescription}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onDelete(task._id, task.status)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => onViewDetails(task)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
