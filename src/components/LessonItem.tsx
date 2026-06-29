'use client'

import type { Lesson, Progress } from '@/lib/types'

type Props = {
  lesson: Lesson
  isSelected: boolean
  progress?: Progress
  onSelect: (lesson: Lesson) => void
  onToggleComplete: (lessonId: string, completed: boolean) => void
  isLoggedIn: boolean
}

export default function LessonItem({ lesson, isSelected, progress, onSelect, onToggleComplete, isLoggedIn }: Props) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'}`}
      onClick={() => onSelect(lesson)}
    >
      {isLoggedIn && (
        <input
          type="checkbox"
          checked={progress?.completed ?? false}
          onChange={(e) => {
            e.stopPropagation()
            onToggleComplete(lesson.id, e.target.checked)
          }}
          className="w-4 h-4 accent-indigo-600 shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
          {lesson.lesson_order}. {lesson.title}
        </p>
      </div>
      {progress?.completed && (
        <span className="text-xs text-green-600 font-medium shrink-0">✓ Done</span>
      )}
    </div>
  )
}
