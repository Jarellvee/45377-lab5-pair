import 'dotenv/config.js';
import mysql from 'mysql2/promise';

/**
 * Database class that handles connection and mysql queries
 */
class Database {

    /**
     * Initializes the Database instance.
     * */
    constructor() {
        this.connection = null;
    }

    /**
     * Sets up the database and patient table if they do not exist.
     * Checks if theres a connection, if not make one
     * Checks if db exists, if not create it, same for patient table
     * */
    async setup() {
        if (!this.connection) {
            console.log("Connecting to MySQL using:", {
                host: process.env.MYSQLHOST,
                user: process.env.MYSQLUSER,
                port: process.env.MYSQLPORT
            });

            this.connection = await mysql.createConnection({
                host: process.env.MYSQLHOST || process.env.DB_HOST,
                user: process.env.MYSQLUSER || process.env.DB_USER,
                password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
                port: process.env.MYSQLPORT || process.env.DB_PORT
            });

            console.log("Connected to MySQL server");

            const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME;
            await this.connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
            await this.connection.query(`USE \`${dbName}\`;`);

            await this.connection.query(`
      CREATE TABLE IF NOT EXISTS patient (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE NOT NULL
      ) ENGINE=InnoDB;
    `);

            console.log("Database and patient table ready");
        }
    }



    /**
     *  Executes a passed sql query with params
     * Pings the db to keep connection alive, reconnects if needed
     * @param {*} sql - The SQL query string.
     * @param {*} params - The parameters for the query.
     * @returns The result of the query.
     */
    async query(sql, params = []) {
        try {
            if (!this.connection) {
                await this.setup();
            } else {
                try {
                    await this.connection.ping();
                } catch {
                    console.log("MySQL connection sleeping. Reconnecting...");
                    this.connection = null;
                    await this.setup();
                }
            }
            const [rows] = await this.connection.execute(sql, params);
            return rows;
        } catch (error) {
            console.error("Database query error:", error);
            throw error;
        }
    }
}

export { Database };