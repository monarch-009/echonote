import React from 'react'

/**
 * AuthLayout
 * Layout for authentication pages (sign-in, sign-up).
 * Centers the content on the screen with some padding.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className='flex justify-center pt-20'>{children} </div>
  )
}

export default AuthLayout