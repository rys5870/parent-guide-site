import mongoose from "mongoose";

declare global {
  var mongoose_cached: Promise<typeof mongoose> | undefined;
}

/**
 * משתמש ב-Promise מאוחד למניעת connect מקבילי בין טעינות route ב-Next.js.
 */
export const ConnectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI לא מוגדר");

  if (mongoose.connection.readyState === 1) return;

  try {
    if (!global.mongoose_cached) {
      global.mongoose_cached = mongoose.connect(uri);
    }
    await global.mongoose_cached;

    if (process.env.NODE_ENV === "development") {
      console.log("DB Connected");
    }
  } catch (error) {
    global.mongoose_cached = undefined;
    throw error;
  }
};
