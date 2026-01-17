import type { Metadata } from "next";
import Welcome from "@/components/layout/Welcome";

export const metadata: Metadata = {
  title: "CallOfCoders - Learn Programming, Code Online & Connect with Developers | Kush Kumar",
  description: "Welcome to CallOfCoders - A developer platform by Kush Kumar, Full Stack Developer. Access online compiler for Python, JavaScript, TypeScript, Java, C++. Learn DSA, web development, and connect with developers worldwide. Free code execution and learning resources.",
  keywords: ["CallOfCoders", "Kush Kumar", "online compiler", "code editor", "learn programming", "JavaScript tutorial", "Python compiler", "developer community", "coding platform", "full stack developer portfolio"],
};

export default function HomePage() {
  return <Welcome />;
}
