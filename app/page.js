'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                        <span className="block">Your Voice,</span>
                        <span className="block text-indigo-600">Your Platform</span>
                    </h1>
                    <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
                        Create, host, and share your podcasts with ease. PodcastVault provides a secure and reliable platform for all your podcast hosting needs.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        {session ? (
                            <Link
                                href="/dashboard"
                                className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signup"
                                    className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/auth/signin"
                                    className="px-8 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything you need to host your podcast
                        </h2>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="relative p-6 bg-white rounded-lg shadow-md">
                            <div className="absolute -top-4 left-6">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="mt-8 text-xl font-medium text-gray-900">Easy Upload</h3>
                            <p className="mt-2 text-gray-500">
                                Simple drag-and-drop interface for uploading your podcast episodes with support for various audio formats.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="relative p-6 bg-white rounded-lg shadow-md">
                            <div className="absolute -top-4 left-6">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="mt-8 text-xl font-medium text-gray-900">Secure Storage</h3>
                            <p className="mt-2 text-gray-500">
                                Your podcasts are stored securely in the cloud with reliable backup and fast delivery worldwide.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="relative p-6 bg-white rounded-lg shadow-md">
                            <div className="absolute -top-4 left-6">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="mt-8 text-xl font-medium text-gray-900">Easy Sharing</h3>
                            <p className="mt-2 text-gray-500">
                                Share your podcasts easily with your audience through direct links and embedded players.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Ready to start your podcast journey?
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Join PodcastVault today and take your first step into podcasting.
                        </p>
                        <div className="mt-8">
                            {!session && (
                                <Link
                                    href="/auth/signup"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Create Your Account
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
