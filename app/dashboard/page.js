'use client';

import { useEffect, useState, useCallback } from 'react';
import PodcastList from '@/components/PodcastList';

export default function DashboardPage() {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPodcasts = useCallback(async () => {
        try {
            const response = await fetch('/api/podcasts', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch podcasts');
            }
            const data = await response.json();
            setPodcasts(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPodcasts();

        // Set up polling with a reasonable interval (e.g., every 30 seconds)
        const intervalId = setInterval(fetchPodcasts, 30000);

        return () => clearInterval(intervalId);
    }, [fetchPodcasts]);

    const handlePodcastDeleted = useCallback(() => {
        // Wait a bit before refreshing to allow the delete operation to complete
        setTimeout(fetchPodcasts, 1000);
    }, [fetchPodcasts]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Podcasts</h1>
                    <a
                        href="/upload"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Upload New
                    </a>
                </div>
                <div className="text-center py-10">
                    <p className="text-gray-500">Loading podcasts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Podcasts</h1>
                    <a
                        href="/upload"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Upload New
                    </a>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Podcasts</h1>
                <a
                    href="/upload"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Upload New
                </a>
            </div>
            <PodcastList 
                initialPodcasts={podcasts} 
                onPodcastDeleted={handlePodcastDeleted}
            />
        </div>
    );
} 