import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;

console.log("----------------------------------------");
console.log("Debugging Gemini API Availability");
console.log("API Key found:", apiKey ? "Yes (" + apiKey.slice(0, 5) + "..." + apiKey.slice(-4) + ")" : "NO");
console.log("----------------------------------------");

if (!apiKey || apiKey.startsWith("YOUR_")) {
    console.error("❌ Invalid or missing API Key. Please check .env");
    process.exit(1);
}

async function checkModels() {
    console.log("Attempting to list models via REST API (v1beta)...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`❌ REST Request failed: ${response.status} ${response.statusText}`);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        if (data.models) {
            console.log("✅ All Available Models:");
            data.models.forEach(m => {
                const name = m.name.replace('models/', '');
                const methods = m.supportedGenerationMethods.join(', ');
                console.log(` - ${name} [${methods}]`);
            });
        } else {
            console.log("⚠️ No models returned in list:", data);
        }
    } catch (error) {
        console.error("❌ REST Error:", error);
    }
}

checkModels();
