import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import ReactHeaderComponent from 'apps/web/components/ReactHeaderComponent';
import ReactSiteDescriptionComponent from 'apps/web/components/ReactSiteDescriptionComponent';
import ReactCourseContainerComponent from 'apps/web/components/ReactCourseContainerComponent';
import ReactPreFooterComponent from 'apps/web/components/ReactPreFooterComponent';
import ReactFooterComponent from 'apps/web/components/ReactFooterComponent';
import FadeInOnScroll from 'apps/web/components/FadeInOnScroll';

import prisma from 'database';
import { Course as CourseType, KeyPosition  } from '../../../generated/prisma/client';

// Define the shape of the data passed to the component
// Including tags  
export type CourseWithRelations = CourseType & {
  tags: { tag: { id: string; name: string} }[];
  keyPositions: KeyPosition[];
};

// Create JSON-safe version of serializable data
// Omit the types that are not serializable and add them back 
// as primitives. 
export type SerializableCourse = Omit<CourseWithRelations, 'price' | 'createdAt' | 'updatedAt'> & {
  price: number;
  createdAt: string, 
  updatedAt: string 
};

// This function runs on the server at build time 
export const getStaticProps: GetStaticProps<{ courses: SerializableCourse[] }> = async () => {
  console.log("Getting courses from database...");
  const freeCourses = await prisma.course.findMany({
    where: {
      isFree: true,
    },
    include: {
      tags: {
        include: {
          tag: true,
        }
      },
      keyPositions: true
    },
  });
  console.log(`Got ${freeCourses.length} free courses from db.`);

  // Prisma's Decimal type is not serializable to JSON by default. 
  // It needs to be converted to a string or number before passing it 
  // as a prop.
  const serializableCourses = freeCourses.map(course => ({
    ...course,
    price: course.price.toNumber(), 
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  }));

  return {
    props: {
      courses: serializableCourses,
    },
    // Optional: regenerate the page periodically to pick up new courses 
    revalidate: 60, // seconds
  };
};

export default function HomePage({ courses }: InferGetStaticPropsType<typeof getStaticProps>) {
  // Props adapted to ReactCourseContainerComponent 
  const courseProps = courses.map(course => ({
    id: course.id,
    title: course.title,
    imageUrl: course.thumbnailUrl,
    tags: course.tags.map(t => t.tag.name),
  }));

  return (
    <div className="bg-white">
      <ReactHeaderComponent />
      <main>
        <FadeInOnScroll>
          <ReactSiteDescriptionComponent />
        </FadeInOnScroll>

        <FadeInOnScroll>
          <ReactCourseContainerComponent title="Courses" courses={courseProps} />
        </FadeInOnScroll>

        <FadeInOnScroll>
          <ReactPreFooterComponent />
        </FadeInOnScroll>
      </main>
      <ReactFooterComponent />
    </div>
  );
}