import React from 'react';

type ReactDescriptionComponentProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const ReactDescriptionComponent: React.FC<ReactDescriptionComponentProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`p-8 bg-white ${className}`}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
};

export default ReactDescriptionComponent;

