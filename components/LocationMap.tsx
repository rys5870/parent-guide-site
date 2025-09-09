import React from "react";

const LocationMap = () => {
  return (
    <section className="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold text-gray-800">מיקום</h3>
      <p className="text-sm text-gray-600 mt-1">
        הכתובת שלי: אברבנאל 123, בני ברק.
      </p>
      <div className="mt-4 w-full h-56 rounded-lg overflow-hidden border border-gray-100">
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