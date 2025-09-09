"use client";
import React from "react";
import { motion } from "framer-motion";
import AboutSection from "./AboutSection";
import ChildrenContextBlock from "./ChildrenContextBlock";
import { MdHealing } from 'react-icons/md';         // ריפוי ההורות
import { FaHeart, FaHandsHelping, FaWalking } from 'react-icons/fa'; // אהבה, הכלה, מסע
import { GiPlantRoots, GiMeditation } from 'react-icons/gi'; // התפתחות, נוכחות

const blocks = [
  {
    icon: <MdHealing />,
    title: "ריפוי ההורות הוא תחילת הדרך",
    contentText:"הדרכת הורים מתחילה בריפוי ההורות שינוי אמיתי לא נולד מטכניקות חיצוניות, אלא מריפוי של הלב האמהי שלך ושינוי ההרגשה והחוויה שלך כאמא",
  },
  {
    icon: <FaHeart />,
   title: "כדי לאהוב באמת חשוב להרגיש אהובה",
        contentText:"כדי שאת אמא תצליחי לאהוב באמת, חשוב שתרגישי אהובה בעצמך! אם קיבלת אהבה והרגשת אותה בליבך בעז\"ה יהיה לך קל יותר ואם לא, תדעי לך שזה אפשרי, כדאי והרווח הוא לדורות קדימה",

  },
  {
    icon: <FaHandsHelping />,
   title: "הכלה מתחילה בתוכך",
        contentText:"כשאת מכילה את עצמך – את יכולה להכיל גם את הילד שלך היכולת שלך לעמוד מול הבכי, הכעס, הפחד וכל רגש של הילד מתחילה ביכולת שלך לעמוד מול הרגשות שבתוכך.",

  },
  {
    icon: <GiPlantRoots />,
   title: "קושי הוא שער להתפתחות",
        contentText:"כל קושי עם הילד – הוא הזדמנות להתפתחות זה לא קל ולא תמיד פשוט, לעיתים זה נראה כמאבק מיותר ומתיש אבל כשמצליחים לעבור דרך זה מגלים עולם מרתק של חיבור עוצמתי ועמוק יותר",

  },
  {
    icon: <FaWalking />,
   title: "הורות היא מסע חיים",
        contentText:"הורות היא בעצם תהליך שנולד עם הילד הראשון ונמשך עד 120 תהליך מרתק שמפגיש אותנו כל פעם עם חלק שמחכה להתפתח ולגדול בתוכינו ולגדל את ילדינו מתוך זה",

  },
  {
    icon: <GiMeditation />,
   title: "אין אמא מושלמת – יש אמא נוכחת",
        contentText:"אין אמא מושלמת יש אמא שמרגישה שלימה זה לא תמיד קורה, ולא באופן קבוע אבל כשאנחנו מצליחות להיות שם נוכחות, קשובות עם לב פתוח אנחנו מצליחות להרגיש סיפוק, התקדמות וגדילה וזאת מתנה אדירה גם עבור הילדים שלנו",

  },
];


const ChildInAdultWorld = () => {
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch [grid-auto-rows:1fr]">
      {blocks.map((block, index) => (
        <motion.div
        className="h-full"
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.2,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <ChildrenContextBlock icon={block.icon}>
            <AboutSection title={block.title} content={block.contentText} />
          </ChildrenContextBlock>
        </motion.div>
      ))}
    </div>
  );
};

export default ChildInAdultWorld;