import React from "react";
import ContentForm from "./ContentForm";
import ContectHeroSection from "./ContectHeroSection";
import ContactInfo from "./ContactInfo";
import LocationMap from "./LocationMap";
import FaqAccordion from "./FaqAccordion";


const Contact: React.FC = () => {
  return (
    <div className="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-5 md:px-6 md:py-8">
      <ContectHeroSection />
      <section id="contact" className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <ContentForm />
        </div>
        <ContactInfo />
      </section>
      <LocationMap />
      <FaqAccordion />
    </div>
  );
};

export default Contact;