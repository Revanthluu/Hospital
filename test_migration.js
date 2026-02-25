
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function testAPI() {
    try {
        console.log('Testing Patient Creation...');
        const uniqueId = Date.now().toString();
        const patientData = {
            id: 'pat_' + uniqueId,
            mrn: 'MRN' + uniqueId,
            firstName: 'Test',
            lastName: 'Patient',
            dob: '1990-01-01',
            gender: 'Male',
            admissionDate: '2023-01-01',
            ward: 'A',
            room: '101',
            diagnosis: 'Test Diagnosis'
        };

        const patRes = await fetch(`${BASE_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });

        if (patRes.status === 201) {
            console.log('Patient Created Successfully');
        } else {
            console.error('Patient Creation Failed:', await patRes.text());
            return;
        }

        console.log('Testing Assessment Creation (with mock image)...');
        const assessmentData = {
            id: 'asm_' + uniqueId,
            patient_id: patientData.id,
            date: new Date().toISOString(),
            wound_location: 'Leg',
            wound_type: 'Ulcer',
            wound_stage: 'Stage 1',
            length_cm: 5.5,
            width_cm: 3.2,
            depth_cm: 0.5,
            pain_level: 4,
            notes: 'Testing notes',
            granulation_pct: 50,
            status: 'Stable',
            image_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
        };

        const asmRes = await fetch(`${BASE_URL}/assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentData)
        });

        if (asmRes.status === 201) {
            console.log('Assessment Created Successfully');
        } else {
            console.error('Assessment Creation Failed:', await asmRes.text());
            return;
        }

        console.log('Verifying Data Persistence...');
        const getRes = await fetch(`${BASE_URL}/assessments`);
        const assessments = await getRes.json();
        const storedAsm = assessments.find(a => a.id === assessmentData.id);

        if (storedAsm && storedAsm.image_data === assessmentData.image_data) {
            console.log('SUCCESS: Image data persisted correctly in SQL Database!');
        } else {
            console.error('FAILURE: Could not find created assessment or image data mismatch.');
        }

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

testAPI();
