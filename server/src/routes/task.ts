import express from 'express';
import checkBearerToken from '../middlewares/check-bearer-token';
import errorHandler from '../middlewares/error-handler';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    getByIdTask
} from '../controllers/task/TaskController';

const router = express.Router();

// Task routes
router.post('/', [checkBearerToken], createTask, errorHandler);
router.get('/', [checkBearerToken], getTasks, errorHandler);
router.get('/:id', [checkBearerToken], getByIdTask, errorHandler);
router.put('/:id', [checkBearerToken], updateTask, errorHandler);
router.delete('/:id', [checkBearerToken], deleteTask, errorHandler);

// Subtask routes
// Create subtask (for main task)
router.post('/:taskId/subtasks', [checkBearerToken], createSubtask, errorHandler);
// Create nested subtask (fixed path)
router.post('/:taskId/subtasks/:parentSubtaskId', [checkBearerToken], createSubtask, errorHandler);
// Update any subtask
router.put('/:taskId/subtasks/:subtaskId', [checkBearerToken], updateSubtask, errorHandler);
// Delete any subtask
router.delete('/:taskId/subtasks/:subtaskId', [checkBearerToken], deleteSubtask, errorHandler);

export default router;