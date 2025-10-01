import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface Course {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
}

const ReactCourseComponent: React.FC<Course> = ({ id, imageUrl, title, tags }) => {
  return (
    // Wrap the whole card in a Link component
    <Link href={`/courses/${id}`}>
      <div className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full">
        {/* This container is still needed for the image to fill correctly */}
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt={`Course image for ${title}`}
            fill // <-- New prop
            className="object-cover" // <-- New className
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
        </div>
        <div className="px-4 pb-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ReactCourseComponent;