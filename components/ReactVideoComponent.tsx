import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { KeyPosition } from '../generated/prisma/client';
import { LeftRightPad } from './ui/Dpad';
import ActionTooltip from './ui/ActionTooltip';

type ReactVideoComponentProps = {
    videoUrl: string;
    tags: { tag: { name: string } }[];
    keyPositions: KeyPosition[];
    onSetFen: (fen: string | null) => void; // Function from parent
};

const ReactVideoComponent: React.FC<ReactVideoComponentProps> = ({ 
    videoUrl, 
    tags, 
    keyPositions, 
    onSetFen 
}) => {
    const [selectedFen, setSelectedFen] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleSendFen = () => {
        if (!selectedFen) {
            setShowTooltip(true);
            return;
        }
        setShowTooltip(false);
        onSetFen(selectedFen);
    };

    const handleClearFen = () => {
        onSetFen('start'); // Pass null to clear
        // setSelectedFen(null);
        setShowTooltip(false);
    };

    const getYouTubeId = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('v');
        } catch (error) {
            console.log("Invalid URL: ", error);
            return null;
        }
    };

    const videoId = getYouTubeId(videoUrl);

    const options = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    const handleLeftRightClick = (direction: string) => {
        console.log('LeftRight button pressed: ${direction}');
        switch (direction) {
            case 'left': 
                handleClearFen();
                return;
            case 'right':
                handleSendFen();
                return;
            default:
                console.log(`Invalid direction when LeftRight button clicked. Direction: ${direction}`);
        }
    };

    return (
        // YouTube player
        <div className="p-4">
            {videoId ? <YouTube videoId={videoId} opts={options} /> : <p>Invalid video URL.</p>}
            <div className="mt-4">
                {tags.map(( { tag } ) => (
                    <span key={tag.name} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold
                    text-gray-700 mr-2 mb-2">
                        #{tag.name}
                    </span>
                ))}
            </div>
            {/*FEN string list */}
            <div className="mt-4">
                <h3 className="font-bold text-lg mb-2">Key Positions in Video</h3>
                {/* TODO: edit styles */}
                <div className="border rounded-md bg-white">
                    {keyPositions.map((pos) => (
                        <div
                            key={pos.id}
                            onClick={() => {
                                setSelectedFen(pos.fen)
                                setShowTooltip(false);
                            }}
                            className={`p-2 cursor-pointer border-b last:border-b-0 hover:bg-gray-100 
                                ${selectedFen === pos.fen ? 'bg-blue-100' : ''}`}
                        >
                            <p className="text-sm font-mono truncate">{pos.fen}</p>
                            {pos.description && 
                                <p className="text-xs text-gray-500">
                                    {pos.description}    
                                </p>}
                        </div>
                    ))}
                </div>
                <div className="relative flex justify-center items-center mt-2 gap-4">
                    {/* Parent div needs to be relative to the position of the tooltip */}
                    <ActionTooltip isOpen={showTooltip} onClose={() => setShowTooltip(false)}>
                        Please select a FEN string from the list above before sending it to the board. 
                    </ActionTooltip>
                    <LeftRightPad onButtonClick={handleLeftRightClick} />                    
                </div>
            </div>

        </div>        
    );
};

export default ReactVideoComponent;






