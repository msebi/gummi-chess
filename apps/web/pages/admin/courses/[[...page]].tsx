import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from 'database';
import AdminLayout from '@/components/admin/ReactAdminLayout';
import { ReactAdminCourseComponentGridContainer } from '@/components/admin/ReactAdminCourseComponentGridContainer';
import { ReactAdminCreateCourseComponent } from '@/components/admin/ReactAdminCreateCourseComponent';
import { SerializableCourse, CourseWithRelations } from '@/types/index';

type ManageCoursesProps = {
    courses: SerializableCourse[];
    totalPages: number;
    currentPage: number;
};

const ManageCoursesPage = ({ courses, totalPages, currentPage }: ManageCoursesProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState<SerializableCourse | null>(null);

    const handleSaveOrCancel = () => {
        // Simple reload tp refresh data
        // TODO: replace with fetch logic
        window.location.reload();
    };

    return (
        <AdminLayout>
            {isCreating ? (
                <ReactAdminCreateCourseComponent onSave={handleSaveOrCancel} onCancel={() => setIsCreating(false)} />
            ) : courseToEdit ? (
                <ReactAdminCreateCourseComponent initialData={courseToEdit} onSave={handleSaveOrCancel} onCancel={() => setCourseToEdit(null)} />
            ) : (
                <ReactAdminCourseComponentGridContainer 
                    courses={courses}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onAdd={() => setIsCreating(true)}
                    onEdit={(course) => setCourseToEdit(course)}
                    onDeleteSuccess={handleSaveOrCancel}
                />
            )}
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps<ManageCoursesProps> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session?.user?.isAdmin) {
        return { redirect: { destination: "/api/auth/signin", permanent: false } };
    }

    // The index of the current page is dictated by an array in the URL path
    const pageQuery = context.params?.page as string[] | undefined;
    const page = pageQuery ? parseInt(pageQuery[0], 10) : 1;
    const pageSize = 10;

    const courses: CourseWithRelations[] = await prisma.course.findMany({
                        skip: (page - 1) * pageSize,
                        take: pageSize,
                        orderBy: { createdAt: 'desc' },
                        include: { tags: { include: { tag: true } }, keyPositions: true },
                    });
    const totalCourses = await prisma.course.count();
    const serializableCourses = courses.map((course) => ({
                                            ...course,
                                            price: course.price.toNumber(), 
                                            createdAt: course.createdAt.toISOString(),
                                            updatedAt: course.updatedAt.toISOString(),
                                }));
    
    return {
        props: {
            courses: serializableCourses,
            totalPages: Math.ceil(totalCourses / pageSize),
            currentPage: page,
        },
    };
};

export default ManageCoursesPage;


