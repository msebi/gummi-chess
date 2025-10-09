import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.query;

    if (req.method === "PUT") {
        // Logic to UPDATE a course
        try {
            const course = await prisma.course.update({
                where: { id: String(id) },
                data: req.body,
            });
            return res.status(200).json(course);
        } catch (error) {
            console.log(`Failed to update course. Error: ${error}`);
            return res.status(500).json({ message: "Something went wrong."});
        }
    } else if (req.method === "DELETE") {
        // Logic to DELETE a course
        try {
            await prisma.course.delete({ where: { id: String(id) } });
            return res.status(204).end(); // No content
        } catch (error) {
            console.log(`Failed to delete course. Error: ${error}`);
            return res.status(500).json({ message: "Something went wrong."})
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};



