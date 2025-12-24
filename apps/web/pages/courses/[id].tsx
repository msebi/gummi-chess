import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import prisma from 'database';
import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactViewCourseComponent from '@/components/ReactViewCourseComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
// import { SerializableCourse } from '@/pages/index';
import { Course as CourseType, KeyPosition } from '../../../../generated/prisma/client';

// TODO: verify/adjust
export type CourseWithRelations = CourseType & {
    tags: { tag: { id: string; name: string } }[];
    keyPositions: KeyPosition[];
};

export type SerializableCourse = Omit<CourseWithRelations, 'price' | 'createdAt' | 'updatedAt'> & {
    price: number;
    createdAt: string;
    updatedAt: string;
};

// Step 1: Tell next.js which course pages to pre-render at build time
export const getStaticPaths: GetStaticPaths = async () => {
    const courses = await prisma.course.findMany({
        select: { id: true }, // Only fetch the IDs
    });

    const paths = courses.map((course) => ({
        params: { id: course.id },
    }));

    return { paths, fallback: 'blocking'}; // fallback 'blocking' handles courses created after build
};

// Step 2: Fetch data for a specific course page
export const getStaticProps: GetStaticProps<{ course: SerializableCourse }, { id: string }> = async (context) => {
    const courseId = context.params?.id; 

    if (!courseId) {
        // TODO: define cusom messages for error codes
        return { notFound: true }
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            tags: { include: {tag: true} },
            keyPositions: true,
        },
    });

    if (!course) {
        return { notFound: true };
    }

    // Make the data JSON-safe for props
    const serializableCourse = {
        ...course,
        price: course.price.toNumber(),
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
    };

    return {
        props: {
            course: serializableCourse, 
        },
        revalidate: 30, // Regenerate page every 30 seconds if needed
    };
};

// Step 3: Render the page with the fetched data
const CoursePage = ({ course }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div className="bg-white">
            <ReactHeaderComponent />
            <main>
                <ReactViewCourseComponent course={course}/>
            </main>
            <ReactFooterComponent />
        </div>
    );
};

export default CoursePage;