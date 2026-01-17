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

export default function MobileCompiler() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0])
  const [code, setCode] = useState<string>(DEFAULT_CODE.python)
  const [output, setOutput] = useState<string>('')
  const [stdin, setStdin] = useState<string>('')
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
          stdin: stdin,
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
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900 w-full">
      {/* Top Bar */}
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-3 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center justify-between w-full gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all"
            >
              <span className="font-heading font-medium text-sm text-zinc-800 dark:text-zinc-100">
                {selectedLanguage.name}
              </span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>

            {showLanguages && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setShowLanguages(false)}
                />
                <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
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
      </div>

      {/* Mobile Simple Layout */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Code Editor */}
        <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-700">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-heading font-semibold text-zinc-600 dark:text-zinc-400">
              Editor
            </span>
          </div>
          <div className="flex-1" style={{ height: '300px' }}>
            <CodeMirror
              value={code}
              height="300px"
              extensions={[getLanguageExtension()]}
              theme={oneDark}
              onChange={(value) => setCode(value)}
              className="text-xs"
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

        {/* Run Button */}
        <div className="p-3 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2"
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

        {/* Input Panel */}
        <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-700">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-2 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-zinc-600 dark:text-zinc-400">
              Input (stdin)
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {stdin.split('\n').filter(l => l.length > 0).length} input{stdin.split('\n').filter(l => l.length > 0).length !== 1 ? 's' : ''}
            </span>
          </div>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter your inputs here (one per line)..."
            className="flex-1 p-3 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 border-0"
            style={{ height: '120px' }}
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col flex-1">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-heading font-semibold text-zinc-600 dark:text-zinc-400">
              Output
            </span>
          </div>
          <div className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-900 overflow-y-auto" style={{ minHeight: '150px' }}>
            <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
              {output || 'Click "Run Code" to see output...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
