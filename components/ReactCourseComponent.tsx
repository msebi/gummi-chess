import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface Course {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
  isClickable?: boolean; 
}

const ReactCourseComponent: React.FC<Course> = ({ id, imageUrl, title, tags, isClickable = true }) => {
  const cardContent = (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-40">
        <Image
          src={imageUrl}
          alt={`Course image for ${title}`}
          fill 
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
      </div>
      <div className="px-4 pb-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold
                                   text-gray-700 mr-2 mb-2">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );

  // Card is wrapped conditionally with a Link
  return isClickable ? (    
    <Link href={`/courses/${id}`} passHref>
      <a className="block h-full">{cardContent}</a>
    </Link>
  ) : (
    <div className="h-full">{cardContent}</div>
  );
};

export default ReactCourseComponent;