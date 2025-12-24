import React, { useState, useEffect } from 'react';
import ReactVideoComponent from './ReactVideoComponent';
import ReactChessBoardComponent from './ReactChessBoardComponent';
import { SerializableCourse } from '@/pages/index'
import dynamic from 'next/dynamic';

const ReactViewCourseComponent: React.FC<{ course: SerializableCourse }> = ({ course }) => {
    // Index of the currently selected FEN from the course.keyPositions array
    const [selectedKeyPositionIndex, setSelectedKeyPositionIndex] = useState<number | null>(null);

    // State for which FEN is currently on the board
    const [boardFen, setBoardFen] = useState<string | null>('start');
    
    // State for tool tip
    const [actionTooltip, setActionTooltip] = useState<boolean | false>(false);

    const navigateKeyPosition = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (direction === 'up') {
            // Cycle selection up the list 
            setSelectedKeyPositionIndex(prev => {
                if (course.keyPositions.length === 0) 
                    return null;
                if (prev === null || prev <= 0) 
                    return course.keyPositions.length - 1;
                return prev - 1;
            });
        } else if (direction === 'down') {
            // Cycle selection down the list
            setSelectedKeyPositionIndex(prev => {
                if (course.keyPositions.length === 0) 
                    return null;
                if (prev === null || prev >= course.keyPositions.length - 1) 
                    return 0;
                return prev + 1;
            });
        } else if (direction === 'left') {
            // Reset the board to the start position
            setBoardFen('start');
        } else if (direction === 'right') {
            // Send the selected FEN to the board
            if (selectedKeyPositionIndex !== null && course.keyPositions[selectedKeyPositionIndex]) {
                setBoardFen(course.keyPositions[selectedKeyPositionIndex].fen);
            } else {
                console.warn("No FEN position selected to send to the board");
                setActionTooltip(false);
            }
        }
    };

    return (
        <div className="container mx-auto py-8">
            {/* Centered Title and Description */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-gray-600 mt-2">{course.description}</p>
            </div>

            {/* Side-by-side Video and Chessboard */}
            <div className="flex flex-wrap md:flex-nowrap gap-8">
                <div className="w-full md:w-1/2">
                    <ReactVideoComponent 
                        videoUrl={course.videoUrl} 
                        tags={course.tags} 
                        keyPositions={course.keyPositions}    
                        // Pass the current index down for highlighting
                        selectedPositionIndex={selectedKeyPositionIndex}
                        // Pass the setter function for direct clicks on the list
                        onSelectPosition={setSelectedKeyPositionIndex}                        
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <ReactChessBoardComponent 
                        initialFen={boardFen || 'start'}
                        // Pass the navigation handler down to the pad
                        onFenNavigate={navigateKeyPosition}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReactViewCourseComponent;


