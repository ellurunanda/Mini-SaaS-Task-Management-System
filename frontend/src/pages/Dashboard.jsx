import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  // Load tasks on mount
  const loadTasks = useCallback(async () => {
    try {
      setError('');
      const data = await fetchTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    setError('');

    try {
      const data = await createTask(newTaskTitle.trim());
      setTasks((prev) => [data.task, ...prev]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message || 'Failed to add task.');
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle task status
  const handleToggleStatus = async (id, newStatus) => {
    setError('');
    try {
      const data = await updateTask(id, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? data.task : task))
      );
    } catch (err) {
      setError(err.message || 'Failed to update task.');
    }
  };

  // Edit task title
  const handleEditTask = async (id, newTitle) => {
    setError('');
    try {
      const data = await updateTask(id, { title: newTitle });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? data.task : task))
      );
    } catch (err) {
      setError(err.message || 'Failed to edit task.');
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    setError('');
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete task.');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Good {getGreeting()},{' '}
            <span className="text-blue-600">{user?.name || user?.email?.split('@')[0]}</span>!
          </h1>
          <p className="text-gray-500 mt-1">Here's what you need to get done today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
            <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-sm text-yellow-600 mt-1">Pending</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 shadow-sm text-center">
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            <p className="text-sm text-green-600 mt-1">Completed</p>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="input-field flex-1"
              placeholder="What do you need to do?"
              maxLength={500}
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !newTaskTitle.trim()}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message mb-4 flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Task List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">My Tasks</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                    filter === f
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="animate-spin w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm">Loading your tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-base font-medium text-gray-500">
                {filter === 'all'
                  ? 'No tasks yet. Add your first task above!'
                  : `No ${filter} tasks found.`}
              </p>
            </div>
          ) : (
            /* Task Items */
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Progress</span>
                <span>{Math.round((completedCount / tasks.length) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper to get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;