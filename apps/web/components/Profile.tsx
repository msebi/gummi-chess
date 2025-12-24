import { useSession, signIn, signOut } from 'next-auth/react'; 

const Profile = () => {
    // The useSession hook gives you the session status and data 
    const { data:session, status } = useSession();

    // The status can be 'loading', 'authenticated', or 'unauthenticated' 
    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (session) {
        console.log("session object", session);
        // If the session exists, the user is authenticated
        return (
            <div className="flex items-center gap-4">
                {/* The user's information can be accessed directly */}
                <p>Welcome, {session.user?.name}</p>                
                <p>{session.user?.email}</p>
                
                <button 
                    onClick={() => signOut()}
                    className="bg-red-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >                        
                    Sign Out
                </button>
            </div>
        );
    }

    // If there's no session, the user is not authenticated 
    return (
        <div>
            <p>You are not signed in.</p>
            <button
                onClick={() => signIn()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Sign In
            </button>
        </div>
    );
};

export default Profile;
