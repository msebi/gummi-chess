import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';

const BannedPage = () => {
    const router = useRouter();
    const { name } = router.query;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <ReactHeaderComponent />
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        We are sorry
                    </h1>
                    <p className="text-gray-600 mb-6">
                        The user <span className="font-semibold">{name || 'account'}</span> is currently banned.
                    </p>                
                    <Link href="/login" 
                          className="inline-block w-full bg-blue-500 hover:bg-blue-600 text-white 
                                     font-bold py-3 px-4 rounded transition-colors">
                        Back to login
                    </Link>
                </div>
            </main>
            <ReactFooterComponent />
        </div>
    );
};

export default BannedPage;


