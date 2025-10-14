import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { useRouter } from 'next/router';

import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';
import ReactCourseComponent from '@/components/ReactCourseComponent';

// Define a detailed type for the user data 
type UserDetails = Awaited<ReturnType<typeof fetchUserDetails>>;

// Define a type for the serialized course, including its relations
type SerializedCourseInUser = {
    id: string;
    title: string;
    thumbnailUrl: string;
    // Add other types as needed  
    tags: {
        tag: {
            name: string;
        }
    }[];
};

// Define main type for the props passed to the page component
// This is the final JSON-safe data structure 
type UserDetailsProps = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: string | null; // Dates converted to strings
    lastSeen: string | null; // Dates converted to strings
    createdAt: string; // Dates converted to strings
    isBanned: boolean;
    isAdmin: boolean;
    totalSpent: number;
    courses: {
        enrolledAt: string;  // Dates converted to strings 
        course: SerializedCourseInUser
    }[]
};

const fetchUserDetails = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            courses: {
                include: {
                    course: {
                        include: {
                            tags: { include: { tag: true } }
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
                            className="bg-blue-500 text-white py-2 px-4 rounded">
                            {userDetails.isAdmin ? "Revoke Admin" : "Make Admin"}
                        </button>
                        <button
                            onClick={() => handleUpdate({ isBanned: !userDetails.isBanned })}
                            className="bg-yellow-500 text-white py-2 px-4 rounded">
                            {userDetails.isBanned ? "Unban User" : "Ban User"}
                        </button>
                        <button onClick={() => handleDelete()} className="bg-red-500 text-white py-2 px-4 rounded">Delete</button>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded">Save Changes</button>
                    </div>
                </div>
            </main>
            <ReactFooterComponent />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session || !session.user?.isAdmin) {
        return {
            redirect: {
                destination: '/api/auth/signin', permanent: false
            }
        };
    }

    const { id } = context.params!;
    const userDetails = await fetchUserDetails(String(id));

    if (!userDetails) {
        return {
            notFound: true,
        };
    }

    // Serialize all the dates before passing 
    const serializableUserDetails = {
        ...userDetails,
        emailVerified: userDetails.emailVerified?.toISOString() || null,
        lastSeen: userDetails.lastSeen?.toISOString() || null,
        courses: userDetails.courses.map(uc => ({
            ...uc,
            enrolledAt: uc.enrolledAt.toISOString(),
            course: {
                ...uc.course,
                price: uc.course.price.toNumber(),
                createdAt: uc.course.createdAt.toISOString(),
                updatedAt: uc.course.updatedAt.toISOString(),
                // Make sure the tags are serialized correctly if they contain non-serializable data
                tags: uc.course.tags.map(t => ({ tag: { id: t.tag.id, name: t.tag.name } })),
            }
        }))
    };

    // ...but now the return type matches our explicit definition.
    return { props: { userDetails: serializableUserDetails } };
};

export default UserAdminPage;

