import ReactCourseComponent from '@/components/ReactCourseComponent';
import { type SerializableCourse } from '@/pages/index';

type Props = {
    course: SerializableCourse;
    onEdit: () => void;
    onDeleteSuccess: () => void;
};

export const ReactAdminCourseComponent: React.FC<Props> = ({ course, onEdit, onDeleteSuccess }) => {
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete course "${course.title}"?`)) {
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
                alert("Error deleting course.");
            }
        }
    };

    const courseProps = {
        id: course.id,
        title: course.title,
        imageUrl: course.thumbnailUrl,
        // Ensure tags are mapped correctly, handling potential undefineds
        tags: course.tags?.map(t => t.tag.name).filter(Boolean) as string[],
    };

    return (
        // 1. Add `relative` to this container. This makes it the "anchor"
        //      for the absolutely positioned buttons inside it
        <div className="relative">            
            {/* 2. Render the course component directly. Removed the extra divs and `flex-grow`
            that was causing the stretching */}
            <ReactCourseComponent {...courseProps} />            

            {/* New container for the buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button 
                    onClick={onEdit} 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 
                                px-4 rounded shadow-lg transition-transform hover:scale-105">
                    Edit 
                </button>
                <button 
                    onClick={handleDelete} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 
                                 px-4 rounded shadow-lg transition-transform hover:scale-105">
                    Delete
                </button>
            </div>
        </div>
    );
};

