"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const jsonDb_1 = require("../utils/jsonDb");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post('/', async (req, res) => {
    try {
        const { type, answers, score, riskLevel } = req.body;
        const assessments = (0, jsonDb_1.readData)('assessments');
        const newAssessment = {
            id: (0, jsonDb_1.generateId)(),
            userId: req.user.id,
            type,
            answers,
            score,
            riskLevel,
            createdAt: new Date().toISOString()
        };
        assessments.push(newAssessment);
        (0, jsonDb_1.writeData)('assessments', assessments);
        res.status(201).json(newAssessment);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to save assessment' });
    }
});
router.get('/', async (req, res) => {
    try {
        const assessments = (0, jsonDb_1.readData)('assessments');
        const userAssessments = assessments
            .filter(a => a.userId === req.user.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json(userAssessments);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const assessments = (0, jsonDb_1.readData)('assessments');
        const index = assessments.findIndex(a => a.id === req.params.id && a.userId === req.user.id);
        if (index === -1)
            return res.status(404).json({ error: 'Not found' });
        assessments.splice(index, 1);
        (0, jsonDb_1.writeData)('assessments', assessments);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});
exports.default = router;
