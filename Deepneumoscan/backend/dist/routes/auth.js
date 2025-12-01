"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonDb_1 = require("../utils/jsonDb");
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, username } = req.body;
        const finalName = (name || username || '').trim();
        if (!email || !password || !finalName) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        const users = (0, jsonDb_1.readData)('users');
        const existing = users.find(u => u.email === email);
        if (existing)
            return res.status(400).json({ error: 'User exists' });
        const newUser = {
            id: (0, jsonDb_1.generateId)(),
            email: email.trim().toLowerCase(),
            password, // NOTE: In production hash this password.
            name: finalName
        };
        users.push(newUser);
        (0, jsonDb_1.writeData)('users', users);
        const signOptions = {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        };
        const token = jsonwebtoken_1.default.sign({ id: newUser.id }, process.env.JWT_SECRET || 'default_secret', signOptions);
        res.status(201).json({
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = (0, jsonDb_1.readData)('users');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        const signOptions = {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        };
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', signOptions);
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
