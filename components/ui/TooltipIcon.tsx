import React from 'react';

type TooltipIconProps = {
    tooltipText: string;
};

const TooltipIcon: React.FC<TooltipIconProps> = ({ tooltipText }) => {
    return (
        <div className="group relative flex justify-center">
            <span className="h-5 w-5 flex items-center justify-center 
                rounded-full border border-gray-400 text-gray-500 text-xs font-bold cursor-help">
                    ?
            </span>
            {/* Tooltip bubble */}
            <div className="absolute bottom-full mb-2 w-48 scale-0 
                transition-all rounded bg-gray-700 p-2 text-xs 
                text-white group-hover:scale-100 group-focus:scale-100">
                {tooltipText}
            </div>
        </div>
    );
};

export default TooltipIcon;


