import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

const FaqAccordion = () => {
  return (
    <section className="rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 p-4 shadow-lg shadow-myColor_pink/10 backdrop-blur-md md:p-5">
      <h3 className="mb-3 text-xl font-extrabold text-gray-900 md:text-2xl">שאלות נפוצות</h3>
      <Accordion type="single" collapsible className="w-full divide-y divide-myColor_pink/10">
        <AccordionItem value="question-1">
          <AccordionTrigger>מה ההליך של מפגש ראשון?</AccordionTrigger>
          <AccordionContent>
            שיחה קצרה של 20 דקות להכרות, זיהוי האתגר ובניית מסגרת עבודה מותאמת אישית.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-2">
          <AccordionTrigger>האם יש מפגשים אונליין?</AccordionTrigger>
          <AccordionContent>
            כן — ניתן לקיים שיחות בזום או בפלטפורמות וידאו אחרות לפי העדפה.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-3">
          <AccordionTrigger>האם ניתן להגיע עם בן/בת הזוג?</AccordionTrigger>
          <AccordionContent>
            בהחלט. שיחות זוגיות הן חלק מהתהליך ויכולות להעצים את ההבנה ההורית המשותפת.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-4">
          <AccordionTrigger>האם יש התחייבות למספר מפגשים?</AccordionTrigger>
          <AccordionContent>
            לא. המפגש הראשון הוא ללא התחייבות, ומטרתו לבדוק התאמה ולבנות תהליך מותאם.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default FaqAccordion;