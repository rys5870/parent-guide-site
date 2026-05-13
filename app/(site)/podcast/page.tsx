import Podcasts from "@/components/Podcasts";
import Container from "@/components/Container";
import React from "react";
import TitleHeader from "@/components/TitleHeader";
import PageBackdrop from "@/components/PageBackdrop";

const page = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-x-hidden pb-24">
      <PageBackdrop />
      <TitleHeader
        eyebrow="שיחות והשראה"
        title="פודקאסטים"
        subtitle="הורות בין דורות: להבין את הדפוסים, ולבחור מחדש"
      />

      <Container className="relative z-10 w-full">
        <Podcasts />
      </Container>
    </div>
  );
};

export default page;
