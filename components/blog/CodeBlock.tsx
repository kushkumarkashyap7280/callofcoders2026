import React from 'react';

interface CodeBlockProps {
  language?: string;
  css?: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language = '', css = '', code }) => {
  return (
    <pre className={`rounded-md p-4 overflow-x-auto bg-zinc-900 text-white ${css}`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default CodeBlock;
