import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Email and password required",
        }),
      };
    }

    // ✅ DEMO LOGIN (NO DB YET)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: "1",
          email,
          fullName: "Demo Doctor",
          role: "DOCTOR",
        },
      }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};