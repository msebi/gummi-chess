import React from 'react';
import ReactMenuComponent from './ReactMenuComponent';
import ReactSocialsComponent from './ReactSocialsComponent';

const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' },
    { label: 'Login', href: '/login' },
];

const ReactMenuAndSocialsComponent: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="h-1/2">
                <ReactMenuComponent items={menuItems} className="justify-center h-full" />
            </div>
            <div className="h-1/2">
                <ReactSocialsComponent />
            </div>
        </div>
    )
}

export default ReactMenuAndSocialsComponent;

