import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Demo success response (no DB yet)
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}