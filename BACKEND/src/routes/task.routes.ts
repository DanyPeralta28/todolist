import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticateUser } from '../utils/auth';

const router = express.Router();

router.get('/tasks', authenticateUser, getAllTasks);
router.post('/tasks', authenticateUser, createTask);
router.put('/tasks/:id', authenticateUser, updateTask);
router.delete('/tasks/:id', authenticateUser, deleteTask);

export default router;

