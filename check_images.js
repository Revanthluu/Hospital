
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server directory
dotenv.config({ path: path.join(__dirname, 'server/.env') });

const checkImages = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        const [rows] = await connection.execute(
            'SELECT id, patient_id, date, LENGTH(image_data) as image_size, LEFT(image_data, 50) as image_preview FROM assessments ORDER BY date DESC'
        );

        console.log('\n--- Assessment Images ---');
        if (rows.length === 0) {
            console.log('No assessments found.');
        } else {
            console.table(rows);
            console.log(`\nFound ${rows.length} assessments.`);
            console.log('Note: "image_size" is in bytes/characters. "image_preview" shows start of Base64 string.');
        }

        await connection.end();
    } catch (error) {
        console.error('Error checking images:', error);
    }
};

checkImages();
