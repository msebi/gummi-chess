import React from 'react';
import ReactLogoComponent from './icons/ReactLogoComponent';
// import type { IconType } from '@/node_modules/react-icons/lib/index';
import type { IconType } from 'react-icons';

export interface Social {
    platform: string;
    url: string;
    iconUrl: string;
}

const ReactSocialEntryComponent: React.FC<Social> = ({platform, url, iconUrl}) => {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-center hover:opacity-75">
            <ReactLogoComponent 
                logoUrl={iconUrl} 
                className="h-12 w-12 mx-auto" 
                alignment="justify-center items-center" 
                width={50}
                height={50}
                />
            <span className="text-sm font-medium">{platform}</span>
        </a>
    )
}

export default ReactSocialEntryComponent;

