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

// Helper function to find a subtask by ID (recursively)
const findSubtaskById = (subtasks: any[], targetId: string): any => {
  for (const subtask of subtasks) {
    // Convert both IDs to strings for comparison
    if (subtask._id && subtask._id.toString() === targetId.toString()) {
      return subtask;
    }
    // Check nested subtasks
    if (subtask.subTasks && subtask.subTasks.length > 0) {
      const found = findSubtaskById(subtask.subTasks, targetId);
      if (found) return found;
    }
  }
  return null;
};

// Create a subtask (either for main task or for another subtask)
export const createSubtask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId, parentSubtaskId } = req.params;
    const { title, description, dueDate } = req.body;
    
    // Validate taskId
    if (!taskId) {
      return next({ statusCode: 400, message: 'Task ID is required' });
    }

    const task = await Task.findOne({ 
      _id: taskId, 
      createdBy: req.auth?.uid ?? null 
    });

    if (!task) {
      return next({ statusCode: 404, message: 'Task not found' });
    }

    const newSubtask = {
      title,
      description,
      dueDate,
      completed: false,
      subTasks: []
    };

    // If parentSubtaskId is provided, we're creating a nested subtask
    if (parentSubtaskId) {
      // Debug logging
      console.log('Looking for parent subtask:', parentSubtaskId);
      console.log('Available subtasks:', JSON.stringify(task.subTasks, null, 2));
      
      const parentSubtask = findSubtaskById(task.subTasks, parentSubtaskId);
      
      if (!parentSubtask) {
        return next({ statusCode: 404, message: 'Parent subtask not found' });
      }

      // Initialize subTasks array if it doesn't exist
      if (!parentSubtask.subTasks) {
        parentSubtask.subTasks = [];
      }
      
      // Add the new subtask
      parentSubtask.subTasks.push(newSubtask);
      
      // Mark the document as modified
      task.markModified('subTasks');
    } else {
      // Otherwise, add it to the main task's subtasks
      task.subTasks.push(newSubtask);
    }

    await task.save();

    res.status(201).json({ 
      message: 'Subtask created successfully', 
      data: task 
    });
  } catch (error) {
    console.error('Error creating subtask:', error);
    next(error);
  }
};

// Update a subtask
export const updateSubtask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId, subtaskId } = req.params;
    const updates = req.body;

    const task = await Task.findOne({ 
      _id: taskId, 
      createdBy: req.auth?.uid ?? null 
    });

    if (!task) {
      return next({ statusCode: 404, message: 'Task not found' });
    }

    const subtask = findSubtaskById(task.subTasks, subtaskId);
    if (!subtask) {
      return next({ statusCode: 404, message: 'Subtask not found' });
    }

    Object.assign(subtask, updates);
    await task.save();

    res.status(200).json({ 
      message: 'Subtask updated successfully', 
      data: task 
    });
  } catch (error) {
    next(error);
  }
};

// Delete a subtask
export const deleteSubtask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId, subtaskId } = req.params;

    const task = await Task.findOne({ 
      _id: taskId, 
      createdBy: req.auth?.uid ?? null 
    });

    if (!task) {
      return next({ statusCode: 404, message: 'Task not found' });
    }

    // Helper function to remove subtask (recursively)
    const removeSubtask = (subtasks: any[]): boolean => {
      for (let i = 0; i < subtasks.length; i++) {
        if (subtasks[i]._id.toString() === subtaskId) {
          subtasks.splice(i, 1);
          return true;
        }
        if (subtasks[i].subTasks && subtasks[i].subTasks.length > 0) {
          if (removeSubtask(subtasks[i].subTasks)) {
            return true;
          }
        }
      }
      return false;
    };

    if (!removeSubtask(task.subTasks)) {
      return next({ statusCode: 404, message: 'Subtask not found' });
    }

    await task.save();

    res.status(200).json({ 
      message: 'Subtask deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};
