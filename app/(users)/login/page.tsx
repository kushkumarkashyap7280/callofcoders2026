import React from 'react'
import UserLoginForm from '@/components/UserLoginForm'

export const metadata = {
  title: 'Login',
  description: 'Access your account',
}

function page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <UserLoginForm />
    </div>
  )
}

export default page
