import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!uploadPreset || !apiSecret) {
      return NextResponse.json({ error: "Missing Cloudinary config" }, { status: 500 });
    }

    const paramsToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      uploadPreset,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (err) {
    console.error("Signature error:", err);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}