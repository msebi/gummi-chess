import { useRouter } from "next/router";
import { ReactAdminCourseComponent } from './ReactAdminCourseComponent';
import { type SerializableCourse } from '@/pages/index';

type Props = {
    courses: SerializableCourse[];
    totalPages: number;
    onAdd: () => void; 
    onEdit: (course: SerializableCourse) => void;
    onDeleteSuccess: () => void; 
};

export const ReactAdminCourseComponentContainer: React.FC<Props> = 
({ courses, totalPages, onAdd, onEdit, onDeleteSuccess }) => {
    const router = useRouter();
    const currentPage = router.query.page ? parseInt(router.query.page as string, 10) : 1;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Add, edit or delete Courses 
            </h2>
            <div className="space-y-4">
                {courses.map(course => (
                    <ReactAdminCourseComponent 
                        key={course.id}
                        course={course}
                        onEdit={() => onEdit(course)}
                        onDeleteSuccess={onDeleteSuccess}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8 gap-4">
                {/* TODO: Implement a more involved pagination mechanism */}
                <span>
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            <div className="mt-8 text-center">
                <button onClick={onAdd} 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Course
                </button>
            </div>
        </div>
    );
};



