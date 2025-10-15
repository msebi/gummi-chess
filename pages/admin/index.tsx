import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
import { ReactAdminCourseComponentGridContainer } from '@/components/admin/ReactAdminCourseComponentGridContainer';
import { ReactAdminCreateCourseComponent } from '@/components/admin/ReactAdminCreateCourseComponent';
import { ReactAdminUserListComponent } from '@/components/admin/ReactAdminUserListComponent';

import { SerializableCourse, SerializableUser } from '@/types/index';

type AdminView = 'list-courses' | 'manage-users' | 'create-course' | 'edit-course' | 'courses' | 'users';

type AdminPageProps = {
    view: AdminView;
    courses?: SerializableCourse[];
    users?: SerializableUser[];
    totalPages: number;
    currentPage: number;
};

const AdminPage = ({ view: initialView, courses, users, totalPages, currentPage }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [view, setView] = useState<AdminView>(initialView);
    const [courseToEdit, setCourseToEdit] = useState<SerializableCourse | null>(null);
    const router = useRouter();

    const handleTabChange = (tab: 'courses' | 'users') => {
        router.push(`/admin?tab=${tab}`);
    };

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
        window.location.reload();
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
                        onClick={() => handleTabChange('courses')}
                        className={`py-2 px-4 ${initialView === 'courses' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    >
                        Manage Courses
                    </button>
                    <button
                        onClick={() => handleTabChange('users')}
                        className={`py-2 px-4 ${initialView === 'users' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    >
                        Manage Users
                    </button>
                </div>

                {/* Conditional Rendering of Views */}
                {initialView === 'courses' && courses && (
                    <ReactAdminCourseComponentGridContainer
                        courses={courses}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onAdd={() => setView('create-course')}
                        onEdit={handleEdit}
                        onDeleteSuccess={handleSave} // Reload data after delete
                    />
                )}

                {initialView === 'users' && users && (
                    <ReactAdminUserListComponent users={users} />
                    // TODO: add pagination
                )}

                {view === 'create-course' && (
                    <ReactAdminCreateCourseComponent
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}

                {view === 'edit-course' && courseToEdit && (
                    <ReactAdminCreateCourseComponent
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

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async (context) => {
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
    const tab = context.query.tab === 'users' ? 'users' : 'courses';
    const page = context.query.page ? parseInt(context.query.page as string, 10) : 1;
    const pageSize = 10; // Show 10 courses per page

    if (tab === 'users') {
        const users = await prisma.user.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { name: 'asc' }
        });

        const totalUsers = await prisma.user.count();

        // Serialize data objects for users
        const serializableUsers = users.map(user => ({
            ...user,
            //.toISOString() handles potentially null values
            // TODO: serialize all needed fields here
            emailVerified: user.emailVerified?.toISOString() || null,
            lastSeen: user.lastSeen?.toISOString() || null,
            createdAt: user.createdAt.toISOString(),            
        }));

        return {
            props: {
                view: 'users',
                users: serializableUsers as SerializableUser[],
                totalPages: Math.ceil(totalUsers / pageSize),
                currentPage: page,
            } as AdminPageProps,
        };
    } else {
        // Default to courses
        const courses = await prisma.course.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { tags: { include: { tag: true } }, keyPositions: true },
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
                view: 'courses',
                courses: serializableCourses,
                totalPages: Math.ceil(totalCourses / pageSize),
                currentPage: page,
            } as AdminPageProps,
        };
    }
};

export default AdminPage;


