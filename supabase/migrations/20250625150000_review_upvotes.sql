-- Migration to create review_upvotes table for review upvoting feature
create table if not exists public.review_upvotes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.reviews(id) on delete cascade,
  session_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (review_id, session_id)
); 