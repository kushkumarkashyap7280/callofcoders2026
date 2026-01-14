import type { Metadata } from "next";
import UserLoginForm from '@/components/UserLoginForm';

export const metadata: Metadata = {
  title: "Login - CallOfCoders | Kush Kumar's Developer Platform",
  description: "Login to CallOfCoders by Kush Kumar - Access your online code compiler, save projects, track learning progress, and connect with the developer community. Full Stack Developer platform for JavaScript, Python, TypeScript, React, Next.js.",
  keywords: ["CallOfCoders login", "Kush Kumar", "developer account", "online compiler login", "code editor login", "programming platform", "developer portal", "coding account", "JavaScript IDE", "Python compiler", "web development tools"],
  authors: [{ name: "Kush Kumar" }],
  openGraph: {
    title: "Login - CallOfCoders | Kush Kumar Developer Platform",
    description: "Access your CallOfCoders account by Kush Kumar - Online compiler, code learning, and developer resources",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-7xl flex items-center justify-center">
      <UserLoginForm />
    </div>
  );
}
