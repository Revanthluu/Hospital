
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function testLargePayload() {
    try {
        console.log('Testing Large Payload (200KB)...');

        // Create a large string (approx 200KB)
        const largeString = 'a'.repeat(200 * 1024);

        const payload = {
            id: 'test_large_' + Date.now(),
            patient_id: 'pat_test',
            date: new Date().toISOString(),
            // ... other required fields
            image_data: largeString // excessive data
        };

        const res = await fetch(`${BASE_URL}/assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.status === 413) {
            console.log('CONFIRMED: Server returned 413 Payload Too Large');
        } else if (res.status === 201) {
            console.log('unexpected success: Server accepted large payload');
        } else {
            console.log(`Server returned status: ${res.status}`);
            console.log('Response:', await res.text());
        }

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

testLargePayload();
