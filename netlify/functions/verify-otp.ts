import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" }),
    };
  }

  try {
    const { otp, generatedOtp } = JSON.parse(event.body || "{}");

    if (!otp || !generatedOtp) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing OTP" }),
      };
    }

    if (otp === generatedOtp) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Invalid OTP" }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};