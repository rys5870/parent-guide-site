import React from "react";
import SocialMedia from "./SocialMedia";
import { contactDetails } from "@/constants/contact";

const ContactInfo = () => {
  return (
    <aside className="flex flex-col gap-4 rounded-[1.5rem] border border-myColor_pink/15 bg-white/86 p-4 shadow-lg shadow-myColor_pink/10 backdrop-blur-md md:p-5 lg:col-span-1">
      <div>
        <p className="text-xs font-bold text-myColor_red md:text-sm">פרטי קשר</p>
        <h4 className="mt-1 text-lg font-extrabold text-gray-900">
          {contactDetails.name} — {contactDetails.role}
        </h4>
      </div>
      <div className="space-y-3 text-sm text-gray-700">
        <p>
          טלפון:{" "}
          <a href={contactDetails.phoneHref} className="font-bold text-myColor_red hover:underline">
            {contactDetails.phoneLabel}
          </a>
        </p>
        <p>
          אימייל:{" "}
          <a href={contactDetails.emailHref} className="font-bold text-myColor_red hover:underline">
            {contactDetails.email}
          </a>
        </p>
      </div>

      <div className="border-t border-myColor_pink/10 pt-3">
        <p className="text-sm text-gray-600">כתובת:</p>
        <p className="text-sm font-bold text-gray-800">{contactDetails.address}</p>
      </div>

      <div className="border-t border-myColor_pink/10 pt-3">
        <p className="text-sm text-gray-600">שעות פעילות:</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-800">
          {contactDetails.hours.map((hour) => (
            <li key={hour}>{hour}</li>
          ))}
        </ul>
      </div>

      <div className="border-t border-myColor_pink/10 pt-3">
        <p className="text-sm text-gray-600">עקבו ברשתות:</p>
        <div className="flex gap-3 mt-2">
          <SocialMedia />
        </div>
      </div>
    </aside>
  );
};

export default ContactInfo;