-- SQL Script to set up the contact requests and users tables in Supabase
-- Run this script in the Supabase Dashboard SQL Editor

-- ==========================================================
-- 1. CONTACT REQUESTS TABLE
-- ==========================================================
create table if not exists contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table contact_requests enable row level security;

-- Drop policies if they already exist (to avoid rerun errors)
drop policy if exists "Allow anonymous inserts" on contact_requests;
drop policy if exists "Allow all access to service_role" on contact_requests;

-- Create policy to allow anyone to insert messages (anonymous visitors)
create policy "Allow anonymous inserts" on contact_requests
  for insert with check (true);

-- Create policy to allow all actions for the service role
create policy "Allow all access to service_role" on contact_requests
  for all using (true) with check (true);

-- ==========================================================
-- 2. PORTFOLIO USERS TABLE (Admin & Guest Login)
-- ==========================================================
create table if not exists portfolio_users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  password text not null,
  role text default 'guest'::text not null check (role in ('admin', 'guest')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for portfolio_users
alter table portfolio_users enable row level security;

-- Drop policies if they already exist (to avoid rerun errors)
drop policy if exists "Allow all access to service_role" on portfolio_users;

-- Create policy to allow all actions for the service role
create policy "Allow all access to service_role" on portfolio_users
  for all using (true) with check (true);

-- Insert default accounts (username / password / role)
insert into portfolio_users (username, password, role)
values 
  ('admin', 'admin123', 'admin'),
  ('guest', 'guest123', 'guest')
on conflict (username) do nothing;
