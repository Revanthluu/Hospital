
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function createTable() {
    try {
        console.log("Creating 'alerts' table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alerts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id VARCHAR(50) NOT NULL,
                assessment_id VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
            )
        `);
        console.log("Table 'alerts' created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to create 'alerts' table:", error);
        process.exit(1);
    }
}

createTable();
