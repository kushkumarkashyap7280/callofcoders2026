import React from 'react'
import UserSignupForm from '@/components/UserSignupForm';

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

function page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <UserSignupForm />
    </div>
  )
}

export default page
