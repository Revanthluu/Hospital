
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function migrate() {
    try {
        console.log("Adding 'status' column to 'patients' table...");
        const [columns] = await pool.query("SHOW COLUMNS FROM patients LIKE 'status'");
        if (columns.length === 0) {
            await pool.query("ALTER TABLE patients ADD COLUMN status ENUM('Active', 'Recovered') DEFAULT 'Active'");
            console.log("Column 'status' added successfully.");
        } else {
            console.log("Column 'status' already exists.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
