import ReactCourseComponent from '@/components/ReactCourseComponent';
import { type SerializableCourse } from '@/pages/index';

type Props = {
    course: SerializableCourse;
    onEdit: () => void;
    onDeleteSuccess: () => void;
};

export const ReactAdminCourseComponent: React.FC<Props> = ({ course, onEdit, onDeleteSuccess }) => {
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete course "${course.title}"`)) {
            try {
                const response = await fetch(`/api/courses/${course.id}`, { method: 'DELETE'});
                if (!response.ok) {
                    throw new Error('Failed to delete course');
                }
                // TODO: change alert to something prettier
                alert("Course deleted successfully!");
                onDeleteSuccess();
            } catch (error) {
                console.error(`Failed to delete course: ${course.title}. Error: ${error}`);
                alert("Error deleting course");
            }
        }
    };

    const courseProps = {
        id: course.id,
        title: course.title,
        imageUrl: course.thumbnailUrl,
        tags: course.tags.map(t => t.tag.name),
    };

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-grow">
                <ReactCourseComponent {...courseProps} />
            </div>
            <div className="flex flex-col gap-2">
                <button onClick={onEdit} 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Edit 
                </button>
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </div>
    );
};

