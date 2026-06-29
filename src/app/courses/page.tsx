import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/CourseCard'
import type { Course, Progress } from '@/lib/types'

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: courses } = await supabase.from('courses').select('*').order('created_at', { ascending: false })

  let progressMap: Record<string, number> = {}

  if (user && courses) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, course_id')
      .in('course_id', courses.map((c: Course) => c.id))

    const { data: progress } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)

    if (lessons && progress) {
      const completedSet = new Set((progress as Progress[]).map(p => p.lesson_id))
      courses.forEach((course: Course) => {
        const courseLessons = lessons.filter((l: { id: string; course_id: string }) => l.course_id === course.id)
        if (courseLessons.length > 0) {
          const completed = courseLessons.filter((l: { id: string }) => completedSet.has(l.id)).length
          progressMap[course.id] = Math.round((completed / courseLessons.length) * 100)
        }
      })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Courses</h1>
      {!courses || courses.length === 0 ? (
        <p className="text-gray-500">No courses yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => (
            <CourseCard key={course.id} course={course} progress={user ? progressMap[course.id] : undefined} />
          ))}
        </div>
      )}
    </div>
  )
}
