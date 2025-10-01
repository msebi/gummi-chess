import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/icons/GoogleIcon';

const GoogleSignInButton = () => {
    return (
        <Button
            variant="outline" // White style with border
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn('google', { callbackUrl: '/'})}
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