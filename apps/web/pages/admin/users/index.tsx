// pages/admin/users/index.tsx
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from 'database';
import AdminLayout from '@/components/admin/ReactAdminLayout';
import { ReactAdminUserListComponent } from '@/components/admin/ReactAdminUserListComponent';
import { useRouter } from 'next/router'; 
import { SerializableUser } from '@/types/index';
import { User as UserType } from 'database/prisma/generated/prisma/client'; // Import the raw Prisma type

type ManageUsersPageProps = {
  users: SerializableUser[];
  totalPages: number;
  currentPage: number;
};

const ManageUsersPage = ({ users, totalPages, currentPage }: ManageUsersPageProps) => {
    const router = useRouter();

    return (
        <AdminLayout>
            <ReactAdminUserListComponent 
                users={users} 
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps<ManageUsersPageProps> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session?.user?.isAdmin) {
        return { redirect: { destination: "/api/auth/signin", permanent: false } };
    }
    
    const page = context.query.page ? parseInt(context.query.page as string, 10) : 1;
    const pageSize = 10;
    
    const users : UserType[] = await prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: 'asc' }
    });
    const totalUsers = await prisma.user.count();

    const serializableUsers = users.map(user => ({
        ...user,
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




