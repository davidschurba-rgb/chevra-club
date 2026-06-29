import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Welcome to <span className="text-indigo-600">Chevra Club</span>
      </h1>
      <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
        High-quality courses for your community. Learn at your own pace.
      </p>
      <Link href="/courses" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors">
        Browse Courses
      </Link>
    </div>
  )
}
