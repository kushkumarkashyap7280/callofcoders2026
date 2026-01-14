'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Play, Loader2, ChevronDown } from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'

interface Language {
  id: string
  name: string
  version: string
  extensions: string[]
}

const LANGUAGES: Language[] = [
  { id: 'python', name: 'Python', version: '3.10.0', extensions: ['.py'] },
  { id: 'javascript', name: 'JavaScript', version: '18.15.0', extensions: ['.js'] },
  { id: 'typescript', name: 'TypeScript', version: '5.0.3', extensions: ['.ts'] },
  { id: 'java', name: 'Java', version: '15.0.2', extensions: ['.java'] },
  { id: 'cpp', name: 'C++', version: '10.2.0', extensions: ['.cpp'] },
  { id: 'c', name: 'C', version: '10.2.0', extensions: ['.c'] },
  { id: 'rust', name: 'Rust', version: '1.68.2', extensions: ['.rs'] },
  { id: 'go', name: 'Go', version: '1.16.2', extensions: ['.go'] },
  { id: 'php', name: 'PHP', version: '8.2.3', extensions: ['.php'] },
  { id: 'ruby', name: 'Ruby', version: '3.0.1', extensions: ['.rb'] },
]

const DEFAULT_CODE: Record<string, string> = {
  python: `# Python code
print("Hello, World!")

def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`,
  javascript: `// JavaScript code
console.log("Hello, World!");

function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,
  typescript: `// TypeScript code
console.log("Hello, World!");

function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println(greet("Developer"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
  cpp: `#include <iostream>
#include <string>

std::string greet(std::string name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::cout << greet("Developer") << std::endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Hello, Developer!\\n");
    return 0;
}`,
  rust: `fn main() {
    println!("Hello, World!");
    println!("{}", greet("Developer"));
}

fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}`,
  go: `package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Println(greet("Developer"))
}`,
  php: `<?php
echo "Hello, World!\\n";

function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("Developer");
?>`,
  ruby: `puts "Hello, World!"

def greet(name)
    "Hello, #{name}!"
end

puts greet("Developer")`,
}

export default function Compiler() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0])
  const [code, setCode] = useState<string>(DEFAULT_CODE.python)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)

  // Get CodeMirror language extension based on selected language
  const getLanguageExtension = () => {
    switch (selectedLanguage.id) {
      case 'python':
        return python()
      case 'javascript':
      case 'typescript':
        return javascript({ typescript: selectedLanguage.id === 'typescript' })
      case 'java':
        return java()
      case 'cpp':
      case 'c':
        return cpp()
      default:
        return javascript()
    }
  }

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    setCode(DEFAULT_CODE[language.id] || '')
    setOutput('')
    setShowLanguages(false)
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...')

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage.id,
          version: selectedLanguage.version,
          files: [
            {
              name: `main${selectedLanguage.extensions[0]}`,
              content: code,
            },
          ],
        }),
      })

      const data = await response.json()

      if (data.run) {
        const output = data.run.stdout || data.run.stderr || 'No output'
        setOutput(output)
      } else {
        setOutput('Error: Unable to execute code')
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to run code'}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Left Sidebar - Language Selection */}
      <div className="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Code Compiler
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Select a language
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {LANGUAGES.map((language) => (
              <button
                key={language.id}
                onClick={() => handleLanguageChange(language)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedLanguage.id === language.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                }`}
              >
                <div className="font-medium">{language.name}</div>
                <div className="text-xs opacity-75 mt-1">v{language.version}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Powered by Piston API
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all"
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-100">
                  {selectedLanguage.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showLanguages && (
                <div className="absolute top-full mt-2 left-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-10 min-w-50 max-h-64 overflow-y-auto">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.id}
                      onClick={() => handleLanguageChange(language)}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Code
              </>
            )}
          </Button>
        </div>

        {/* Code Editor and Output */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-700">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Editor
              </span>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeMirror
                value={code}
                height="100%"
                extensions={[getLanguageExtension()]}
                theme={oneDark}
                onChange={(value) => setCode(value)}
                className="h-full text-sm"
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
                  crosshairCursor: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                  closeBracketsKeymap: true,
                  searchKeymap: true,
                  foldKeymap: true,
                  completionKeymap: true,
                  lintKeymap: true,
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col lg:max-w-[50%]">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Output
              </span>
            </div>
            <div className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-900 overflow-y-auto">
              <pre className="text-sm font-mono text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap">
                {output || 'Click "Run Code" to see output...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
