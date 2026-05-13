import Joi from "joi";

export const newsletterSendSchema = Joi.object({
  action: Joi.string().valid("preview", "send", "send_test").required(),
  subject: Joi.string().trim().min(1).max(300).required(),
  bodyMarkdown: Joi.string().allow("").max(400_000).required(),
  /** מצב שליחה — נבחרים או כל המנויים הפעילים */
  recipientMode: Joi.when("action", {
    is: "send",
    then: Joi.string().valid("selected", "all").required(),
    otherwise: Joi.string().optional(),
  }),
  /** מזהי מסמך מנוי (Mongo ObjectId hex) כש־recipientMode = selected */
  subscriberIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .max(5000)
    .default([]),
}).custom((obj, helpers) => {
  if (obj.action !== "send") return obj;
  if (obj.recipientMode === "selected" && obj.subscriberIds.length < 1) {
    return helpers.error("any.custom", {
      message: "בחרו לפחות מנוי אחד או עברו למצב כל הרשימה",
    });
  }
  return obj;
});
