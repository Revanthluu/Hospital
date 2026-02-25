
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
        console.log("Checking columns in 'assessments' table...");
        const [columns] = await pool.query("SHOW COLUMNS FROM assessments");
        const columnNames = columns.map(c => c.Field);

        const newColumns = [
            { name: 'epithelial_pct', type: 'INT DEFAULT 0' },
            { name: 'slough_pct', type: 'INT DEFAULT 0' },
            { name: 'eschar_pct', type: 'INT DEFAULT 0' },
            { name: 'marker_data', type: 'TEXT' }
        ];

        for (const col of newColumns) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding column ${col.name}...`);
                await pool.query(`ALTER TABLE assessments ADD COLUMN ${col.name} ${col.type}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        console.log("Migration SUCCESSFUL.");
        process.exit(0);
    } catch (error) {
        console.error("Migration FAILED:", error);
        process.exit(1);
    }
}

migrate();
