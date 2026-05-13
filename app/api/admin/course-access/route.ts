import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import CourseModel from "@/lib/models/CourseModel";
import CourseAccessModel from "@/lib/models/CourseAccessModel";
import {
  courseAccessGrantSchema,
  courseAccessRevokeSchema,
} from "@/lib/validations/lmsCourseValidation";

export async function GET(request: NextRequest) {
  try {
    await ConnectDB();
    const url = request.nextUrl;
    const clerkUserId = url.searchParams.get("clerkUserId");
    const courseId = url.searchParams.get("courseId");

    if (clerkUserId) {
      const list = await CourseAccessModel.find({ clerkUserId })
        .populate("courseId", "title slug isPublished coverImage")
        .lean()
        .exec();
      return NextResponse.json(list);
    }

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return NextResponse.json({ error: "מזהה קורס לא תקין" }, { status: 400 });
      }
      const list = await CourseAccessModel.find({
        courseId: new mongoose.Types.ObjectId(courseId),
      }).lean();
      return NextResponse.json(list);
    }

    return NextResponse.json(
      { error: "נדרש פרמטר clerkUserId או courseId" },
      { status: 400 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();
    type PostBody = {
      action?: string;
      clerkUserId?: string;
      courseIds?: string[];
      grantAllPublished?: boolean;
      source?: string;
      expiresAt?: string | Date | null;
    };
    const body = (await request.json()) as PostBody;

    if (body.action === "revoke") {
      const { error, value } = courseAccessRevokeSchema.validate(
        { clerkUserId: body.clerkUserId, courseIds: body.courseIds },
        {
          abortEarly: false,
          stripUnknown: true,
        }
      );
      if (error) {
        return NextResponse.json(
          { error: error.details.map((d) => d.message).join("; ") },
          { status: 400 }
        );
      }
      const oids = value.courseIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );
      await CourseAccessModel.deleteMany({
        clerkUserId: value.clerkUserId,
        courseId: { $in: oids },
      });
      return NextResponse.json({ success: true });
    }

    const expiresExplicit = Object.prototype.hasOwnProperty.call(
      body,
      "expiresAt"
    );

    const grantPayload: {
      clerkUserId?: string;
      courseIds?: string[];
      grantAllPublished?: boolean;
      source?: string;
      expiresAt?: string | Date | null;
    } = {
      clerkUserId: body.clerkUserId,
      courseIds: body.courseIds,
      grantAllPublished: body.grantAllPublished,
      source: body.source,
    };
    if (expiresExplicit) {
      grantPayload.expiresAt =
        body.expiresAt === null ||
        body.expiresAt === "" ||
        (typeof body.expiresAt === "string" && body.expiresAt.trim() === "")
          ? null
          : body.expiresAt;
    }

    const { error, value } = courseAccessGrantSchema.validate(grantPayload, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const msg =
        error.details.find((d) => d.type === "any.custom")?.context?.message ||
        error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    let ids: mongoose.Types.ObjectId[] = [];
    if (value.grantAllPublished) {
      const pubs = await CourseModel.find({ isPublished: true })
        .select("_id")
        .lean();
      ids = pubs.map((c) => c._id as mongoose.Types.ObjectId);
    } else {
      ids =
        value.courseIds?.map((id: string) => new mongoose.Types.ObjectId(id)) ??
        [];
    }

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "אין קורסים מפורסמים להענקה" },
        { status: 400 }
      );
    }

    const ops = ids.map((oid) => {
      const $set: Record<string, unknown> = {
        clerkUserId: value.clerkUserId,
        courseId: oid,
        source: value.source ?? "admin",
      };
      if (expiresExplicit) {
        $set.expiresAt =
          value.expiresAt === null || value.expiresAt === undefined
            ? null
            : new Date(value.expiresAt);
      }
      return {
        updateOne: {
          filter: { clerkUserId: value.clerkUserId, courseId: oid },
          update: { $set },
          upsert: true,
        },
      };
    });

    await CourseAccessModel.bulkWrite(ops, { ordered: false });
    return NextResponse.json({ success: true, grantedCount: ids.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
