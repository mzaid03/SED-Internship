# Tasklee – Task Manager Assessment (Final Deliverable)

Export/submit as:
- `firstname_lastname_task_manager_assessment.pdf` (or `.docx`)

## 1) Overview
Tasklee is a simple task manager web app built with Next.js (TypeScript) and Supabase.

Core features:
- Create tasks, view tasks, toggle complete/incomplete
- Guest accounts (Supabase anonymous sign-in) created automatically on first load
- Tasks are scoped per user via `user_id`
- Row Level Security (RLS) policies enforce that users can only read/write their own tasks
- Clear loading states and error states

Optional/bonus fields supported:
- Description
- Priority (`low` / `normal` / `high`)
- Due date

## 2) Live Frontend App
- Live URL: <PASTE_YOUR_VERCEL_URL_HERE>

## 3) GitHub Repository
- Repo URL: https://github.com/mzaid03/taskly.git

## 4) Supabase Project / Table
- Supabase Project URL (dashboard link is fine): <PASTE_YOUR_SUPABASE_PROJECT_URL_HERE>
- Table: `public.tasks`

## 5) Local Setup Instructions

### Prerequisites
- Node.js installed
- A Supabase project (Free Tier)

### Steps
1. Install dependencies:
   - `npm.cmd install`

2. Enable anonymous guest sign-in:
   - Supabase → Authentication → Providers → Anonymous → Enable

3. Create the database schema + RLS policies:
   - Supabase → SQL Editor → run the SQL from `supabase/schema.sql`

4. Configure environment variables:
   - Copy `.env.example` → `.env.local`
   - Set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Start the dev server:
   - `npm.cmd run dev`

6. Open the app:
   - http://localhost:3000

## 6) Database Schema

The schema is implemented in `supabase/schema.sql`.

### Table
`public.tasks` fields:
- `id` uuid primary key
- `user_id` uuid (ties each task to the authenticated guest user)
- `title` text (required)
- `description` text (optional)
- `priority` text with constraint (`low|normal|high`), default `normal`
- `due_date` date (optional)
- `is_complete` boolean default `false`
- `created_at` timestamp default `now()`

### RLS Policies
RLS is enabled on `public.tasks`, with policies that ensure:
- Users can only SELECT rows where `user_id = auth.uid()`
- Users can only INSERT rows where `user_id = auth.uid()`
- Users can only UPDATE rows where `user_id = auth.uid()`
- (Optional) Users can only DELETE rows where `user_id = auth.uid()`

## 7) Tradeoffs / Improvements
- Add edit/delete task and better task organization (filters by status, priority, due date)
- Add pagination/infinite scroll for large lists
- Add optimistic UI updates and offline-friendly behavior
- Add end-to-end tests (Playwright) + CI pipeline
- Add better accessibility polish (keyboard navigation, ARIA labels)

## 8) Security Notes
- The frontend uses only the Supabase **anon/public** key.
- The Supabase **service role key is never used in the browser** and must not be committed.
- RLS is the primary security boundary: even if a user tampers with requests, Postgres policies prevent cross-user access.
