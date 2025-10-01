import React, { useState } from 'react';
import ReactVideoComponent from './ReactVideoComponent';
import ReactChessBoardComponent from './ReactChessBoardComponent';
import { SerializableCourse } from '@/pages/index'
import dynamic from 'next/dynamic';

// TODO: review
// Impor the chess board component dynamically 
const DynamicChessBoard = dynamic(() => import('./ReactChessBoardComponent'), {
    ssr: false, // This is crucial - render this component on client-side only 
    loading: () => <p>Loading Chessboard...</p> // Show a loading message
});

// This type should match the data fetched in getStaticProps
type CourseData = {
    title: string,
    description: string,
    videoUrl: string, 
    tags: { tag: { name: string } }[];
};

const ReactViewCourseComponent: React.FC<{ course: SerializableCourse }> = ({ course }) => {
    // Lift up the FEN string so that it can be passed down to child components
    const [activeFen, setActiveFen] = useState<string | null>('start');
    
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
                        onSetFen={setActiveFen}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <ReactChessBoardComponent 
                        initialFen={activeFen || 'start'}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReactViewCourseComponent;


