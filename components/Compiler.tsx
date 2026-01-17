'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Play, Loader2, ChevronDown, Code2, Terminal, Eye } from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { LANGUAGES, DEFAULT_CODE, type Language } from '@/constants'
import { Panel, Group, Separator } from 'react-resizable-panels'

export default function Compiler() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0])
  const [code, setCode] = useState<string>(DEFAULT_CODE.python)
  const [output, setOutput] = useState<string>('')
  const [stdin, setStdin] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  
  // Panel visibility states
  const [showEditor, setShowEditor] = useState(true)
  const [showInput, setShowInput] = useState(true)
  const [showOutput, setShowOutput] = useState(true)

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
    <div className="flex flex-col min-h-screen h-auto lg:h-screen bg-zinc-50 dark:bg-zinc-900 w-full overflow-x-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">{/* Top Bar */}
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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Panel Toggle Buttons - Only visible on tablets and larger */}
            <div className="hidden md:flex items-center gap-1 border border-zinc-300 dark:border-zinc-600 rounded-lg p-1">
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`px-2 sm:px-2 py-1 rounded text-xs font-medium transition-all touch-manipulation ${
                  showEditor
                    ? 'bg-blue-500 text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
                title="Toggle Editor"
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowInput(!showInput)}
                className={`px-2 sm:px-2 py-1 rounded text-xs font-medium transition-all touch-manipulation ${
                  showInput
                    ? 'bg-blue-500 text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
                title="Toggle Input"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowOutput(!showOutput)}
                className={`px-2 sm:px-2 py-1 rounded text-xs font-medium transition-all touch-manipulation ${
                  showOutput
                    ? 'bg-blue-500 text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
                title="Toggle Output"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
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
        </div>

        {/* Code Editor, Input and Output */}
        <div className="flex-1 overflow-hidden w-full">
          {/* Tablet/Desktop: Resizable panels */}
          <Group orientation="horizontal" className="h-full">{/* Code Editor */}
            {showEditor && (
              <>
                <Panel defaultSize={40} minSize={20} className="flex flex-col">
                  <div className="flex-1 flex flex-col h-full border-r border-zinc-200 dark:border-zinc-700">
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
              </Panel>
              <Separator className="w-1 bg-zinc-300 dark:bg-zinc-600 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors cursor-col-resize" />
            </>
            )}

            {/* Input and Output Container */}
            <Panel defaultSize={60} minSize={20} className="flex flex-col">
              <Group orientation="vertical" className="h-full">
                {/* Input Panel */}
                {showInput && (
                  <>
                    <Panel defaultSize={50} minSize={15} className="flex flex-col">
                      <div className="flex-1 flex flex-col h-full border-b border-zinc-200 dark:border-zinc-700">
                        <div className="bg-zinc-100 dark:bg-zinc-800 px-3 sm:px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-heading font-semibold text-zinc-600 dark:text-zinc-400">
                            Input (stdin)
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-500">
                            {stdin.split('\n').filter(l => l.length > 0).length} input{stdin.split('\n').filter(l => l.length > 0).length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <textarea
                          value={stdin}
                          onChange={(e) => setStdin(e.target.value)}
                          placeholder="Enter your inputs here...\n(each line will be a separate input)\n\nExample for Python input():&nbsp;\nJohn\n25"
                          className="flex-1 p-3 sm:p-4 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 border-0"
                        />
                      </div>
                    </Panel>
                    <Separator className="h-1 bg-zinc-300 dark:bg-zinc-600 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors cursor-row-resize" />
                  </>
                )}

                {/* Output Panel */}
                {showOutput && (
                  <Panel defaultSize={50} minSize={15} className="flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
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
                  </Panel>
                )}
              </Group>
            </Panel>
          </Group>
        </div>
      </div>
    </div>
  )
}
