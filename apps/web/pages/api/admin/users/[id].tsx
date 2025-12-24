import { NextApiRequest, NextApiResponse } from 'next'; 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from 'database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    // Ensure user is logged in as admin
    if (!session || !session.user?.isAdmin) {
        return res.status(403).json({ message: 'Forbidden'});
    }

    // Get user ID from query (e.g. /api/admin/users/abcde12345 )
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID'});
    }

    if (req.method === 'PUT') {
        // UPDATE user 
        try {
            const { isAdmin, isBanned } = req.body; 
            const updateUser = await prisma.user.update({
                where: { id },
                data: {
                    // Use 'undefined' to avoid chaning fields that weren't included in the request 
                    isAdmin: typeof isAdmin === 'boolean' ? isAdmin : undefined,
                    isBanned: typeof isBanned === 'boolean' ? isBanned : undefined,
                },
            });
            return res.status(200).json(updateUser);
        } catch (error) {
            console.log(`Failed to update user with id ${id}. Error: ${error}`);
            return res.status(500).json({ message: "Failed to update user."});
        }   
    } else if (req.method === 'DELETE') {
        // DELETE user 
        try {
            // You cannot delete yourself 
            if (session.user.id === id) {
                return res.status(400).json({ message: 'You cannot delete yourself.'});
            }
            await prisma.user.delete({ where: { id } });
            return res.status(204).end();
        } catch (error) {
            console.error(`Failed to delete user with id ${id}. Error: ${error}`);
            return res.status(500).json({ message: 'Failed to delete user.'});
        }
    } else {
        // Block other HTTP methods 
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


