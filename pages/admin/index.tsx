import { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
import { ReactAdminCourseComponentContainer } from '@/components/admin/ReactAdminCourseComponentContainer';
import { ReactCreateCourseComponent } from '@/components/admin/ReactCreateCourseComponent';

// This is the main type for our course data throughout the admin panel
import { type SerializableCourse } from '@/pages/index';

type AdminView = 'list-courses' | 'manage-users' | 'create-course' | 'edit-course';

const AdminPage = ({ course, totalPages }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [view, setView] = useState<AdminView>('list-courses');
    const [courseToEdit, setCourseToEdit] = useState<SerializableCourse | null>(null);

    const handleEdit = (course: SerializableCourse) => {
        setCourseToEdit(course);
        setView('edit-course');
    };

    const handleCancel = () => {
        setCourseToEdit(null);
        setView('list-courses');
    };

    // This function would be called by the form after a successful save
    const handleSave = () => {
        // TODO: change to fetch changes
        // In a real app, you'd use a data fetching library like SWR or React Query to re-fetch
        // For now, a simple page reload is the easiest way.
        window.location.reload;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <ReactHeaderComponent />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">
                    Administration 
                </h1>
                {/* Placeholder for ReactAdministrationMenuComponent */}
                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setView('list-courses')}
                        className={`py-2 px-4 ${view.includes('course') ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    >
                        Manage Courses
                    </button>
                    <button
                        className="py-2 px-4 text-gray-500 cursor-not-allowed" // Manage Users is not implemented yet
                    >
                        Manage Users
                    </button>
                </div>

                {/* Conditional Rendering of Views */}
                {view === 'list-courses' && (
                    <ReactAdminCourseComponentContainer 
                        courses={course}
                        totalPages={totalPages}
                        onAdd={() => setView('create-course')}
                        onEdit={handleEdit}
                        onDeleteSuccess={handleSave} // Reload data after delete
                    />
                )}

                {view === 'create-course' && (
                    <ReactCreateCourseComponent
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}

                {view === 'edit-course' && courseToEdit && (
                    <ReactCreateCourseComponent 
                        initialData={courseToEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )} 

            </main>
            <ReactFooterComponent />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    // 1. Auth Check
    if (!session || !session.user?.isAdmin) {
        return {
            redirect: {
                destination: '/api/auth/signin', // Or a custom unauthorized page
                permanent: false,
            }
        };
    }

    // 2. Data Fetching & Pagination 
    const page = context.query.page ? parseInt(context.query.page as string, 10) : 1;
    const pageSize = 10; // Show 10 courses per page

    const courses = await prisma.course.findMany({
        skip: (page - 1) * pageSize, 
        take: pageSize, 
        orderBy: { createdAt: 'desc'},
        include: { tags: { include: {tag: true} }, keyPositions: true },
    });

    const totalCourses = await prisma.course.count();

    // 3. Serialize Data
    const serializableCourses = courses.map((course) => ({
        ...course,
        price: course.price.toNumber(),
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
    }));

    return {
        props: {
            courses:  serializableCourses,
            totalPages: Math.ceil(totalCourses / pageSize),
        },
    };
};

export default AdminPage;


