import 'dotenv/config.js';
import mysql from 'mysql2/promise';
console.log("🟢 db.js starting…");

class Database {

    constructor() {
        this.connection = null;
    }

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

        await this.connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await this.connection.query(`USE ${process.env.DB_NAME}`);

        await this.connection.query(`
        CREATE TABLE IF NOT EXISTS patient (
            patientid INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            dateOfBirth DATE NOT NULL
        ) ENGINE=InnoDB;
    `);
        console.log("Database and patient table ready");
    }



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

