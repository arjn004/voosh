import express from 'express';
import {
    addTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    getTasks,
    searchTasks
} from '../controllers/tasks.controller.js';
import  protectRoute  from '../middleware/protectRoute.js';

const router = express.Router();

// Route to get all tasks for the authenticated user
router.get('/', protectRoute, getTasks);

// Route to add a task
router.post('/add', protectRoute, addTask);

// Route to update a task
router.put('/update/:taskId', protectRoute, updateTask);

// Route to delete a task
router.delete('/delete/:taskId', protectRoute, deleteTask);

// Route to change task status
router.patch('/status/:taskId', protectRoute, changeTaskStatus);

router.post('/search', protectRoute, searchTasks); // POST request for searching tasks

export default router;
