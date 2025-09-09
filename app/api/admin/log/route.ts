import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import { UsersLogModel } from "@/lib/models/UsersLogModel";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await ConnectDB();

    const existingUserLog = await UsersLogModel.findOne({ userId: body.userId });

    if (!existingUserLog) {
      // יוזר חדש — צור רשומה עם ביקור ראשון
      await UsersLogModel.create({
        userId: body.userId,
        role: body.role,
        visits: [
          {
            path: body.path,
            device: body.device,
            timestamp: new Date(),
          },
        ],
      });
    } else {
      // יוזר קיים — הוסף ביקור חדש
      await UsersLogModel.updateOne(
        { userId: body.userId },
        {
          $push: {
            visits: {
              path: body.path,
              device: body.device,
              timestamp: new Date(),
            },
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving log:", err);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}