
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function migrateUsers() {
    try {
        console.log("Checking columns in 'users' table...");
        const [columns] = await pool.query("SHOW COLUMNS FROM users");
        const columnNames = columns.map(c => c.Field);

        const newColumns = [
            { name: 'specialty', type: 'VARCHAR(100)' },
            { name: 'license_number', type: 'VARCHAR(50)' },
            { name: 'department', type: 'VARCHAR(100)' },
            { name: 'measurement_unit', type: "ENUM('cm', 'mm', 'inches') DEFAULT 'cm'" },
            { name: 'date_format', type: "ENUM('MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD') DEFAULT 'MM/DD/YYYY'" },
            { name: 'font_size', type: "ENUM('small', 'standard', 'large') DEFAULT 'standard'" }
        ];

        for (const col of newColumns) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding column ${col.name}...`);
                await pool.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        console.log("Users table migration SUCCESSFUL.");
        process.exit(0);
    } catch (error) {
        console.error("Users table migration FAILED:", error);
        process.exit(1);
    }
}

migrateUsers();
