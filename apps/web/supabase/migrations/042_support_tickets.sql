-- Migration 042: Support tickets — users send a subject + details, see their
-- history, and read the admin's reply. Admins see every ticket and reply to it.
-- One admin reply per ticket (status: open → answered). Run in Supabase SQL
-- Editor (safe to re-run). Depends on the is_admin(uuid) helper (already added
-- by an earlier migration, used by lesson_feedback policies).

create table if not exists support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  subject     text not null check (char_length(subject) between 3 and 200),
  detail      text not null check (char_length(detail)  between 1 and 5000),
  status      text not null default 'open' check (status in ('open','answered','closed')),
  admin_reply text check (admin_reply is null or char_length(admin_reply) <= 5000),
  replied_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- A user's history, newest first; and an admin inbox of open tickets.
create index if not exists support_tickets_user_idx   on support_tickets (user_id, created_at desc);
create index if not exists support_tickets_status_idx on support_tickets (status, created_at desc);

alter table support_tickets enable row level security;

-- Idempotent policy block (CREATE POLICY has no IF NOT EXISTS).
drop policy if exists "users read own tickets"   on support_tickets;
drop policy if exists "users insert own tickets" on support_tickets;
drop policy if exists "admins read all tickets"  on support_tickets;
drop policy if exists "admins update tickets"    on support_tickets;

-- Users manage only their own tickets (read + create). They never update a row,
-- so they can't write admin_reply/status themselves.
create policy "users read own tickets"   on support_tickets for select using (auth.uid() = user_id);
create policy "users insert own tickets" on support_tickets for insert with check (auth.uid() = user_id);

-- Admins read every ticket and update it (to reply / change status).
create policy "admins read all tickets" on support_tickets for select using (is_admin(auth.uid()));
create policy "admins update tickets"   on support_tickets for update using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
