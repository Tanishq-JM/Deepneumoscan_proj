"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.writeData = exports.readData = exports.ensureDataDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(__dirname, '../data');
const ensureDataDir = () => {
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    const files = ['users.json', 'assessments.json', 'xray_results.json'];
    files.forEach(file => {
        const filePath = path_1.default.join(DATA_DIR, file);
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([], null, 2));
        }
    });
};
exports.ensureDataDir = ensureDataDir;
const readData = (file) => {
    const filePath = path_1.default.join(DATA_DIR, `${file}.json`);
    if (!fs_1.default.existsSync(filePath))
        return [];
    const data = fs_1.default.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    }
    catch (e) {
        return [];
    }
};
exports.readData = readData;
const writeData = (file, data) => {
    const filePath = path_1.default.join(DATA_DIR, `${file}.json`);
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
exports.writeData = writeData;
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateId = generateId;
