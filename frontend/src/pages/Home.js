import React from 'react';
import Navbar from '../components/Navbar';
import SearchFilter from '../components/Searchfilter';
import TaskBoard from '../components/Taskboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Home = () => {
  return (
    <DndProvider backend={HTML5Backend}>
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <SearchFilter />
        <TaskBoard />
      </div>
    </div>
    </DndProvider>
  );
};

export default Home;
