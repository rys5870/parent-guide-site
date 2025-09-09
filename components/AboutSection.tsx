import React from 'react';

interface Props {
  title?: string;
  content: string;
}

const AboutSection: React.FC<Props> = ({ title, content }) => {
  return (
    <div className="flex flex-col justify-between bg-white shadow-md rounded-2xl p-6 min-h-[250px]">
      {title && (
        <h2 className="text-xl font-semibold text-pink-700 border-b border-gray-200 pb-2 mb-4">
          {title}
        </h2>
      )}
      <p className="leading-relaxed text-gray-700 whitespace-pre-line flex-grow">
        {content}
      </p>
    </div>
  );
};

export default AboutSection;