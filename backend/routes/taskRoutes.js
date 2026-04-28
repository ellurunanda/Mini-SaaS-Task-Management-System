const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { getMyTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// All task routes are protected by the verifyToken middleware
router.use(verifyToken);

// GET /api/tasks - Get all tasks for the logged-in user
router.get('/', getMyTasks);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update a task (toggle status or edit title)
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;