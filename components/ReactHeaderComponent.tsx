import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ReactLogoComponent from './icons/ReactLogoComponent';
import ReactMenuComponent from './ReactMenuComponent';
import ReactProfileDropdown from './ReactProfileDropdown';


const ReactHeaderComponent: React.FC = () => {
  // Use the session hook to get authentcation status
  const { data: session, status } = useSession(); 
  const isLoading = status === 'loading';
  const isAdmin = session?.user?.isAdmin; 

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' },
    // Only add the Admin link if the user is an admin
    ...(isAdmin? [{ label: 'Admin', href: '/admin'}] : []),
  ];


  return (
    <header className="w-full bg-gray-100 border-b-2 border-gray-200">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-[30%]">
          <ReactLogoComponent 
              className="h-16" 
              width={100}
              height={100}
          />
        </div>
        <div className="w-[70%] flex items-center justify-end gap-6 pr-4">
          <ReactMenuComponent items={menuItems} className="justify-end" />

          {/* TODO: Remove separator? */}
          {/* Add a visual separator */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* Conditional rendering based on authentication status. */}
          {isLoading ? (
            // Show a loading skeleton while session is being fetched
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          ) : session && session.user ? (
            // If authenticated, show the profile dropdown 
            <ReactProfileDropdown user={session.user} />
          ) : (
            // If not authenticated, show the Login link 
            <Link href="/login">
              <span className="cursor-pointer text-lg font-medium hover:text-blue-600 transition-colors">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default ReactHeaderComponent;
