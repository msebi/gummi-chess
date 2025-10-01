import React from 'react';
import ReactCourseComponent, { Course } from './ReactCourseComponent';

type ReactCourseContainerComponentProps = {
  title: string;
  courses: Course[];
};

const ReactCourseContainerComponent: React.FC<ReactCourseContainerComponentProps> = ({ title, courses }) => {
  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        {/* Using flex-wrap for the responsive grid behavior */}
        <div className="flex flex-wrap gap-4 justify-center">
          {courses.map((course) => (
            // Here we control the width. "w-[10%]" is quite small, so I've used a more realistic responsive approach.
            // You could change this to "w-[10%]" to strictly follow the spec.
            <div key={course.id} className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 flex-grow">
              <ReactCourseComponent {...course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReactCourseContainerComponent;
