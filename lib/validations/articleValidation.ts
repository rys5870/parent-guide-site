import Joi from "joi";

export const articleSchema = Joi.object({
  title: Joi.string().min(5).max(150).required().messages({
    "string.empty": "כותרת המאמר לא יכולה להיות ריקה",
    "string.min": "כותרת חייבת להכיל לפחות 5 תווים",
    "any.required": "כותרת היא שדה חובה",
  }),

  category: Joi.string()
    .required()
    .messages({
      "any.required": "קטגוריה היא שדה חובה",
      "string.empty": "קטגוריה לא יכולה להיות ריקה",
    }),

 image: Joi.string()
  .uri({ scheme: ["http", "https"] })
  .required()
  .messages({
    "string.uri": "כתובת התמונה אינה תקינה",
    "any.required": "תמונה היא שדה חובה",
    "string.empty": "שדה התמונה לא יכול להיות ריק",
  }),


  sections: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().allow("").optional(),

        title: Joi.string().max(100).messages({
          "string.max": "כותרת הסקשן ארוכה מדי",
        }),

        content: Joi.string().min(10).required().messages({
          "string.empty": "תוכן הסקשן לא יכול להיות ריק",
          "string.min": "תוכן הסקשן חייב להכיל לפחות 10 תווים",
          "any.required": "תוכן הסקשן הוא חובה",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "יש לכלול לפחות חלק אחד במאמר",
      "any.required": "שדות התוכן הם חובה",
    }),
});