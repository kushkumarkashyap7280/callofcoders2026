import React from 'react';

interface BlogImageProps {
  src: string;
  alt?: string;
  css?: string;
}

const BlogImage: React.FC<BlogImageProps> = ({ src, alt = '', css = '' }) => (
  <img src={src} alt={alt} className={`rounded-md my-4 mx-auto ${css}`} />
);

export default BlogImage;
