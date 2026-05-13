import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.use({
  breaks: true,
  gfm: true,
});

const EMAIL_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "name"],
    span: ["style"],
    div: ["style"],
    p: ["style"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function markdownToEmailFragment(markdown: string): string {
  const raw = marked.parse(markdown.trimEnd() || " ", {
    async: false,
  }) as string;
  return sanitizeHtml(raw, EMAIL_SANITIZE_OPTIONS);
}

export function stripHtmlForPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

export type NewsletterWrapOpts = {
  innerHtmlFragment: string;
  subject?: string;
  brandName?: string;
  /** כתובת האתר — לכיתוב בתחתית */
  siteUrl?: string;
};

/** תבנית HTML RTL עם צבעי המותג — מתאימה למנחת הורים */
export function wrapNewsletterHtml(opts: NewsletterWrapOpts): string {
  const brand =
    opts.brandName ??
    process.env.NEWSLETTER_BRAND_NAME ??
    "מנחת הורים";
  const siteUrl =
    opts.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const inner = opts.innerHtmlFragment;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtmlAttr(opts.subject ?? brand)}</title>
</head>
<body style="margin:0;padding:0;background:#fdf8f6;">
  <div style="padding:24px 12px;font-family:Segoe UI,Arial,Helvetica,sans-serif;color:#374151;line-height:1.75;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 28px rgba(0,0,0,0.07);">
      <div style="background:linear-gradient(135deg,#d32035 0%,#cd2467 100%);padding:22px 26px;text-align:right;">
        <div style="font-size:21px;font-weight:800;color:#fff;letter-spacing:-0.02em;">${escapeHtmlAttr(brand)}</div>
        <div style="margin-top:6px;font-size:14px;color:#fecdd3;">מייל לקהילת ההורים — תוכן מקצועי ותמיכה</div>
      </div>
      <div style="padding:28px 26px 8px;text-align:right;font-size:16px;">
        ${inner}
      </div>
      <div style="padding:18px 26px 28px;text-align:right;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6;">
        <p style="margin:0 0 8px;">קיבלת מייל זה כי נרשמת לרשימת הניוזלטר שלנו.</p>
        ${
          siteUrl
            ? `<p style="margin:0;"><a href="${escapeHtmlAttr(siteUrl)}" style="color:#d32035;text-decoration:none;">לאתר</a></p>`
            : ""
        }
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function buildNewsletterFromMarkdown(markdown: string, subject: string): {
  html: string;
  text: string;
} {
  const fragment = markdownToEmailFragment(markdown);
  const html = wrapNewsletterHtml({
    innerHtmlFragment: fragment,
    subject,
  });
  const text = stripHtmlForPlainText(fragment);
  return { html, text };
}
