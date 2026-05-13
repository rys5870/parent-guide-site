import ArticleFilter from "@/components/ArticleFilter";
import TitleHeader from "@/components/TitleHeader";
import Container from "@/components/Container";
import PageBackdrop from "@/components/PageBackdrop";
import React from "react";

const page = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-x-hidden pb-20">
      <PageBackdrop />
      <TitleHeader
        eyebrow="מאמרים וכלים"
        title="מאמרים שיעזרו לכם לגדל ילדים מאושרים"
        subtitle="מדריך מעשי להורים שרוצים לבנות קשר עמוק, רגוע ומכבד"
      />
      <Container className="relative z-10 w-full">
        <ArticleFilter />
      </Container>
    </div>
  );
};

export default page;

