import type { Metadata } from "next";
import Compiler from '@/components/Compiler';

export const metadata: Metadata = {
  title: "Online Code Compiler - Run Python, JavaScript, Java, C++, TypeScript | CallOfCoders",
  description: "Free online code compiler by Kush Kumar. Compile and run code in Python, JavaScript, TypeScript, Java, C++, Go, Rust, PHP, Ruby. Real-time code execution with syntax highlighting. Perfect for learning, testing, and debugging code.",
  keywords: ["online compiler", "code editor", "Python compiler", "JavaScript compiler", "Java compiler", "C++ compiler", "TypeScript compiler", "run code online", "code execution", "programming IDE"],
};

export default function CompilerPage() {
  return <Compiler />;
}
