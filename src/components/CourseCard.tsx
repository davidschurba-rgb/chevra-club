import Link from 'next/link'
import type { Course } from '@/lib/types'

type Props = {
  course: Course
  progress?: number
}

export default function CourseCard({ course, progress }: Props) {
  return (
    <Link href={`/courses/${course.id}`} className="block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🎓</div>
        )}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${course.is_paid ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
          {course.is_paid ? `$${course.price}` : 'Free'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
