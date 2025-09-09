import { SignInButton } from '@clerk/nextjs'
import React from 'react'

const SignIn = () => {
  return (
    <SignInButton >
      <button className='text-sm font-bold hover:text-darkColor text-myColor_red hover:cursor-pointer hoverEffect'>
        התחברות
      </button>
      </SignInButton>
  )
}

export default SignIn