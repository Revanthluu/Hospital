
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function debugHistory() {
    try {
        console.log('--- Fetching Data ---');

        // 1. Fetch Patients
        const patRes = await fetch(`${BASE_URL}/patients`);
        const patients = await patRes.json();
        console.log(`Fetched ${patients.length} patients.`);

        // Create Patient Map
        const pMap = {};
        patients.forEach(p => pMap[p.id] = p);

        // 2. Fetch Assessments
        const assRes = await fetch(`${BASE_URL}/assessments`);
        const assessments = await assRes.json();
        console.log(`Fetched ${assessments.length} assessments.`);

        console.log('\n--- Analyzing Data Linkage ---');

        assessments.forEach(a => {
            const linkedPatient = pMap[a.patient_id];
            if (linkedPatient) {
                console.log(`[OK] Assessment ${a.id} linked to -> ${linkedPatient.firstName} ${linkedPatient.lastName} (${linkedPatient.mrn})`);
            } else {
                console.error(`[ERROR] Assessment ${a.id} has patient_id '${a.patient_id}' which DOES NOT EXIST in patient list!`);
            }
        });

        if (assessments.length === 0) {
            console.log('No assessments to analyze.');
        }

    } catch (e) {
        console.error('Debug script failed:', e);
    }
}

debugHistory();
