import { Sequelize } from "sequelize-typescript";
import { dbConnectionString } from "./dotenv.config";
import path from "path";

export const sequelize = new Sequelize(dbConnectionString, {
	dialect: "mysql",
	logging: false, // Set to true if you want to see SQL queries
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	models: [path.resolve(__dirname, "../model")],
});

export const initializeDatabase = async () => {
	try {
		await sequelize.authenticate();
		// Sync models after database creation
		await sequelize.sync({ alter: true });
		console.log("Database synced successfully!".green);
	} catch (err: any) {
		console.error("Error initializing database: ".red, err.message);
	}
};
