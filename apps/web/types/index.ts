import { User as UserType, Course as CourseType, KeyPosition, Tag } from '@/generated/prisma/client';

// This is the full shape of a Course with its relations, as fetched from Prisma
export type CourseWithRelations = CourseType & {
    tags: { tag: Tag }[];
    keyPositions: KeyPosition[];
};

// This is the JSON-safe version of a Course, suitable to be passed as props 
export type SerializableCourse = Omit<CourseWithRelations, 'price' | 'createdAt' | 'updatedAt'> & {
    price: number; 
    createdAt: string;
    updatedAt: string;
};

// This is the JSON-safe version of a User, suitable to be passed as props 
export type SerializableUser = Omit<UserType, 'emailVerified' | 'lastSeen' | 'createdAt'> & {
    emailVerified: string | null;
    lastSeen: string | null;
    createdAt: string;
};




