/**
 * הרחבה עתידית — תשלום (Morning, Spring וכו')
 *
 * מומלץ לחבר Webhook בספק שמעדכן את אוסף `CourseAccess` ב-Mongo:
 * - `source`: `'purchase'` לרכישת קורס בודד, או `'subscription'` למנוי.
 * - `clerkUserId`: מזהה Clerk (למשל מתוך מטא-דאטה בשדה שנקבע בשילוב עם הספק).
 * - `courseId`: מזהה ObjectId של מסמך `Course`; למנוי "כל הקורסים" — ליצור `CourseAccess` לכל הקורסים המפורסמים או לפתוח שדה/מוצר ארגון נפרד.
 * - `expiresAt`: מתאריך סיום מהספק, או `null` לגישה ללא תאריך סיום.
 *
 * הגנות ה-API הציבורי/הלימוד הקיימות נשענות על `CourseAccess` בלבד; אין צורך לשנות את נתיבי `/api/learn`.
 */
export {};
