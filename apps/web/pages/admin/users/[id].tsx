import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from 'database';
import { UserWithRelations } from '@/types/index';
import { useRouter } from 'next/router';

import { 
  User as PrismaUser, 
  Course as PrismaCourse, 
  UserCourses,
} from 'database/prisma/generated/prisma/client';

import { type SerializableAdminCourse } from '@/types/index'; 

import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
import ReactCourseComponent from '@/components/ReactCourseComponent';

// Import our centralized, JSON-safe type for the props
import { type UserWithTotalSpendings } from '@/types/index';

// This is the JSON-safe version of the detailed user page props
type UserDetailsProps = Omit<UserWithRelations, 'emailVerified' | 'lastSeen' | 'createdAt' | 'courses'> & {
  emailVerified: string | null;
  lastSeen: string | null;
  createdAt: string;
  totalSpent: number;
  courses: (Omit<UserCourses, 'enrolledAt' | 'priceAtEnrollment' | 'course'> & {
    enrolledAt: string;
    priceAtEnrollment: number;
    course: SerializableAdminCourse; // <-- Use the new, more detailed type
  })[];
};

// This function fetches the raw, unserialized data from the database.
const fetchUserDetails = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            courses: {
                include: {
                    course: {
                        include: {
                            tags: { include: { tag: true } },
                            keyPositions: true, // Make sure all relations are included
                            ratings: true,
                        }
                    }
                }
            }
        }
    });

    if (!user) return null;

    const totalSpentAggregate = await prisma.userCourses.aggregate({
        _sum: {
            priceAtEnrollment: true
        },
        where: {
            userId: id
        },
    });

    return {
        ...user,
        totalSpent: totalSpentAggregate._sum.priceAtEnrollment?.toNumber() ?? 0
    };
};

export const getServerSideProps: GetServerSideProps<{ userDetails: UserDetailsProps | null }> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session || !session.user?.isAdmin) {
        return {
            redirect: {
                destination: '/api/auth/signin', permanent: false
            }
        };
    }

    const { id } = context.params!;
    const userDetailsFromDb : UserWithTotalSpendings  = await fetchUserDetails(String(id));

    if (!userDetailsFromDb) {
        return {
            notFound: true,
        };
    }

    // Serialize all the dates before passing 
    const serializableUserDetails: UserDetailsProps = {
        ...userDetailsFromDb,
        createdAt: userDetailsFromDb.createdAt.toISOString(),
        emailVerified: userDetailsFromDb.emailVerified?.toISOString() || null,
        lastSeen: userDetailsFromDb.lastSeen?.toISOString() || null,
        totalSpent: userDetailsFromDb.totalSpent,
        courses: userDetailsFromDb.courses.map(uc => ({
            userId: uc.userId,
            courseId: uc.courseId,
            enrolledAt: uc.enrolledAt.toISOString(),
            priceAtEnrollment: uc.priceAtEnrollment.toNumber(),
            course: { // This block now correctly creates a SerializableAdminCourse
                ...uc.course,
                price: uc.course.price.toNumber(),
                createdAt: uc.course.createdAt.toISOString(),
                updatedAt: uc.course.updatedAt.toISOString(),
                tags: uc.course.tags, // This is now correct
                ratings: uc.course.ratings.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
                keyPositions: uc.course.keyPositions,
            }
        }))
    };

    // ...but now the return type matches our explicit definition.
    return { props: { userDetails: serializableUserDetails } };
};

const UserAdminPage = ({ userDetails }: { userDetails: UserDetailsProps | null}) => {
    const router = useRouter();

    if (!userDetails) {
        return <div>User not found.</div>
    }

    const handleUpdate = async (data: { isAdmin?: boolean; isBanned?: boolean }) => {
        try {
            const res = await fetch(`/api/admin/users/${userDetails.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok)
                throw new Error("Updating User has failed.");
            alert("User updated successfully.");
            router.replace(router.asPath);
        } catch (error) {
            console.error(`Failed to update user with id ${userDetails.id}. Error: ${error}`);
            alert("Error updating user.");
        }
    };

    // TODO: handle delete user 
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete user "${userDetails.name}"?`)) {
            try {
                const response = await fetch(`/api/admin/users/${userDetails.id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                // TODO: change alert to something prettier
                alert("User deleted successfully!");
            } catch (error) {
                console.error(`Failed to delete user: ${userDetails.name}. Error: ${error}`);
                alert("Error deleting user.");
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <ReactHeaderComponent />
            <main className="flex-grow container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Manage User: {userDetails.name}</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* ReactUserComponent content */}
                    <div className="grid grid-cols-2 gap-4 text-lg">
                        <span className="font-semibold">Username:</span><span>{userDetails.name}</span>
                        <span className="font-semibold">Email:</span><span>{userDetails.email}</span>
                        <span className="font-semibold">Registered:</span><span>{
                            new Date(userDetails.createdAt!).toLocaleDateString()
                        }</span>
                        <span className="font-semibold">Last seen:</span><span>{
                            new Date(userDetails.lastSeen!).toLocaleString()
                        }</span>
                        <span className="font-semibold">Is Admin:</span><span>{userDetails.isAdmin ? "Yes" : "No"}</span>
                        <span className="font-semibold">Is Banned:</span><span>{userDetails.isBanned ? "Yes" : "No"}</span>
                        <span className="font-semibold">Purchased Courses (Total Amount)</span><span>{userDetails.totalSpent.toFixed(2)}</span>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Purchased Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userDetails.courses.map((uc) => (
                            <ReactCourseComponent
                                key={uc.course.id}
                                id={uc.course.id}
                                title={uc.course.title}
                                imageUrl={uc.course.thumbnailUrl}
                                // Correctly access the nested tags array
                                tags={uc.course.tags?.map(t => t.tag.name) || []} 
                            />
                        ))}
                    </div>

                    {/* ReactManageUserComponent content */}
                    <div className="mt-8 pt-6 border-t flex justify-center gap-4">
                        <button
                            onClick={() => handleUpdate({ isAdmin: !userDetails.isAdmin })}
                            className="bg-blue-500 over:bg-blue-700 font-bold text-white 
                                         py-2 px-4 rounded shadow-lg transition-transform hover:scale-105">
                            {userDetails.isAdmin ? "Revoke Admin" : "Make Admin"}
                        </button>
                        <button
                            onClick={() => handleUpdate({ isBanned: !userDetails.isBanned })}
                            className="bg-yellow-500 over:bg-yellow-700 font-bold text-white 
                                         py-2 px-4 rounded shadow-lg transition-transform hover:scale-105">
                            {userDetails.isBanned ? "Unban User" : "Ban User"}
                        </button>
                        <button 
                            onClick={() => handleDelete()} 
                            className="bg-red-500 over:bg-red-700 font-bold text-white 
                                         py-2 px-4 rounded shadow-lg transition-transform hover:scale-105">Delete</button>
                        {/* TODO: handle redirect here */}
                        <button className="bg-blue-500 over:bg-blue-700 font-bold text-white 
                                            py-2 px-4 rounded shadow-lg transition-transform hover:scale-105">Save Changes</button>
                    </div>
                </div>
            </main>
            <ReactFooterComponent />
        </div>
    );
};

export default UserAdminPage;