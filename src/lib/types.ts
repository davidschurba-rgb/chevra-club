export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  is_paid: boolean
  price: number | null
  created_at: string
  lessons?: Lesson[]
}

export type Lesson = {
  id: string
  course_id: string
  title: string
  video_url: string
  lesson_order: number
  description: string | null
}

export type Progress = {
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
}
