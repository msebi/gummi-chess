import { 
  User as PrismaUser, 
  Course as PrismaCourse, 
  KeyPosition, 
  Tag,
  CourseTags,
  UserCourses,
  Rating
} from 'database/prisma/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// --- RAW DATABASE TYPES (with relations) ---

// This now correctly represents a `CourseTags` record with the nested `tag`
type CourseTagWithTag = CourseTags & { tag: Tag };

// This is the full shape of a Course with its relations
export type CourseWithRelations = PrismaCourse & {
  tags: CourseTagWithTag[];
  keyPositions: KeyPosition[];
  ratings: Rating[]; // Added ratings for completeness
};

// This is the full shape of a User with its relations
export type UserWithRelations = PrismaUser & {
  courses: (UserCourses & {
    course: CourseWithRelations
  })[];
};

export type UserWithTotalSpendings = UserWithRelations & { totalSpent: number;};

// --- SERIALIZABLE PROP TYPES (JSON-safe) ---

// This type describes the shape of a course after it's been prepared for props
export type SerializableCourse = Omit<CourseWithRelations, 'price' | 'createdAt' | 'updatedAt'> & {
  price: number;
  createdAt: string;
  updatedAt: string;
  // We can simplify the tags array for the client
  tags: { tag: { name: string; id: string; } }[];
};

export type SerializableAdminCourse = Omit<CourseWithRelations, 'price' | 'createdAt' | 'updatedAt' | 'ratings'> & {
  price: number;
  createdAt: string;
  updatedAt: string;
  ratings: (Omit<Rating, 'createdAt'> & { createdAt: string })[];
};

// This is the JSON-safe version of a User
export type SerializableUser = Omit<PrismaUser, 'emailVerified' | 'lastSeen' | 'createdAt'> & {
  emailVerified: string | null;
  lastSeen: string | null;
  createdAt: string;
};

// This is the JSON-safe version of the detailed user page props
export type UserDetailsProps = Omit<UserWithTotalSpendings, 'emailVerified' | 'lastSeen' | 'createdAt' | 'courses'> & {
  emailVerified: string | null;
  lastSeen: string | null;
  createdAt: string;
  totalSpent: number;
  courses: (Omit<UserCourses, 'enrolledAt' | 'priceAtEnrollment' | 'course'> & {
    enrolledAt: string;
    priceAtEnrollment: number;
    course: SerializableCourse;
  })[];
};