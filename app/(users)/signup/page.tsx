import type { Metadata } from "next";
import UserSignupForm from '@/components/auth/UserSignupForm';

export const metadata: Metadata = {
  title: "Sign Up - CallOfCoders | Join Kush Kumar's Developer Community",
  description: "Create your free CallOfCoders account by Kush Kumar - Full Stack Developer. Access online compiler for JavaScript, Python, TypeScript, Java, C++, React, Next.js. Learn DSA, web development, save code projects, and join a thriving developer community. Start coding online for free.",
  keywords: ["CallOfCoders signup", "Kush Kumar", "create developer account", "free online compiler", "join coding platform", "programming community", "learn to code", "JavaScript learning", "Python tutorial", "web development course", "free code editor", "developer registration", "coding bootcamp", "full stack developer"],
  authors: [{ name: "Kush Kumar" }],
  openGraph: {
    title: "Sign Up - CallOfCoders | Kush Kumar Developer Platform",
    description: "Join CallOfCoders by Kush Kumar - Free online compiler, code learning, and developer community. Start your programming journey today!",
    type: "website",
  },
};

export default function SignupPage() {
  return (
    <div className="container mx-auto max-w-7xl flex items-center justify-center">
      <UserSignupForm />
    </div>
  );
}
