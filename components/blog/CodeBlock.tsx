'use client';

import React, { useState, useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeBlockProps {
  language?: string;
  css?: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language = '', css = '', code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageExtension = (lang: string) => {
    const langLower = lang.toLowerCase();
    switch (langLower) {
      case 'javascript':
      case 'js':
      case 'jsx':
      case 'typescript':
      case 'ts':
      case 'tsx':
        return [javascript({ jsx: true, typescript: langLower.includes('ts') })];
      case 'python':
      case 'py':
        return [python()];
      case 'java':
        return [java()];
      case 'cpp':
      case 'c++':
      case 'c':
        return [cpp()];
      default:
        return [];
    }
  };

  const extensions = useMemo(() => getLanguageExtension(language), [language]);

  return (
    <div
      className={`relative group my-4 ${css} w-full max-w-full overflow-x-auto rounded-md border border-zinc-800 bg-zinc-900`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 rounded-t-md min-w-55">
        <span className="text-xs text-zinc-400 uppercase truncate max-w-[60vw] sm:max-w-none">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto w-full min-w-55">
        <CodeMirror
          value={code}
          extensions={extensions}
          theme={oneDark}
          editable={false}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: false,
            highlightActiveLine: false,
            foldGutter: false,
          }}
          className="rounded-b-md overflow-x-auto text-xs min-w-full"
        />
      </div>
    </div>
  );
};

export default CodeBlock;
