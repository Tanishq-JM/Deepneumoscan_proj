"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonDb_1 = require("../utils/jsonDb");
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const users = (0, jsonDb_1.readData)('users');
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
            res.status(403).json({ error: 'User not found' });
            return;
        }
        req.user = { id: user.id, email: user.email };
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
