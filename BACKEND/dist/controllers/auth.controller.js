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
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        console.log('Entrando en la función registerUser'); // Agrega esto
        const existingUser = yield user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ username, password: hashedPassword });
        yield newUser.save();
        console.log('Usuario registrado con éxito'); // Agrega esto
        res.status(201).json({ message: "Usuario registrado con éxito" });
    }
    catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toHexString(), username: user.username }, "funtec", { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
exports.loginUser = loginUser;
