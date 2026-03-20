-- Venues table
create table if not exists venues (
  id text primary key,
  name text not null,
  address text not null default '',
  suburb text not null default '',
  lat double precision not null,
  lng double precision not null,
  tables_count integer not null default 1,
  tables_brands text[] not null default '{}',
  tables_felt_colour text not null default '',
  tables_felt_notes text not null default '',
  pricing_standard text not null default '',
  pricing_happy_hour text not null default '',
  pricing_free_nights text[] not null default '{}',
  pricing_comp_nights text[] not null default '{}',
  features text[] not null default '{}',
  status text not null default 'unverified' check (status in ('verified', 'unverified', 'closed')),
  source text not null default 'community',
  last_verified date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Submissions table (user-suggested venues awaiting review)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  venue_name text not null,
  address text not null default '',
  suburb text not null default '',
  tables_count integer not null default 1,
  pricing text not null default '',
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Verifications table (community confirmations)
create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references venues(id) on delete cascade,
  verified_at date not null default current_date,
  session_id text not null,
  created_at timestamptz not null default now()
);

-- Index for fast verification lookups
create index if not exists idx_verifications_venue_id on verifications(venue_id);

-- Index for suburb filtering
create index if not exists idx_venues_suburb on venues(suburb);

-- Enable Row Level Security
alter table venues enable row level security;
alter table submissions enable row level security;
alter table verifications enable row level security;

-- Venues: anyone can read
create policy "Venues are publicly readable"
  on venues for select
  using (true);

-- Submissions: anyone can insert, only admins can read/update
create policy "Anyone can submit a venue"
  on submissions for insert
  with check (true);

-- Verifications: anyone can insert and read
create policy "Anyone can verify a venue"
  on verifications for insert
  with check (true);

create policy "Verifications are publicly readable"
  on verifications for select
  using (true);
