"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const getAllTasks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_model_1.default.find();
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllTasks = getAllTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const newTask = new task_model_1.default({ title });
        const savedTask = yield newTask.save();
        res.status(201).json(savedTask);
    }
    catch (error) {
        console.error("Error al crear tarea:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const updatedTask = yield task_model_1.default.findByIdAndUpdate(id, { title, completed }, { new: true });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield task_model_1.default.findByIdAndDelete(id);
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteTask = deleteTask;
