'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function UploadPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': []
        },
        multiple: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('audio', file);
            formData.append('title', title);
            formData.append('description', description);

            const response = await fetch('/api/podcasts', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Podcast uploaded successfully!');
                setTitle('');
                setDescription('');
                setFile(null);
                setUploadProgress(100);
                // Reset the file input
                e.target.reset();
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Upload Your Podcast
                </h1>
                
                {message && (
                    <div className={`p-4 mb-6 rounded-lg ${
                        message.includes('Error') 
                            ? 'bg-red-100 text-red-700 border border-red-400' 
                            : 'bg-green-100 text-green-700 border border-green-400'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                            Podcast Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter your podcast title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Describe your podcast..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Audio File
                        </label>
                        <div 
                            {...getRootProps()} 
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                isDragActive 
                                    ? 'border-indigo-500 bg-indigo-50' 
                                    : 'border-gray-300 hover:border-indigo-400'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="space-y-2">
                                <svg 
                                    className="mx-auto h-12 w-12 text-gray-400" 
                                    stroke="currentColor" 
                                    fill="none" 
                                    viewBox="0 0 48 48" 
                                    aria-hidden="true"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                                    />
                                </svg>
                                <div className="text-gray-600">
                                    {file 
                                        ? <p className="font-medium">{file.name}</p>
                                        : isDragActive 
                                            ? <p className="text-indigo-600">Drop your audio file here...</p>
                                            : <p>Drag and drop your audio file here, or click to browse</p>
                                    }
                                </div>
                                <p className="text-xs text-gray-500">
                                    Supported formats: MP3, WAV, AAC
                                </p>
                            </div>
                        </div>
                    </div>

                    {uploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                            loading || !file
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        {loading ? 'Uploading...' : 'Upload Podcast'}
                    </button>
                </form>
            </div>
        </div>
    );
} 