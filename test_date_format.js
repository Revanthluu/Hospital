
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function testDateFormat() {
    try {
        console.log('Testing Patient Creation with ISO Date...');
        const uniqueId = Date.now().toString();
        const patientData = {
            id: 'pat_test_' + uniqueId,
            mrn: 'MRN_TEST_' + uniqueId,
            firstName: 'Date',
            lastName: 'Test',
            dob: '1990-01-01',
            gender: 'Male',
            admissionDate: new Date().toISOString().split('T')[0], // Correct format
            ward: 'A',
            room: '101',
            diagnosis: 'Test Diagnosis'
        };

        console.log('Sending payload:', patientData);

        const patRes = await fetch(`${BASE_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });

        if (patRes.status === 201) {
            console.log('SUCCESS: Patient created with ISO date.');
        } else {
            console.error('FAILURE: Patient creation failed with status:', patRes.status);
            console.error('Response:', await patRes.text());
        }

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

testDateFormat();
