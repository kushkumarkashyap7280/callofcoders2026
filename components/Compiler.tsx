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
import { LANGUAGES, DEFAULT_CODE, type Language } from '@/constants'

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
    <div className="flex flex-col lg:flex-row min-h-screen h-auto lg:h-screen bg-zinc-50 dark:bg-zinc-900 w-full overflow-x-hidden">
      {/* Left Sidebar - Language Selection - Hidden on mobile */}
      <div className="hidden lg:flex w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-heading font-bold text-zinc-800 dark:text-zinc-100">
            Code Compiler
          </h2>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
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
                <div className="font-heading font-medium">{language.name}</div>
                <div className="text-xs font-medium opacity-75 mt-1">v{language.version}</div>
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
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center justify-between w-full gap-2 px-3 sm:px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all"
              >
                <span className="font-heading font-medium text-sm sm:text-base text-zinc-800 dark:text-zinc-100">
                  {selectedLanguage.name}
                </span>
                <ChevronDown className="w-4 h-4 shrink-0" />
              </button>

              {showLanguages && (
                <>
                  {/* Mobile overlay */}
                  <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setShowLanguages(false)}
                  />
                  <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 sm:min-w-62.5 max-h-75 sm:max-h-64 overflow-y-auto">
                    {LANGUAGES.map((language) => (
                      <button
                        key={language.id}
                        onClick={() => handleLanguageChange(language)}
                        className={`w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all border-b border-zinc-100 dark:border-zinc-700 last:border-b-0 ${
                          selectedLanguage.id === language.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                        }`}
                      >
                        <div className="font-heading font-medium">{language.name}</div>
                        <div className="text-xs font-medium opacity-75 mt-0.5">v{language.version}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
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
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-75 sm:min-h-100 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-700">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-3 sm:px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-xs sm:text-sm font-heading font-semibold text-zinc-600 dark:text-zinc-400">
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
                className="h-full text-xs sm:text-sm"
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
          <div className="flex-1 flex flex-col min-h-62.5 sm:min-h-75">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-3 sm:px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-xs sm:text-sm font-heading font-semibold text-zinc-600 dark:text-zinc-400">
                Output
              </span>
            </div>
            <div className="flex-1 p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900 overflow-y-auto">
              <pre className="text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
                {output || 'Click "Run Code" to see output...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
