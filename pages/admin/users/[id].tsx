import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.isAdmin) {
        return res.status(403).json({ message: 'Forbidden'});
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
        // Logic to update user properties (e.g. isAdmin, isBanned)
        try {
            const { isBanned, isAdmin } = req.body;  // Expecting these flags from the client 
            const user = await prisma.user.update({
                where: { id: String(id) }, 
                data: {
                    // Use 'undefined' to avoid changing fields that were not sent
                    isAdmin: typeof isAdmin === 'boolean' ? isAdmin : undefined, 
                    isBanned: typeof isBanned === 'boolean' ? isBanned: undefined, 
                }
            });
            return res.status(200).json(user); 
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Something went wrong.' });
        }
    } else if (req.method === 'DELETE') {
        // Logic to DELETE a user
        try {
            await prisma.user.delete({ where: { id: String(id) }});
            return res.status(204).end();
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Something went wrong."});
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};


