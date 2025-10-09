import { useState, useEffect } from 'react';
import { type SerializableCourse } from '@/pages/index';

type Props = {
    initialData?: SerializableCourse | null;
    onSave: () => void;
    onCancel: () => void; 
};

// A simple form state for a new course 
const defaultState = {
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    price: 0,
    isFree: true,
    keyPositions: '', // Stored as comman separeted value, TODO: change to array?
    tags: '', // Stored as comma-separated string 
};

export const ReactCreateCourseComponent: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(defaultState);
    const [isDirty, setIsDirty] = useState(false);

    // Pre-fill form if we are editing 
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                videoUrl: initialData.videoUrl,
                thumbnailUrl: initialData.thumbnailUrl,
                price: initialData.price,
                isFree: initialData.isFree, 
                keyPositions: initialData.keyPositions.map(p => p.fen).join(', '),
                tags: initialData.tags.map(t => t.tag.name).join(', '),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsDirty(true);
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));        
    };

    const handleCancel = () => {
        if (isDirty) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                onCancel();
            }        
        } else {
            onCancel();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: improve validation
        if (!formData.title || !formData.videoUrl) {
            alert("Title and Video URL are required");
            return;
        }

        // TODO: parse data into appropriate structures
        // In a real app, you would parse the tags and keyPositions into structured data
        const body = {
            ...formData,
            price: Number(formData.price),
            isFree: Number(formData.price) === 0,
        };

        const url = initialData ? `/api/courses/${initialData.id}` : '/api/courses';
        const method = initialData ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method, 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error('Failed to save course');
            }
            // TODO: change alert to something prettier
            alert(`Course ${initialData ? 'updated' : 'created'} successfully!`);
            onSave();
        } catch (error) {
            console.log(`An error has occurred while creating or updating course ${initialData?.title}. Error: ${error}`);
            alert("Error saving course.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold">
                {initialData ? `Editing Course: ${initialData.title}` : 'Adding new Course...'}
            </h2>

            <div>
                <label>Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label>Video URL</label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div> 
                <label>Thumbnail URL</label>
                <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label>Key Positions (comma separated FEN strings)</label>
                <textarea name="keyPositions" value={formData.keyPositions} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label>Tags (comma separated)</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Cancel
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save
                </button>
            </div>
        </form>
    );
};








