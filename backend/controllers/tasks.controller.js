import User from '../models/user.model.js';

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('tasks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ tasks: user.tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error });
    }
};

// Add a new task to the user's task list
export const addTask = async (req, res) => {
    try {
        const { taskName, taskDescription, status } = req.body;
        const user = await User.findById(req.user.id);

        const newTask = {
            taskName,
            taskDescription,
            status
        };

        user.tasks.push(newTask);
        await user.save();

        res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
        console.log(error)
    }
};

// Update an existing task by taskId
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { taskName, taskDescription, status } = req.body;

        const user = await User.findById(req.user.id);
        const task = user.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.taskName = taskName || task.taskName;
        task.taskDescription = taskDescription || task.taskDescription;
        task.status = status || task.status;

        await user.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// Delete a task by taskId
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const user = await User.findById(req.user.id);
        user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);

        await user.save();

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};

// Change the status of a task by taskId
export const changeTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const validStatuses = ['TODO', 'INPROGRESS', 'DONE'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const user = await User.findById(req.user.id);
        const task = user.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        await user.save();

        res.status(200).json({ message: 'Task status updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error changing task status', error });
    }
};

export const searchTasks = async (req, res) => {
    const { query } = req.body; // Get the search query from the request body
  
    try {
      // Search for tasks by name or description
      const tasks = await Task.find({
        $or: [
          { taskName: { $regex: query, $options: 'i' } },
          { taskDescription: { $regex: query, $options: 'i' } },
        ],
      });
  
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Error searching tasks:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };