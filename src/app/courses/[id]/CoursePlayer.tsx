'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LessonItem from '@/components/LessonItem'
import ProgressBar from '@/components/ProgressBar'
import type { Course, Lesson, Progress } from '@/lib/types'

type Props = {
  course: Course & { lessons: Lesson[] }
  userId: string | null
  initialProgress: Record<string, boolean>
}

function getEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch')) {
    const v = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${v}`
  }
  if (url.includes('youtu.be/')) {
    const v = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${v}`
  }
  if (url.includes('vimeo.com/')) {
    const v = url.split('vimeo.com/')[1].split('?')[0]
    return `https://player.vimeo.com/video/${v}`
  }
  return url
}

export default function CoursePlayer({ course, userId, initialProgress }: Props) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(course.lessons?.[0] ?? null)
  const [progress, setProgress] = useState<Record<string, boolean>>(initialProgress)
  const supabase = createClient()

  const completedCount = course.lessons?.filter(l => progress[l.id]).length ?? 0
  const totalCount = course.lessons?.length ?? 0
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleToggleComplete = async (lessonId: string, completed: boolean) => {
    if (!userId) return
    setProgress(prev => ({ ...prev, [lessonId]: completed }))
    await supabase.from('progress').upsert(
      { user_id: userId, lesson_id: lessonId, completed, completed_at: completed ? new Date().toISOString() : null },
      { onConflict: 'user_id,lesson_id' }
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
      <p className="text-gray-500 mb-6">{course.description}</p>

      {userId && totalCount > 0 && (
        <div className="mb-6">
          <ProgressBar value={progressPct} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedLesson ? (
            <div>
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                <iframe
                  src={getEmbedUrl(selectedLesson.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{selectedLesson.title}</h2>
              {selectedLesson.description && (
                <p className="text-gray-500 text-sm">{selectedLesson.description}</p>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Select a lesson to start watching
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1 h-fit">
          <h3 className="font-semibold text-gray-900 mb-3">Lessons</h3>
          {course.lessons?.map(lesson => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isSelected={selectedLesson?.id === lesson.id}
              progress={{ user_id: userId ?? '', lesson_id: lesson.id, completed: progress[lesson.id] ?? false, completed_at: null }}
              onSelect={setSelectedLesson}
              onToggleComplete={handleToggleComplete}
              isLoggedIn={!!userId}
            />
          ))}
          {!course.lessons?.length && <p className="text-sm text-gray-400">No lessons yet.</p>}
        </div>
      </div>
    </div>
  )
}
