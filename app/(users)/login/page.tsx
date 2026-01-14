import type { Metadata } from "next";
import UserLoginForm from '@/components/UserLoginForm';

export const metadata: Metadata = {
  title: "Login - CallOfCoders | Access Your Developer Account",
  description: "Login to CallOfCoders to access online compiler, save your code, track learning progress, and connect with the developer community.",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-7xl flex items-center justify-center">
      <UserLoginForm />
    </div>
  );
}
