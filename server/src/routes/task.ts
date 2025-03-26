import express from 'express';
import checkBearerToken from '../middlewares/check-bearer-token';
import errorHandler from '../middlewares/error-handler';
import { createTask, getTasks, updateTask, deleteTask, createSubtask, getByIdTask } from '../controllers/task/TaskController';

// Initialize router
const router = express.Router();

// POST at route: http://localhost:8080/tasks (Create a new task)
router.post('/', [checkBearerToken], createTask, errorHandler);

// GET at path: http://localhost:8080/tasks (Get all tasks)
router.get('/', [checkBearerToken], getTasks, errorHandler);

router.get('/:id', [checkBearerToken], getByIdTask, errorHandler);
// PUT at path: http://localhost:8080/tasks/:id (Update a task)
router.put('/:id', [checkBearerToken], updateTask, errorHandler);

// DELETE at path: http://localhost:8080/tasks/:id (Delete a task)
router.delete('/:id', [checkBearerToken], deleteTask, errorHandler);

// POST at path: http://localhost:8080/tasks/:id/subtask (Create a subtask)
router.post('/:id/subtask', [checkBearerToken], createSubtask, errorHandler);

export default router;
