"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonDb_1 = require("../utils/jsonDb");
const connectDB = async () => {
    try {
        (0, jsonDb_1.ensureDataDir)();
        console.log("✅ Local JSON Database initialized");
    }
    catch (err) {
        console.error("Database initialization error:", err);
    }
};
exports.default = connectDB;
