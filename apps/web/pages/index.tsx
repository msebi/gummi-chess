import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactSiteDescriptionComponent from '@/components/ReactSiteDescriptionComponent';
import ReactCourseContainerComponent from '@/components/ReactCourseContainerComponent';
import ReactPreFooterComponent from '@/components/ReactPreFooterComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
import FadeInOnScroll from '@/components/FadeInOnScroll';

import prisma from 'database';

import { SerializableCourse, CourseWithRelations } from '@/types/index';

// This function runs on the server at build time 
export const getStaticProps: GetStaticProps<{ courses: SerializableCourse[] }> = async () => {
  console.log("Getting courses from database...");
  const freeCourses : CourseWithRelations[] = await prisma.course.findMany({
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