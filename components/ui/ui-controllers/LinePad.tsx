import React from 'react';

// Define directions for type safety
export type LinePadDirection = 'up' | 'down' | 'left' | 'right';

// Define the component's props
type LinePadProps = {
    onButtonClick: (direction: LinePadDirection) => void;
    className?: string; 
};

const LinePadButton = ({
    direction,
    shape,
    onClick,
}: {
    direction: LinePadDirection;
    shape: React.ReactNode;
    onClick: () => void;
}) => {
    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center justify-center
                w-12 h-12 
                bg-gray-600 bg-gradient-to-b from-gray-500 to-gray-700 
                border-b-4 border-black 
                text-gray-300 
                transition-all duration-100 
                hover:brightness-125
                active:border-b-0 active:translate-y-1 active:brightness-90
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-blue-400 
                rounded-lg 
            `}
            aria-label={`Direction ${direction}`}
        >
            {shape}
        </button>
    );
};

export const LinePad: React.FC<LinePadProps> = ({ onButtonClick, className = ''}) => {
    // SVG paths for the arrows 
    const arrowUp = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>;
    const arrowDown = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>;
    const arrowLeft = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 7l-5 5 5 5z"/></svg>;
    const arrowRight = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5z"/></svg>;

    return (
        <div className={`grid grid-cols-4 grid-rows-1 w-48 h-48 gap-1 ${className}`}>
            {/* Empty corner cells */}
            <div className="col-start-1 row-start-1"></div>
            <div className="col-start-2 row-start-1"></div>
            <div className="col-start-3 row-start-1"></div>
            <div className="col-start-4 row-start-1"></div>

            {/* Directional Buttons all in one line to save screen space. */}
            <div className="col-start-1 row-start-1">
                <LinePadButton direction="up" shape={arrowUp} onClick={() => onButtonClick('up')} />
            </div>
            <div className="col-start-2 row-start-1">
                <LinePadButton direction="down" shape={arrowDown} onClick={() => onButtonClick('down')} />
            </div>
            <div className="col-start-3 row-start-1">
                <LinePadButton direction="left" shape={arrowLeft} onClick={() => onButtonClick('left')} />
            </div>        
            <div className="col-start-4 row-start-1">
                <LinePadButton direction="right" shape={arrowRight} onClick={() => onButtonClick('right')} />
            </div>
        </div>
    );
};

export const LeftRightPad: React.FC<LinePadProps> = ({ onButtonClick, className = ''}) => {
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
                <LinePadButton direction="left" shape={arrowLeft} onClick={() => onButtonClick('left')} />
            </div>        
            <div className="col-start-3 row-start-1">
                <LinePadButton direction="right" shape={arrowRight} onClick={() => onButtonClick('right')} />
            </div>
        </div>
    );
};

