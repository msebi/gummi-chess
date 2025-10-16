import { ReactAdminCourseComponent } from "./ReactAdminCourseComponent";
import { type SerializableCourse } from "@/pages/index";
import ServerPagination from "../ui/ServerPagination";

type Props = {
    courses: SerializableCourse[];
    totalPages: number;
    currentPage: number;
    onAdd: () => void;
    onEdit: (course: SerializableCourse) => void;
    onDeleteSuccess: () => void;
};

export const ReactAdminCourseComponentGridContainer: React.FC<Props> = ({ courses,
                                                                          totalPages,
                                                                          currentPage,
                                                                          onAdd,
                                                                          onEdit,
                                                                          onDeleteSuccess
                                                                        }) => {
    // TODO: cleanup
    // const router = useRouter();
    // const currentPage = router.query.page ? parseInt(router.query.page as string) : 1;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Add, edit or delete Courses
            </h2>

            <div className="flex justify-center items-center mt-8 gap-4 pb-6">
                <ServerPagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    baseUrl="/admin"
                    variant="style-2"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <ReactAdminCourseComponent 
                        key={course.id}
                        course={course}
                        onEdit={() => onEdit(course)}
                        onDeleteSuccess={onDeleteSuccess}
                    />
                ))}
            </div>

            {/* Paging Controls */}
            {/* <div className="flex justify-center items-center mt-8 gap-4">
                <span>Page {currentPage} of {totalPages}</span>
            </div> */}
            <div className="flex justify-center items-center mt-8 gap-4">
                <ServerPagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    baseUrl="/admin"
                    variant="style-2"
                />
            </div>

            <div className="mt-8 text-center">
                <button onClick={onAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Course
                </button>
            </div>
        </div>
    );
};


