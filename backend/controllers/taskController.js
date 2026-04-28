const { Task } = require('../models');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    // req.user.id comes from the verifyToken middleware
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error while fetching tasks.' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    if (title.trim().length > 500) {
      return res.status(400).json({ error: 'Task title must be 500 characters or less.' });
    }

    const newTask = await Task.create({
      title: title.trim(),
      status: 'pending',
      userId: req.user.id, // Associate task with the logged-in user
    });

    res.status(201).json({
      message: 'Task created successfully.',
      task: newTask,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error while creating task.' });
  }
};

// @desc    Update a task (toggle status or update title)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    // Find the task and ensure it belongs to the logged-in user
    const task = await Task.findOne({
      where: { id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to update it.' });
    }

    // Validate status if provided
    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "pending" or "completed".' });
    }

    // Validate title if provided
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Task title cannot be empty.' });
    }

    // Update the task fields
    if (title !== undefined) task.title = title.trim();
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error while updating task.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task and ensure it belongs to the logged-in user
    const task = await Task.findOne({
      where: { id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error while deleting task.' });
  }
};

module.exports = { getMyTasks, createTask, updateTask, deleteTask };