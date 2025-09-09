import React from "react";
import ContentForm from "./ContentForm";
import ContectHeroSection from "./ContectHeroSection";
import ContactInfo from "./ContactInfo";
import LocationMap from "./LocationMap";
import FaqAccordion from "./FaqAccordion";


const Contact: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-6">
      <ContectHeroSection />
      <section id="contact" className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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