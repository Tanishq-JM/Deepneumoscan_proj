"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const assessments_1 = __importDefault(require("./routes/assessments"));
const xray_1 = __importDefault(require("./routes/xray"));
const history_1 = __importDefault(require("./routes/history"));
const hospitals_1 = __importDefault(require("./routes/hospitals"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
(0, db_1.default)();
app.use('/api/auth', auth_1.default);
app.use('/api/assessments', assessments_1.default);
app.use('/api/xray', xray_1.default);
app.use('/api/history', history_1.default);
app.use('/api/hospitals', hospitals_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'DeepNeumoScan Backend Running 🩺' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
