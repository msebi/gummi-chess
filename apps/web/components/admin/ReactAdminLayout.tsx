import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactHeaderComponent from '@/components/ReactHeaderComponent';
import ReactFooterComponent from '@/components/ReactFooterComponent';

type AdminLayoutProps = {
    children: React.ReactNode; 
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const router = useRouter();
    // Determine the active tab from the URL path
    const activeTab = router.pathname.includes('/admin/users') ? 'users' : 'courses';

    return (
        <div className="flex flex-col min-h-screen">
            <ReactHeaderComponent />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Administration</h1>

                {/* The Administration Menu Component */}
                <div className="flex border-b mb-4">
                    <Link href="/admin/courses" 
                          className={`py-2 px-4 ${activeTab === 'courses' ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'}`}>
                        Manage Courses
                    </Link>
                    <Link href="/admin/users" 
                        className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'}`}>
                        Manage Users
                    </Link>
                </div>                

                {/* Render page-specific content here */}
                {children}
            </main>
            <ReactFooterComponent />
        </div>
    );
};

export default AdminLayout;



