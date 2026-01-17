import type { Metadata } from "next";
import AboutMe from "@/components/about/AboutMe";

export const metadata: Metadata = {
  title: "About Kush Kumar - Full Stack Developer | CallOfCoders",
  description: "Learn about Kush Kumar, Full Stack Developer specializing in JavaScript, TypeScript, React, Next.js, Python, Java, C++. Creator of CallOfCoders - an online code compiler and developer learning platform.",
  keywords: ["Kush Kumar", "Full Stack Developer", "About", "Developer Portfolio", "JavaScript Expert", "React Developer", "Software Engineer"],
};

export default function AboutPage() {
  return <AboutMe />;
}
