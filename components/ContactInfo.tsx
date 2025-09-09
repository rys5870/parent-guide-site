import React from "react";
import SocialMedia from "./SocialMedia";

const ContactInfo = () => {
  return (
    <aside className="lg:col-span-1  bg-[#fffaf8] p-6 rounded-lg shadow flex flex-col gap-4">
      <h4 className="text-lg font-bold text-gray-800">פרטי קשר</h4>
      <div className="text-gray-600 text-sm">
        <p className="font-medium">דבורי רבינסקי — מדריכת הורים</p>
        <p>
          טלפון:{" "}
          <a href="tel:+972501234567" className="text-pink-600 hover:underline">
            050-1234567
          </a>
        </p>
        <p>
          אימייל:{" "}
          <a href="mailto:hello@example.com" className="text-pink-600 hover:underline">
            hello@example.com
          </a>
        </p>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-600">כתובת:</p>
        <p className="text-sm font-medium">רח&apos אברבנאל 123, בני ברק</p>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-600">שעות פעילות:</p>
        <ul className="text-sm">
          <li>ב׳–ה׳ 09:00–17:00</li>
          <li>יום ו׳ — לפי תיאום</li>
        </ul>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-600">עקבו ברשתות:</p>
        <div className="flex gap-3 mt-2">
          <SocialMedia />
        </div>
      </div>
    </aside>
  );
};

export default ContactInfo;