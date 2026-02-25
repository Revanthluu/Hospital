import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.VITE_GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.models) {
            const names = data.models.map(m => m.name).filter(n => n.includes('gemini'));
            fs.writeFileSync('models.log', names.join('\n'));
        } else {
            fs.writeFileSync('models.log', JSON.stringify(data, null, 2));
        }
    })
    .catch(err => fs.writeFileSync('models.log', String(err)));
