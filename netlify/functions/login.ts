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

    // 🔹 DEMO ROLE LOGIC (TEMPORARY)
    // Replace with DB later
    let role = "PATIENT";

    if (email.includes("admin")) role = "ADMIN";
    else if (email.includes("doctor")) role = "DOCTOR";
    else if (email.includes("nurse")) role = "NURSE";

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: "1",
          email,
          fullName: email.split("@")[0],
          role,
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