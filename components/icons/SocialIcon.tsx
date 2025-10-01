import React from 'react';

type SocialIconProps = {
    href: string;
    IconComponent: React.ElementType;
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, IconComponent }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
        >
            {/* Render the passed in icon */}
            <IconComponent size={36} />
        </a>
    );
};

export default SocialIcon;
