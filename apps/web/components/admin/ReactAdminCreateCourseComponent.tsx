import { useState, useEffect } from 'react';
import { type SerializableCourse } from 'apps/web/pages/index';

type Props = {
    initialData?: SerializableCourse | null;
    onSave: () => void;
    onCancel: () => void; 
};

interface KeyPositionState {
    id?: string; // Keep track of existing IDs for potential future updates
    fen: string; 
    description: string;
};

// A simple form state for a new course 
const defaultState = {
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    price: 0,
    isFree: true,
    keyPositions: [{ fen: '', description: ''}] as KeyPositionState[],
    tags: '', // Stored as comma-separated string 
};

export const ReactAdminCreateCourseComponent: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
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
                keyPositions: initialData.keyPositions.length > 0 ? initialData.keyPositions.map(p => ({
                    id: p.id,
                    fen: p.fen,
                    description: p.description || '',
                })) : [{ fen: '', description: '' }], // At least one empty row
                tags: initialData.tags.map(t => t.tag.name).join(', '),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsDirty(true);
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));        
    };

    const handleKeyPositionChange = (index: number, field: 'fen' | 'description', value: string) => {
        setIsDirty(true);
        const newKeyPositions = [...formData.keyPositions];
        newKeyPositions[index][field] = value;
        setFormData(prev => ({ ...prev, keyPositions: newKeyPositions}));
    };

    const addKeyPosition = () => {
        setFormData(prev => ({
            ...prev,
            keyPositions: [...prev.keyPositions, { fen: '', description: ''}],
        }));
    };

    const removeKeyPosition = (index: number) => {
        // Prevent removing the last row
        if (formData.keyPositions.length <= 1) return;
        setIsDirty(true);
        const newKeyPositions = formData.keyPositions.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, keyPositions: newKeyPositions}));
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

        // Prepare the nested write data for the keyPositions relation. Filter out empty FEN rows        
        const keyPositionsForDb = formData.keyPositions
                    .filter(p => p.fen.trim() !== '')
                    .map(p => ({ fen: p.fen, description: p.description }));

        // Construct payload for API
        // Don't include the keyPositions array from formData directly
        const coursePayload = {
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            thumbnailUrl: formData.thumbnailUrl,
            price: Number(formData.price),
            isFree: Number(formData.price) === 0,
        };

        // TODO: parse data into appropriate structures
        // In a real app, you would parse the tags into structured data
        let body;

        // Add the correctly formatted keyPositions data
        if (initialData) {
            // Update course
            body = {
                ...coursePayload,
                keyPositions: {
                    deleteMany: {}, // Delete all key positions from this course
                    create: keyPositionsForDb // Then, create the new ones from the form
                },
                // TODO: A full implementation for tags would follow the same pattern
                // tags: { deleteMany: {}, create: [...] }
            };
        } else {
            // For new courses, just create the new positions
            body = {
                ...coursePayload,
                keyPositions: {
                    create: keyPositionsForDb, // Just create the key position.
                }
            };
        }

        const url = initialData ? `/api/courses/${initialData.id}` : '/api/courses';
        const method = initialData ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method, 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save course');
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">
                {initialData ? `Editing Course: ${initialData.title}` : 'Adding new Course...'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label>Upload Thumbnail</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {/* TODO: implement UI
                            Placeholder for upload UI */}
                            <svg className="mx-auto h-12 w-12 text-gray-400" 
                                 stroke="currentColor" 
                                 fill="none" 
                                 viewBox="0 0 48 48" 
                                 aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                <div> 
                    <label>Thumbnail URL</label>
                    <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Video URL</label>
                    <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} 
                              className="w-full border p-2 rounded" rows={3} />
                </div>
            </div>
            {/* Key Positions  */}
            <div className="space-y-4">
                <h3 className="font-semibold">Key Positions</h3>
                {formData.keyPositions.map((pos, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                        <div>
                            <label className="text-sm">Position #{index + 1} FEN String</label>
                            <input 
                                type="text"
                                value={pos.fen}
                                onChange={(e) => handleKeyPositionChange(index, 'fen', e.target.value)}
                                className="w-full border p-2 rounded mt-1 font-mono"
                            />
                        </div>
                        <div className="flex items-end">
                            <div className="w-full">
                                <label className="text-sm">Position Description</label>
                                <input 
                                    type="text"
                                    value={pos.description}
                                    onChange={(e) => handleKeyPositionChange(index, 'description', e.target.value)}
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>
                            {formData.keyPositions.length > 1 && (
                                <button type="button" onClick={() => removeKeyPosition(index)} 
                                        className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addKeyPosition} className="mt-2 text-sm text-blue-500 hover:underline">
                    + Add another position
                </button>
            </div>
            {/* Remaining tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label>Tags (comma separated)</label>
                    <input name="tags" value={formData.tags} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>                
            </div>
            <div className="flex justify-end gap-4 border-t pt-6 mt-6">
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








