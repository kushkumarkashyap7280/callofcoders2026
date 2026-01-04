// components/Quiz.tsx
'use client'; // 👈 Crucial: Needs state

import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Reusing your Shadcn button!

interface QuizProps {
  question: string;
  answer: string; // Expecting strings like "Yes", "No", "True", "False" based on your seed data
}

export default function Quiz({ question, answer }: QuizProps) {
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleGuess = (guess: string) => {
    // Simple case-insensitive check
    if (guess.toLowerCase() === answer.toLowerCase()) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="my-8 p-6 border rounded-xl bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Pop Quiz: {question}
      </h3>

      {/* The Option Buttons */}
      <div className="flex gap-3 mb-4">
        {/* You might want to make these options dynamic props later, but hardcoding Yes/No works for now */}
        <Button 
          onClick={() => handleGuess("Yes")}
          variant={status === 'idle' ? "outline" : "secondary"}
          disabled={status === 'correct'}
        >
          Yes
        </Button>
        <Button 
          onClick={() => handleGuess("No")}
           variant={status === 'idle' ? "outline" : "secondary"}
           disabled={status === 'correct'}
        >
          No
        </Button>
      </div>

      {/* Feedback Messages */}
      {status === 'correct' && (
        <div className="p-3 bg-green-100 text-green-800 text-sm rounded-md border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
           ✅ That is correct! Well done.
        </div>
      )}
      {status === 'wrong' && (
        <div className="p-3 bg-red-100 text-red-800 text-sm rounded-md border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900">
           ❌ Not quite. Try again!
        </div>
      )}
    </div>
  );
}