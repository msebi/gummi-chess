import React from 'react';

type ActionTooltipProps = {
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
    className?: string;
};

const ActionTooltip: React.FC<ActionTooltipProps> = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={`absolute bottom-full mb-2 w-64 left-1/2 -translate-x-1/2 ${className}`}>
            <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-300 hover:text-gray-700"
                    aria-lable="Close tooltip"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>

                {/* Tooltip Content */}
                <div className="text-sm text-gray-600">
                    {children}
                </div>

                {/* Caret */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 -mb-2">
                    <div className="w-4 h-4 bg-white border-r border-b border-gray-300 transform rotate-45"></div>
                </div>              
            </div>
        </div>
    );
};

export default ActionTooltip;