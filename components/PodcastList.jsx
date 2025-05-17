'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function PodcastList({ initialPodcasts = [], onPodcastDeleted }) {
    const [podcasts, setPodcasts] = useState(initialPodcasts);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [error, setError] = useState('');
    const router = useRouter();

    const handleDelete = useCallback(async (podcastId) => {
        if (deletingIds.has(podcastId) || 
            !confirm('Are you sure you want to delete this podcast?')) {
            return;
        }

        setDeletingIds(prev => new Set([...prev, podcastId]));
        setError('');

        try {
            const response = await fetch(`/api/podcasts/${podcastId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete podcast');
            }

            // Remove the podcast from the local state
            setPodcasts(current => current.filter(podcast => podcast.id !== podcastId));
            
            // Notify parent component
            if (onPodcastDeleted) {
                onPodcastDeleted(podcastId);
            }
        } catch (error) {
            console.error('Error deleting podcast:', error);
            setError(`Failed to delete podcast: ${error.message}`);
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(podcastId);
                return newSet;
            });
        }
    }, [deletingIds, onPodcastDeleted]);

    if (podcasts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No podcasts found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {podcasts.map((podcast) => {
                    const isDeleting = deletingIds.has(podcast.id);
                    
                    return (
                        <div
                            key={podcast.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {podcast.title}
                                </h3>
                                {podcast.description && (
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {podcast.description}
                                    </p>
                                )}
                                <div className="space-y-2">
                                    <audio
                                        controls
                                        className="w-full"
                                        src={podcast.audioUrl}
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                    <button
                                        onClick={() => handleDelete(podcast.id)}
                                        disabled={isDeleting}
                                        className="w-full mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3">
                                <p className="text-sm text-gray-500">
                                    Added {new Date(podcast.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 