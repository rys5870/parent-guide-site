import DrawingForm from '@/components/DrawingForm'
import DrawingHeroSection from '@/components/DrawingHeroSection'
import PageBackdrop from '@/components/PageBackdrop'
import React from 'react'

export const metadata = {
  title: "שליחת ציורים | ד. רבינסקי",
  description:
    "שליחת ציורי ילדים לפענוח אישי, עם התייחסות רגישה לעולמו הפנימי של הילד ולמערכת המשפחתית.",
};

function page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <PageBackdrop />
      <DrawingHeroSection/>
      <DrawingForm/>
    </main>
  )
}

export default page