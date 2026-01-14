import type { Metadata } from "next";
import UserSignupForm from '@/components/UserSignupForm';

export const metadata: Metadata = {
  title: "Sign Up - CallOfCoders | Join Developer Community",
  description: "Create your free CallOfCoders account. Access online code compiler, learning resources, and join a community of developers learning JavaScript, Python, TypeScript, React, and more.",
};

export default function SignupPage() {
  return <UserSignupForm />;
}
