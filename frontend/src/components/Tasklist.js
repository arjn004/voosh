import React from 'react';
import { useDrop } from 'react-dnd';
import TaskItem from './Taskitem';

const TaskList = ({ title, tasks, onDropTask, onViewDetails, onDelete }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (droppedTask) => onDropTask(droppedTask, title),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex flex-col bg-white rounded-lg p-4 shadow-md h-full w-80 ${isOver ? 'bg-gray-200' : ''}`}
    >
      <h2 className="font-bold text-lg mb-4 bg-blue-500 text-white text-center py-2 rounded">{title}</h2>
      {tasks.length === 0 ? (
        <div className="flex-grow flex justify-center items-center">
          <p className="text-gray-500">No tasks in this column</p>
        </div>
      ) : (
        tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
