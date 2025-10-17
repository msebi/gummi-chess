import Link from 'next/link';
import { SerializableUser } from '@/types/index';
import ServerPagination from '../ui/ServerPagination';

type Props = {
    users: SerializableUser[];
    totalPages: number; 
    currentPage: number;
    onAdd: () => void;
    onEdit: (user: SerializableUser) => void;
    onDeleteSuccess: () => void;
};

export const ReactAdminUserListComponent: React.FC<Props> = ({ users,
                                                               totalPages,
                                                               currentPage,
                                                               onAdd,
                                                               onEdit,
                                                               onDeleteSuccess
                                                               }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add, edit or delete Users</h2> 
            
            <div className="flex justify-center items-center mt-8 gap-4 pb-6">
                <ServerPagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    baseUrl="/admin/users"
                    variant="style-2"
                />
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Banned</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(user.emailVerified || Date.now()).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.isAdmin ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.isBanned ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/users/${user.id}`} className="text-blue-500 hover:text-blue-700">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-8 gap-4">
                <ServerPagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    baseUrl="/admin"
                    variant="style-2"
                />
            </div>
                        
            <div className="mt-6 text-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add new User            
                </button>
            </div>
        </div>
    );
};
