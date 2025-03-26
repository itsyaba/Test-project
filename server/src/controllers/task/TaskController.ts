import { type RequestHandler } from 'express';
import Task from '../../models/Task';

// Create a new task
export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const { collectionId, title, description, dueDate } = req.body;

    const task = new Task({
      collectionId,
      title,
      description,
      dueDate,
      createdBy: req.auth?.uid ?? null,
    });
    await task.save();
    res.status(201).json({ message: 'Task created successfully', data: task });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get all tasks for a user
export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.auth?.uid ?? null });
    res.status(200).json({ message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    next(error);
  }
};

// Get all tasks for a user
export const getByIdTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tasks = await Task.find({ createdBy: req.auth?.uid ?? null  , _id :id});
    res.status(200).json({ message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.auth?.uid ?? null },
      req.body,
      { new: true }
    );
    if (!updatedTask) {
      return next({ statusCode: 404, message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, createdBy: req.auth?.uid ?? null });
    if (!deletedTask) {
      return next({ statusCode: 404, message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Create a subtask
export const createSubtask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const task = await Task.findOne({ _id: id, createdBy: req.auth?.uid ?? null });

    if (!task) {
      return next({ statusCode: 404, message: 'Parent task not found' });
    }

    const subtask = {
      title,
      description,
      dueDate,
      completed: false,
    };

    task.subTasks.push(subtask);
    await task.save();

    res.status(201).json({ message: 'Subtask created successfully', data: task });
  } catch (error) {
    next(error);
  }
};
