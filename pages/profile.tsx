import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // This effect protects the page and redirects the user to login if not authenticated 
    useEffect(() => {
        if (status === 'unauthenticated'){
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>; 
    }

    if (session) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Your Profile</h1>
                <p className="mt-4">Hi, {session.user?.name}</p>
                <p>Email: {session.user?.email}</p>
                {/* TODO: Finish profile page */}
            </div>
        );
    }

    // This will be shown briefly before the redirect
    return <div>Access Denied</div>
};

export default ProfilePage;