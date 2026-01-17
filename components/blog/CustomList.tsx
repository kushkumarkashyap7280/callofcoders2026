import React from 'react';

interface CustomListProps {
  heading?: string;
  items: string[];
  ordered?: boolean;
  css?: string;
  headingTag?: keyof JSX.IntrinsicElements;
  listStyle?: 'none' | 'default';
}

const CustomList: React.FC<CustomListProps> = ({
  heading,
  items,
  ordered = false,
  css = '',
  headingTag = 'h3',
  listStyle = 'default',
}) => {
  const HeadingTag = headingTag;
  const listClass = listStyle === 'none' ? 'list-none' : ordered ? 'list-decimal' : 'list-disc';

  return (
    <div className={css}>
      {heading && <HeadingTag className="mb-2 font-semibold">{heading}</HeadingTag>}
      {ordered ? (
        <ol className={listClass + ' ml-6'}>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className={listClass + ' ml-6'}>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomList;
