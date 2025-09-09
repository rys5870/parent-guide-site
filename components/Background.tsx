import React from 'react'

const Background = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* עיגול שיופיע רק במסך קטן */}
                <div className="w-72 h-72 rounded-full bg-[var(--color-myColor_red)] opacity-30 blur-2xl absolute top-1/3 left-1/3 sm:block md:hidden" />
    
                <div className="w-72 h-72 rounded-full bg-[var(--color-myColor_pink)] opacity-30 blur-2xl absolute top-10 left-20 hidden md:block" />
                <div className="w-60 h-60 rounded-full bg-[var(--color-myColor_red)] opacity-30 blur-2xl absolute bottom-16 right-32 hidden md:block" />
                <div className="w-48 h-48 rounded-full bg-[var(--color-myColor_orange)] opacity-30 blur-2xl absolute top-1/2 left-1/3 hidden md:block" />
                <div className="w-28 h-28 bg-[var(--color-myColor_pink)] opacity-10 rotate-12 blur-xl absolute hidden md:block" />
                <div className="w-40 h-24 bg-[var(--color-myColor_red)] opacity-10 blur-xl rounded-full absolute hidden md:block md:bottom-[20%] md:left-[30%]" />
              </div>
  )
}

export default Background