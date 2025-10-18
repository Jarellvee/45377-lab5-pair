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
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                port: process.env.DB_PORT
            });
            console.log("connected to MySQL server");
        }

        await this.connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`); // check for db, create if not exists
        await this.connection.query(`USE ${process.env.DB_NAME}`); // use that db after making sure it exists

        await this.connection.query(`
        CREATE TABLE IF NOT EXISTS patient (
            patientid INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            dateOfBirth DATE NOT NULL
        ) ENGINE=InnoDB;
    `); // check for patient table, create if not exists
        console.log("Database and patient table ready");
    }


    /**
     *  Executes a passed sql query with params
     * @param {*} sql - The SQL query string.
     * @param {*} params - The parameters for the query.
     * @returns The result of the query.
     */
    async query(sql, params = []) {
        try {
            const [rows] = await this.connection.execute(sql, params); // paramterized query, so safe from injection
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
}

/**
 * DbRunner class to run the database setup
 * Instantiates the Database class and calls the setup method to fully initialize the database
 */
class DbRunner {
    constructor() {
        this.db = new Database();
    }

    async run() {
        await this.db.setup();
    }
}

let newDbRunner = new DbRunner();
newDbRunner.run().then(() => {
    console.log("Database setup complete.");
}).catch((error) => {
    console.error("Database setup failed:", error);
});

export { Database, DbRunner };

