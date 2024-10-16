const { Config } = require("../configs/config");
const { Sequelize } = require('sequelize');

class DatabaseLoader {
    static sequelize = null;

    static async init() {
            try {
                DatabaseLoader.sequelize = new Sequelize(Config.DB_DATABASE, Config.DB_USER, Config.DB_PASS, {
                    host: Config.DB_HOST,
                    dialect: 'mysql',
                    logging: false // Disable logging if not needed
                });
                await DatabaseLoader.sequelize.authenticate();
                console.log('DB Connection has been established successfully.');
            } catch (error) {
                console.error('Unable to connect to the database:', error);
            } finally {
                DatabaseLoader.initializing = false; // Reset initializing flag
            }
        }

    static getSequelize() {
        return DatabaseLoader.sequelize;
    }
}


module.exports = DatabaseLoader;
