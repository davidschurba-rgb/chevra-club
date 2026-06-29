import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CoursePlayer from './CoursePlayer'

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', id)
    .order('lesson_order', { referencedTable: 'lessons' })
    .single()

  if (!course) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let userProgress: Record<string, boolean> = {}
  if (user && course.lessons?.length) {
    const { data: progress } = await supabase
      .from('progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .in('lesson_id', course.lessons.map((l: { id: string }) => l.id))

    progress?.forEach((p: { lesson_id: string; completed: boolean }) => {
      userProgress[p.lesson_id] = p.completed
    })
  }

  return <CoursePlayer course={course} userId={user?.id ?? null} initialProgress={userProgress} />
}
