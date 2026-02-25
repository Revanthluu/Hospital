
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function test() {
    try {
        console.log("Testing database connection...");
        const [patients] = await pool.query("SELECT id FROM patients LIMIT 1");
        if (patients.length === 0) {
            console.error("No patients found in DB. Test cannot proceed.");
            process.exit(1);
        }
        const patientId = patients[0].id;

        const assessment = {
            id: 'TEST-' + Date.now(),
            patient_id: patientId,
            date: new Date().toISOString(),
            wound_location: 'Test Location',
            wound_type: 'Test Type',
            wound_stage: 'Stage I',
            length_cm: 1.0,
            width_cm: 1.0,
            depth_cm: 1.0,
            pain_level: 1,
            notes: 'Test notes',
            granulation_pct: 100,
            epithelial_pct: 0,
            slough_pct: 0,
            eschar_pct: 0,
            marker_data: JSON.stringify({ marker: { x: 50, y: 50 }, zoom: 1, rotation: 0 }),
            status: 'Stable',
            image_data: 'test_image',
            doctor_suggestion: 'Test suggestion'
        };

        const query = `
            INSERT INTO assessments (
                id, patient_id, date, wound_location, wound_type, wound_stage,
                length_cm, width_cm, depth_cm, pain_level, notes, 
                granulation_pct, epithelial_pct, slough_pct, eschar_pct,
                marker_data, status, image_data, doctor_suggestion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [
            assessment.id, assessment.patient_id, new Date(assessment.date),
            assessment.wound_location, assessment.wound_type, assessment.wound_stage,
            assessment.length_cm, assessment.width_cm, assessment.depth_cm,
            assessment.pain_level, assessment.notes,
            assessment.granulation_pct, assessment.epithelial_pct, assessment.slough_pct, assessment.eschar_pct,
            assessment.marker_data, assessment.status, assessment.image_data, assessment.doctor_suggestion
        ]);

        console.log("SUCCESS: Insertion worked.");

        const [results] = await pool.query("SELECT * FROM assessments WHERE id = ?", [assessment.id]);
        console.log("Retrieved assessment:", results[0]);

        // Cleanup
        await pool.query("DELETE FROM assessments WHERE id = ?", [assessment.id]);
        console.log("Cleanup done.");

        process.exit(0);
    } catch (error) {
        console.error("FAILURE:", error);
        process.exit(1);
    }
}

test();
