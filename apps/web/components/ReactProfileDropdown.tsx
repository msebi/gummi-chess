import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

// define the user object we expect from the session 
// interface UserProfile {
//     name?: string | null;
//     email?: string | null;
//     image?: string | null; 
// };

import { type User } from 'next-auth';

const ReactProfileDropdown = ( { user }: { user: User} ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // This effect handles closing the dropdown when clicking outside of it 
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside); 
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}            
            <button onClick={() => setIsOpen(!isOpen)} className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image 
                    src={user.image || '/default-avatar.png'}
                    alt={user.name || 'User Avatar'}
                    layout="fill"
                    objectFit="cover"
                />
            </button>

            {/*Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 text-sm text-gray-700">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>                        
                    </div>    
                    <div className="border-t border-gray-100"></div> 
                    <Link href="/profile">
                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            View Profile
                        </span>                        
                    </Link>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Log Out 
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReactProfileDropdown;



