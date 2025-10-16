import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/icons/GoogleIcon';

const GoogleSignInButton = () => {
    // Update Google sign-in to handle potential redirects with errors
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/'});
    };
    
    return (
        <Button
            variant="outline" // White style with border
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
        >
            {/* Google svg icon */}
            <GoogleIcon className="w-5 h-5" /> 
            <span className="font-semibold">            
                <span className="font-semibold text-gray-600">Sign in with Google</span>
            </span>
        </Button>
    );
};

export default GoogleSignInButton;