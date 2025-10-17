import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import AdminLayout from '@/components/admin/ReactAdminLayout';
import { ReactAdminUserListComponent } from '@/components/admin/ReactAdminUserListComponent';
import { SerializableCourse, SerializableUser } from '@/types/index';


type ManageUsersPageProps = {
    users: SerializableUser[];
    totalPages: number;
    currentPage: number;
};

const ManageUsersPage = ({ users, totalPages, currentPage }: ManageUsersPageProps) => {
    const [userToEdit, setUserToEdit] = useState<SerializableUser | null>(null);

    const handleUserEdit = (user: SerializableUser) => {
        setUserToEdit(user);
    };

    // This function would be called by the form after a successful save
    const handleSave = () => {
        // TODO: change to fetch changes
        // In a real app, you'd use a data fetching library like SWR or React Query to re-fetch
        // For now, a simple page reload is the easiest way.
        window.location.reload();
    };

    return (
        <AdminLayout>
            <ReactAdminUserListComponent 
                users={users} 
                totalPages={totalPages}
                currentPage={currentPage}
                onAdd={() => ({})}
                onEdit={handleUserEdit}
                onDeleteSuccess={handleSave}
            />
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps<ManageUsersPageProps> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session?.user?.isAdmin) {
        return { redirect: { destination: "/api/auth/signin", permanent: false} };
    }

    const pageQuery = context.params?.page as string[] | undefined;
    const page = pageQuery ? parseInt(pageQuery[0], 10) : 1;
    const pageSize = 10;
    const users = await prisma.user.findMany({
                        skip: (page - 1) * pageSize,
                        take: pageSize,
                        orderBy: { name: 'asc' }
                    });
    const totalUsers = await prisma.user.count();
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
            users: serializableUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
            currentPage: page,
        },
    };
};

export default ManageUsersPage;




