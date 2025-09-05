-- Supabase schema for CARRE Quotes CRM (identique au message assistant)
create extension if not exists pgcrypto;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  created_at timestamptz default now()
);
alter table public.services enable row level security;
create policy "svc_select" on public.services for select using (auth.uid() = user_id);
create policy "svc_insert" on public.services for insert with check (auth.uid() = user_id);
create policy "svc_update" on public.services for update using (auth.uid() = user_id);
create policy "svc_delete" on public.services for delete using (auth.uid() = user_id);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  address text,
  created_at timestamptz default now()
);
alter table public.clients enable row level security;
create policy "cli_select" on public.clients for select using (auth.uid() = user_id);
create policy "cli_insert" on public.clients for insert with check (auth.uid() = user_id);
create policy "cli_update" on public.clients for update using (auth.uid() = user_id);
create policy "cli_delete" on public.clients for delete using (auth.uid() = user_id);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  number text not null,
  date timestamptz default now(),
  status text not null default 'draft' check (status in ('draft','sent','accepted','refused')),
  currency text not null default 'EUR',
  vat_rate numeric(5,2) default 20,
  discount numeric(12,2) default 0,
  subtotal numeric(12,2) default 0,
  vat_amount numeric(12,2) default 0,
  total numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now(),
  unique (user_id, number)
);
alter table public.quotes enable row level security;
create policy "qte_select" on public.quotes for select using (auth.uid() = user_id);
create policy "qte_insert" on public.quotes for insert with check (auth.uid() = user_id);
create policy "qte_update" on public.quotes for update using (auth.uid() = user_id);
create policy "qte_delete" on public.quotes for delete using (auth.uid() = user_id);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  service_id uuid references public.services(id),
  name text not null,
  description text,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0
);
alter table public.quote_items enable row level security;
create policy "qti_select" on public.quote_items
for select using (
  exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = auth.uid())
);
create policy "qti_mut" on public.quote_items
for all using (
  exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = auth.uid())
) with check (
  exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = auth.uid())
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  number text not null,
  date timestamptz default now(),
  due_date timestamptz,
  status text not null default 'draft' check (status in ('draft','sent','paid','overdue')),
  currency text not null default 'EUR',
  vat_rate numeric(5,2) default 20,
  discount numeric(12,2) default 0,
  subtotal numeric(12,2) default 0,
  vat_amount numeric(12,2) default 0,
  total numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now(),
  unique (user_id, number)
);
alter table public.invoices enable row level security;
create policy "inv_select" on public.invoices for select using (auth.uid() = user_id);
create policy "inv_insert" on public.invoices for insert with check (auth.uid() = user_id);
create policy "inv_update" on public.invoices for update using (auth.uid() = user_id);
create policy "inv_delete" on public.invoices for delete using (auth.uid() = user_id);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  name text not null,
  description text,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0
);
alter table public.invoice_items enable row level security;
create policy "ini_select" on public.invoice_items
for select using (
  exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
);
create policy "ini_mut" on public.invoice_items
for all using (
  exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
) with check (
  exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
);

create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  quote_prefix text,
  invoice_prefix text,
  vat_default numeric(5,2) default 20
);
alter table public.settings enable row level security;
create policy "stg_rw" on public.settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.counters (
  user_id uuid primary key references auth.users(id) on delete cascade,
  quote_counter int default 0,
  invoice_counter int default 0
);
alter table public.counters enable row level security;
create policy "ctr_rw" on public.counters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
