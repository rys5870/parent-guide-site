import React from "react";
import { contactDetails } from "@/constants/contact";

const LocationMap = () => {
  return (
    <section className="rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 p-4 shadow-lg shadow-myColor_pink/10 backdrop-blur-md md:p-5">
      <h3 className="text-xl font-extrabold text-gray-900 md:text-2xl">מיקום</h3>
      <p className="mt-2 text-sm text-gray-600">
        הכתובת שלי: {contactDetails.address}.
      </p>
      <div className="mt-4 h-52 w-full overflow-hidden rounded-2xl border border-myColor_pink/10 md:h-64">
        <iframe
          title="מפת אברבנאל 123 בני ברק"
          src="https://www.google.com/maps?q=אברבנאל+123,+בני+ברק&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default LocationMap;