# CivicMind

## Chosen vertical
Election Process Education

## Approach
Gemini 1.5 Flash powered Q&A, augmented with Tavily real-time web search for current electoral data.

## How it works
User logs in with Google via Supabase → asks election questions → Tavily fetches live web context → Gemini generates a grounded answer → full chat history saved to Supabase.

## Assumptions
Primarily focused on Indian general elections but designed to work globally.

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add the following 4 environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   TAVILY_API_KEY=your_tavily_api_key
   ```

3. Setup Supabase:
   - Create a new Supabase project.
   - Enable Google OAuth provider in Authentication settings. Set Authorized Client IDs.
   - Run the following SQL in the SQL Editor to set up tables and RLS:

   ```sql
   -- users table is handled by Supabase Auth

   create table chats (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade,
     title text,
     created_at timestamptz default now()
   );

   create table messages (
     id uuid primary key default gen_random_uuid(),
     chat_id uuid references chats(id) on delete cascade,
     role text check (role in ('user', 'assistant')),
     content text,
     created_at timestamptz default now()
   );

   -- Enable Row Level Security
   alter table chats enable row level security;
   alter table messages enable row level security;

   -- Create RLS Policies
   create policy "Users can read their own chats" on chats for select using (auth.uid() = user_id);
   create policy "Users can insert their own chats" on chats for insert with check (auth.uid() = user_id);
   create policy "Users can update their own chats" on chats for update using (auth.uid() = user_id);
   create policy "Users can delete their own chats" on chats for delete using (auth.uid() = user_id);

   create policy "Users can read their own messages" on messages for select using (
     auth.uid() = (select user_id from chats where id = chat_id)
   );
   create policy "Users can insert messages to their own chats" on messages for insert with check (
     auth.uid() = (select user_id from chats where id = chat_id)
   );
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
