'use client'
import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './SideMenu'

const MobilMenu = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  return (
    <>
    <button onClick={() => setIsSideMenuOpen(!isSideMenuOpen)} className='md:hidden hover:cursor-pointer'>
        <AlignLeft className='hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer'/>
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