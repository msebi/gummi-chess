import React from 'react';

// Define directions for type safety
type DpadDirection = 'up' | 'down' | 'left' | 'right';

// Define the component's props
type DpadProps = {
    onButtonClick: (direction: DpadDirection) => void;
    className?: string; 
};

// A single, reusable button component for our D-pad
const DpadButton = ({
    direction,
    shape,
    onClick,
}: {
    direction: DpadDirection;
    shape: React.ReactNode;
    onClick: () => void;
}) => {
    const roundedClasses = {
        up: 'rounded-t-lg',
        down: 'rounded-b-lg',
        left: 'rounded-l-lg',
        right: 'rounded-r-lg',
    };

    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center justify-center
                w-12 h-12 
                bg-gray-700 bg-gradient-to-b from-gray-600 to-gray-800 
                border-b-4 border-black 
                text-gray-300 
                transition-all duration-100 
                hover:brightness-125
                active:border-b-0 active:translate-y-1 active:brightness-90
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-400 
                ${roundedClasses[direction]}    
            `}
            aria-label={`Direction ${direction}`}
        >
            {shape}
        </button>
    );
};

export const Dpad: React.FC<DpadProps> = ({ onButtonClick, className = ''}) => {
    // SVG paths for the arrows 
    const arrowUp = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>;
    const arrowDown = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>;
    const arrowLeft = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 7l-5 5 5 5z"/></svg>;
    const arrowRight = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5z"/></svg>;

    return (
        <div className={`grid grid-cols-3 grid-rows-3 w-48 h-48 gap-1 ${className}`}>
            {/* Empty corner cells */}
            <div className="col-start-1 row-start-1"></div>
            <div className="col-start-3 row-start-1"></div>
            <div className="col-start-1 row-start-3"></div>
            <div className="col-start-3 row-start-3"></div>

            {/* Center piece */}
            {/* <div className="bg-gray-700"></div> */}

            {/* Directional Buttons */}
            <div className="col-start-2 row-start-1">
                <DpadButton direction="up" shape={arrowUp} onClick={() => onButtonClick('up')} />
            </div>
            <div className="col-start-1 row-start-2">
                <DpadButton direction="left" shape={arrowLeft} onClick={() => onButtonClick('left')} />
            </div>        
            <div className="col-start-3 row-start-2">
                <DpadButton direction="right" shape={arrowRight} onClick={() => onButtonClick('right')} />
            </div>
            <div className="col-start-2 row-start-3">
                <DpadButton direction="down" shape={arrowDown} onClick={() => onButtonClick('down')} />
            </div>
        </div>
    );
};

export const LeftRightPad: React.FC<DpadProps> = ({ onButtonClick, className = ''}) => {
    // SVG paths for the arrows 
    const arrowLeft = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 7l-5 5 5 5z"/></svg>;
    const arrowRight = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5z"/></svg>;

    return (
        <div className={`grid grid-cols-3 grid-rows-1 w-48 h-48 ${className}`}>
            {/* Empty corner cells */}
            <div className="col-start-1 row-start-1"></div>
            <div className="col-start-3 row-start-1"></div>

            {/* Center piece */}
            {/* <div className="bg-gray-700"></div> */}

            {/* Directional Buttons */}
            <div className="col-start-1 row-start-1">
                <DpadButton direction="left" shape={arrowLeft} onClick={() => onButtonClick('left')} />
            </div>        
            <div className="col-start-3 row-start-1">
                <DpadButton direction="right" shape={arrowRight} onClick={() => onButtonClick('right')} />
            </div>
        </div>
    );
};

