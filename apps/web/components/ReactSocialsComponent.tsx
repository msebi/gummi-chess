import React from 'react';
import SocialIcon from './icons/SocialIcon'
import {
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiFacebook,
} from "react-icons/fi";

const socials = [
    { platform: 'Instagram', url: 'https://instagram.com', icon: FiInstagram},
    { platform: 'YouTube', url: 'https://youtube.com', icon: FiYoutube },
    { platform: 'X.com', url: 'https://x.com', icon: FiTwitter },
    { platform: 'Facebook', url: 'https://facebook.com', icon: FiFacebook },
];

const ReactSocialsComponent: React.FC = () => {
    return (
        <div className="flex justify-center items-center gap-6 p-4">
            {socials.map(social => (
                <SocialIcon 
                    key={social.platform}
                    href={social.url}
                    IconComponent={social.icon}
                />
            ))}
        </div>
    )
}

export default ReactSocialsComponent;

