import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PodcastVault</div>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload Podcast
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Podcast Journey Starts Here
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Host, manage, and share your podcasts with ease. PodcastVault provides
              a seamless platform for creators to bring their stories to life.
            </p>
            <div className="space-x-4">
              <Link
                href="/upload"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
              >
                Start Uploading
              </Link>
              <Link
                href="/dashboard"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition inline-block"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-blue-600 rounded-3xl p-8 text-white relative z-10">
              <div className="space-y-4">
                <div className="bg-blue-500 rounded-lg p-4">
                  <div className="h-2 w-24 bg-white/50 rounded mb-2"></div>
                  <div className="h-2 w-32 bg-white/30 rounded"></div>
                </div>
                <div className="bg-blue-500 rounded-lg p-4">
                  <div className="h-2 w-20 bg-white/50 rounded mb-2"></div>
                  <div className="h-2 w-28 bg-white/30 rounded"></div>
                </div>
                <div className="bg-blue-500 rounded-lg p-4">
                  <div className="h-2 w-28 bg-white/50 rounded mb-2"></div>
                  <div className="h-2 w-24 bg-white/30 rounded"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-200 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-600">
              Upload your podcasts with just a few clicks. We handle the storage
              and delivery.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Player</h3>
            <p className="text-gray-600">
              A sleek audio player with all the controls your listeners need for
              the best experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Ready</h3>
            <p className="text-gray-600">
              Track your podcast's performance with our built-in analytics
              dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Podcast Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of creators who trust PodcastVault for their audio content.
          </p>
          <Link
            href="/upload"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            © {new Date().getFullYear()} PodcastVault. All rights reserved.
          </div>
          <div className="space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
