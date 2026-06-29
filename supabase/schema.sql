-- Run this in the Supabase SQL editor

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Courses
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null default '',
  thumbnail_url text,
  is_paid boolean not null default false,
  price numeric(10,2),
  created_at timestamptz default now()
);
alter table public.courses enable row level security;
create policy "Courses are publicly readable" on public.courses for select using (true);
create policy "Only admins can manage courses" on public.courses for all using (auth.jwt()->>'email' = current_setting('app.admin_email', true));

-- Lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  video_url text not null,
  lesson_order int not null default 0,
  description text
);
alter table public.lessons enable row level security;
create policy "Lessons are publicly readable" on public.lessons for select using (true);
create policy "Only admins can manage lessons" on public.lessons for all using (auth.jwt()->>'email' = current_setting('app.admin_email', true));

-- Progress
create table public.progress (
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  completed boolean not null default false,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);
alter table public.progress enable row level security;
create policy "Users can manage their own progress" on public.progress for all using (auth.uid() = user_id);
