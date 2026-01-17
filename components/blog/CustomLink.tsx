import React from 'react';

interface CustomLinkProps {
  href: string;
  color?: string;
  children: React.ReactNode;
  css?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, color = 'blue', children, css = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`underline hover:opacity-80 transition-colors ${css}`}
    style={{ color }}
  >
    {children}
  </a>
);

export default CustomLink;
