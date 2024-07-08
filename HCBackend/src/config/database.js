"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const envConfig_1 = require("./envConfig");
const sequelize = new sequelize_1.Sequelize(envConfig_1.config.databaseUrl, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
});
exports.default = sequelize;
