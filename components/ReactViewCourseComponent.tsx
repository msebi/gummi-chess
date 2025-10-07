import React, { useState, useEffect } from 'react';
import ReactVideoComponent from './ReactVideoComponent';
import ReactChessBoardComponent from './ReactChessBoardComponent';
import { SerializableCourse } from '@/pages/index'
import dynamic from 'next/dynamic';

const ReactViewCourseComponent: React.FC<{ course: SerializableCourse }> = ({ course }) => {
    // Index of the currently selected FEN from the course.keyPositions array
    const [currentKeyPositionIndex, setCurrentKeyPositionIndex] = useState<number | null>(null);

    // Lift up the FEN string so that it can be passed down to child components
    const [activeFen, setActiveFen] = useState<string | null>('start');
    
    // Update the active FEN whenever the index changes
    useEffect(() => {
        if (currentKeyPositionIndex !== null && course.keyPositions[currentKeyPositionIndex]) {
            setActiveFen(course.keyPositions[currentKeyPositionIndex].fen)
        } else {
            setActiveFen('start');
        }
    }, [currentKeyPositionIndex, course.keyPositions]);

    const navigateKeyPosition = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (course.keyPositions.length === 0)
            return;
        
        if (direction === 'up') {
            setCurrentKeyPositionIndex(prev => {
                if (prev === null || prev <= 0) 
                    return course.keyPositions.length - 1;
                return prev - 1;
            });
        } else if (direction === 'down') {
            setCurrentKeyPositionIndex(prev => {
                if (prev === null || prev >= course.keyPositions.length - 1)
                    return 0;
                return prev + 1;
            });
        }
        // TODO: left and right move the fen string to the chess board component
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
                        activePositionIndex={currentKeyPositionIndex}
                        // Pass the setter function for direct clicks on the list
                        onSelectPosition={setCurrentKeyPositionIndex}
                        onSetFen={setActiveFen}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <ReactChessBoardComponent 
                        initialFen={activeFen || 'start'}
                        // Pass the navigation handler down to the pad
                        onFenNavigate={navigateKeyPosition}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReactViewCourseComponent;


