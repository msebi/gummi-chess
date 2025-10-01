import { useState } from 'react';
import { signIn } from 'next-auth/react'; 
import  GoogleSignInButton  from "./ReactGoogleSignInButton";

const SignInFormComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        // Clear previous errors
        setError(''); 

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password');
        } else  if (result?.ok){
            // Redirect to the homepage 
            window.location.href = '/';
        }
    };

    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-2">Sign in</h2>
        <p className="text-center text-gray-600 mb-6">or create an account</p>

        <form onSubmit={handleCredentialsSignIn}>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
                <input className="mr-2" type="checkbox" />
                Remember me
            </label>
            </div>
            <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Sign In
            </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
        </div>

        <GoogleSignInButton />
    </div>
  );
};

export default SignInFormComponent;
