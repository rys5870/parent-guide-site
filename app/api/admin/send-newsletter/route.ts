import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import EmailModel from "@/lib/models/EmailModel";
import { buildNewsletterFromMarkdown } from "@/lib/mail/newsletterHtml";
import {
  isSmtpConfigured,
  sendNewsletterMessage,
} from "@/lib/mail/smtpMailer";
import { newsletterSendSchema } from "@/lib/validations/newsletterSendValidation";
import mongoose from "mongoose";

const BATCH_DELAY_MS = 120;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { error, value } = newsletterSendSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const msg =
        error.details.find((d) => d.type === "any.custom")?.context
          ?.message ?? error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { action, subject, bodyMarkdown, recipientMode, subscriberIds } =
      value;

    const { html, text } = buildNewsletterFromMarkdown(bodyMarkdown, subject);

    if (action === "preview") {
      return NextResponse.json({ success: true, html, text });
    }

    if (action === "send_test") {
      if (!isSmtpConfigured()) {
        return NextResponse.json(
          {
            error:
              "שליחת מייל לא הוגדרה: מלאו SMTP_HOST, SMTP_USER, SMTP_PASS, NEWSLETTER_FROM_EMAIL בקובץ הסביבה",
          },
          { status: 503 }
        );
      }
      const user = await currentUser();
      const to =
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses?.[0]?.emailAddress;
      if (!to) {
        return NextResponse.json(
          { error: "לא נמצאה כתובת מייל בחשבון המנהל" },
          { status: 400 }
        );
      }
      try {
        await sendNewsletterMessage({ to, subject: `[בדיקה] ${subject}`, html, text });
      } catch (e) {
        console.error(e);
        return NextResponse.json(
          { error: "שגיאה בשליחת מייל ניסיון. בדקו את הגדרות ה־SMTP." },
          { status: 502 }
        );
      }
      return NextResponse.json({ success: true, sentTo: to });
    }

    if (action === "send") {
      if (!isSmtpConfigured()) {
        return NextResponse.json(
          {
            error:
              "שליחת מייל לא הוגדרה: מלאו SMTP_HOST, SMTP_USER, SMTP_PASS, NEWSLETTER_FROM_EMAIL בקובץ הסביבה",
          },
          { status: 503 }
        );
      }

      await ConnectDB();

      let targets: { id: string; email: string }[] = [];

      if (recipientMode === "all") {
        const rows = await EmailModel.find({ isDelete: { $ne: true } })
          .select("_id email")
          .lean();
        targets = rows.map((r) => ({
          id: String(r._id),
          email: String(r.email).trim().toLowerCase(),
        }));
      } else {
        const oids = subscriberIds.map(
          (id: string) => new mongoose.Types.ObjectId(id)
        );
        const rows = await EmailModel.find({
          _id: { $in: oids },
          isDelete: { $ne: true },
        })
          .select("_id email")
          .lean();
        targets = rows.map((r) => ({
          id: String(r._id),
          email: String(r.email).trim().toLowerCase(),
        }));
      }

      const seen = new Set<string>();
      targets = targets.filter((t) => {
        if (!t.email || !t.email.includes("@")) return false;
        if (seen.has(t.email)) return false;
        seen.add(t.email);
        return true;
      });

      if (targets.length === 0) {
        return NextResponse.json(
          { error: "אין מנויים פעילים לשליחה" },
          { status: 400 }
        );
      }

      let sent = 0;
      const failures: { email: string; message: string }[] = [];

      for (const t of targets) {
        try {
          await sendNewsletterMessage({
            to: t.email,
            subject,
            html,
            text,
          });
          sent += 1;
          await sleep(BATCH_DELAY_MS);
        } catch (e) {
          console.error("newsletter send fail", t.email, e);
          failures.push({
            email: t.email,
            message: e instanceof Error ? e.message : "unknown",
          });
        }
      }

      return NextResponse.json({
        success: true,
        sent,
        attempted: targets.length,
        failures,
      });
    }

    return NextResponse.json({ error: "פעולה לא ידועה" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
