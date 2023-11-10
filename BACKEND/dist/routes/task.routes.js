"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
router.get('/tasks', auth_1.authenticateUser, task_controller_1.getAllTasks);
router.post('/tasks', auth_1.authenticateUser, task_controller_1.createTask);
router.put('/tasks/:id', auth_1.authenticateUser, task_controller_1.updateTask);
router.delete('/tasks/:id', auth_1.authenticateUser, task_controller_1.deleteTask);
exports.default = router;
