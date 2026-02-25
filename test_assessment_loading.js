
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function testAssessmentList() {
    try {
        console.log('Fetching assessment list...');
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/assessments`);
        const data = await res.json();
        const duration = Date.now() - start;

        console.log(`Fetch completed in ${duration}ms`);
        console.log(`Assessments found: ${data.length}`);

        if (data.length > 0) {
            const first = data[0];
            if (first.image_data) {
                console.error('FAILURE: image_data is still present in list view!');
                console.log('Size of first image_data:', first.image_data.length);
            } else {
                console.log('SUCCESS: image_data is correctly excluded from list view.');
            }
        } else {
            console.log('No assessments to check. Please add one first.');
        }

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

testAssessmentList();
