'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeRunnerProps {
  language: string;
  code: string;
}

export default function CodeRunner({ language, code }: CodeRunnerProps) {
  const [editableCode, setEditableCode] = useState(code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const extensions = useMemo(() => {
    const langMap: Record<string, any> = {
      javascript: javascript({ jsx: true }),
      typescript: javascript({ typescript: true }),
      python: python(),
      java: java(),
      cpp: cpp(),
      c: cpp(),
    };
    return [langMap[language.toLowerCase()] || javascript()];
  }, [language]);

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          version: '*', // Use latest version
          files: [
            {
              content: editableCode
            }
          ]
        })
      });

      const result = await response.json();
      
      if (result.run) {
        setOutput(result.run.output || result.run.stderr || 'No output');
      } else {
        setError('Failed to execute code');
      }
    } catch (err) {
      setError('Error running code: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editableCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy code');
    }
  };

  const resetCode = () => {
    setEditableCode(code);
    setOutput('');
    setError('');
  };

  return (
    <div className="my-4 border rounded-lg overflow-hidden">
      <div className="relative">
        <CodeMirror
          value={editableCode}
          onChange={(value) => setEditableCode(value)}
          extensions={extensions}
          theme={oneDark}
          minHeight="200px"
          className="text-sm"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
          {editableCode !== code && (
            <button
              onClick={resetCode}
              className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              title="Reset to original code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <Button 
          onClick={runCode} 
          disabled={isRunning}
          className="mb-3"
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>

        {output && (
          <div className="mt-3">
            <div className="text-sm font-semibold mb-1">Output:</div>
            <pre className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto">
              {output}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-3">
            <div className="text-sm font-semibold mb-1 text-red-600">Error:</div>
            <pre className="bg-red-50 text-red-800 p-3 rounded text-sm overflow-x-auto">
              {error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
