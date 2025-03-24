-- Enable RLS (Row Level Security)
alter database postgres set timezone to 'UTC';

-- Create tables
create table if not exists public.users (
    id uuid references auth.users on delete cascade not null primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint users_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

create table if not exists public.devices (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    device_type text not null,
    device_id text not null,
    name text,
    last_sync timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, device_id)
);

create table if not exists public.activities (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    device_id uuid references public.devices(id) on delete cascade not null,
    activity_type text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    duration interval not null,
    distance numeric,
    calories numeric,
    average_heart_rate numeric,
    max_heart_rate numeric,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.metrics (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    device_id uuid references public.devices(id) on delete cascade not null,
    metric_type text not null,
    value numeric not null,
    unit text not null,
    timestamp timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.sessions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    device_id uuid references public.devices(id) on delete cascade not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    session_type text not null,
    status text not null default 'active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.devices enable row level security;
alter table public.activities enable row level security;
alter table public.metrics enable row level security;
alter table public.sessions enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

create policy "Users can view their own devices"
    on public.devices for select
    using (auth.uid() = user_id);

create policy "Users can manage their own devices"
    on public.devices for all
    using (auth.uid() = user_id);

create policy "Users can view their own activities"
    on public.activities for select
    using (auth.uid() = user_id);

create policy "Users can manage their own activities"
    on public.activities for all
    using (auth.uid() = user_id);

create policy "Users can view their own metrics"
    on public.metrics for select
    using (auth.uid() = user_id);

create policy "Users can manage their own metrics"
    on public.metrics for all
    using (auth.uid() = user_id);

create policy "Users can view their own sessions"
    on public.sessions for select
    using (auth.uid() = user_id);

create policy "Users can manage their own sessions"
    on public.sessions for all
    using (auth.uid() = user_id);

-- Create indexes
create index if not exists devices_user_id_idx on public.devices(user_id);
create index if not exists activities_user_id_idx on public.activities(user_id);
create index if not exists activities_device_id_idx on public.activities(device_id);
create index if not exists metrics_user_id_idx on public.metrics(user_id);
create index if not exists metrics_device_id_idx on public.metrics(device_id);
create index if not exists sessions_user_id_idx on public.sessions(user_id);
create index if not exists sessions_device_id_idx on public.sessions(device_id);

-- Create triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

create trigger handle_devices_updated_at
    before update on public.devices
    for each row
    execute function public.handle_updated_at();

create trigger handle_activities_updated_at
    before update on public.activities
    for each row
    execute function public.handle_updated_at();

create trigger handle_metrics_updated_at
    before update on public.metrics
    for each row
    execute function public.handle_updated_at();

create trigger handle_sessions_updated_at
    before update on public.sessions
    for each row
    execute function public.handle_updated_at(); 