import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, otp, generatedOtp } = req.body;

    // Basic validation
    if (!email || !otp || !generatedOtp) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // OTP check
    if (otp === generatedOtp) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}