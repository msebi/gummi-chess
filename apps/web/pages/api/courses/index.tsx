import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]";
import prisma from "database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    // Protect the route - only admins can access
    if (!session?.user?.isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'POST') {
        // Logic to CREATE a new course
        try {
            const course = await prisma.course.create({ data: req.body });
            return res.status(201).json(course);
        } catch (error) {
            console.log(`Error occurred while creating a new course. Error: ${error}`);
            return res.status(500).json({ message: "Oops ... Something went wrong." });
        }
    } else {
        // Handle other methods or return an error
        res.setHeader("Allow", ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

