// components/CodeBlock.tsx
'use client'; // 👈 Crucial: Needs browser APIs

import { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react'; // Assuming you might have lucide-react from shadcn, otherwise use text

export default function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    if (!preRef.current) return;

    // Extract text content from the <pre> element
    const codeText = preRef.current.textContent || '';

    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden bg-zinc-950 dark:bg-zinc-900 border border-zinc-800">
      {/* Top bar with language hint (optional) and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
         {/* You could extract language from props.className here if needed, e.g., "language-js" */}
        <span className="text-xs text-zinc-400 font-mono">Code</span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700"
          aria-label="Copy code"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-zinc-400" />
          )}
        </button>
      </div>
      
      {/* The actual code display area */}
      {/* We attach the ref here to grab text content easily */}
      <pre ref={preRef} {...props} className="p-4 overflow-x-auto text-sm text-zinc-50 font-mono leading-relaxed">
        {children}
      </pre>
    </div>
  );
}