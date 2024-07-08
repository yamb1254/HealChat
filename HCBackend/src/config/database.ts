import { Sequelize } from "sequelize";
import { config } from "./envConfig";

const sequelize = new Sequelize(config.databaseUrl!, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

export default sequelize;
