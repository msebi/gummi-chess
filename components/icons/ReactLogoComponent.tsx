import React from 'react';
import Image, { StaticImageData } from 'next/image';

// Import the SVG file directly. The path is relative to the current file.
// We are in /components, so we go up one level to the root with '../'
import defaultLogo from '../../images/chess_pieces/pawn_black.svg';

type ReactLogoComponentProps = {
  className?: string;
  alignment?: string;
  // The type can now be a string OR a static import
  logoUrl?: string | StaticImageData; 
  width?: number;
  height?: number;
};

const ReactLogoComponent: React.FC<ReactLogoComponentProps> = ({
  className = '',
  alignment = 'justify-start items-center',
  logoUrl = defaultLogo,
  width = 150,
  height,
}) => {
  return (
    <div className={`flex p-4 ${alignment} ${className}`} 
        style={{height: height ? `${height}px` : 'auto'}}>
      <Image
        // TODO: don't forget to replace 
        src={logoUrl}
        alt="Gummi Chess"
        width={width}
        height={height}
        className="max-h-full max-w-full object-contain" // Ensures the image scales correctly within its container
      />
    </div>
  );
};

export default ReactLogoComponent;