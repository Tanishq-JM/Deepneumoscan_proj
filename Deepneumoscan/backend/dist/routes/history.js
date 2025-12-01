"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const jsonDb_1 = require("../utils/jsonDb");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', async (req, res) => {
    try {
        const assessments = (0, jsonDb_1.readData)('assessments')
            .filter(a => a.userId === req.user.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const xrayResults = (0, jsonDb_1.readData)('xray_results')
            .filter(r => r.userId === req.user.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json({
            assessments,
            xrayResults,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});
exports.default = router;
