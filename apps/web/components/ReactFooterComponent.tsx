import React from 'react';
import ReactLogoComponent from './icons/ReactLogoComponent';
import ReactMenuAndSocialsComponent from './ReactMenuAndSocialsComponent';

const ReactFooterComponent: React.FC = () => {
    return (
        <footer className="w-full bg-gray-800 text-white py-8">
            <div className="container mx-auto flex items-center">
                <div className="w-[30%]">
                    <ReactLogoComponent alignment="justify-center items-center"/>
                </div>
                <div className="w-[70%]">
                    <ReactMenuAndSocialsComponent />
                </div>
            </div>
        </footer>
    );
};

export default ReactFooterComponent;

