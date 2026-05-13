'use client'
import { Menu } from 'lucide-react'
import React, { useState } from 'react'
import dynamic from 'next/dynamic';

const SideMenu = dynamic(() => import('./SideMenu'), { ssr: false });


const MobilMenu = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  return (
    <>
    <button
      type="button"
      aria-label="פתיחת תפריט ניווט"
      aria-expanded={isSideMenuOpen}
      onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
      className='inline-flex size-9 items-center justify-center rounded-full border border-myColor_pink/15 bg-white text-myColor_red shadow-sm transition hover:bg-myColor_red hover:text-white sm:size-10 md:hidden'
    >
        <Menu className='size-4 sm:size-5'/>
    </button>
    <div className='md:hidden'>
         <SideMenu
         isOpen={isSideMenuOpen}
         onClose={() => setIsSideMenuOpen(false)}
         />
    </div>
   
    </>
  )
}

export default MobilMenu