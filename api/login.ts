import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * DEMO login API
 * (Since no DB is connected yet)
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // 🔴 TEMPORARY DEMO LOGIC
    // Accept any login for now
    return res.status(200).json({
      success: true,
      user: {
        email,
        role: "DOCTOR",
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}