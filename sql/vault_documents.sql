create extension if not exists vector;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  file_name text not null default '',
  doc_type text not null default 'other',
  source text not null default 'vault-upload',
  status text not null default 'received',
  storage_path text not null default '',
  raw_text text not null default '',
  summary text not null default '',
  extracted_facts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chunk_index integer not null,
  content text not null default '',
  token_count integer not null default 0,
  page_ref text not null default '',
  section_label text not null default '',
  embedding vector(1536),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  stage text not null default 'ingest',
  status text not null default 'pending',
  error text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists document_chunks_document_chunk_idx
on public.document_chunks (document_id, chunk_index);

create index if not exists documents_user_created_idx
on public.documents (user_id, created_at desc);

create index if not exists documents_type_status_idx
on public.documents (user_id, doc_type, status);

create index if not exists document_chunks_user_document_idx
on public.document_chunks (user_id, document_id, chunk_index);

create index if not exists document_jobs_document_created_idx
on public.document_jobs (document_id, created_at desc);

create or replace function public.telaj_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
before update on public.documents
for each row
execute function public.telaj_set_updated_at();

alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.document_jobs enable row level security;

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own"
on public.documents
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
on public.documents
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "document_chunks_select_own" on public.document_chunks;
create policy "document_chunks_select_own"
on public.document_chunks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "document_chunks_insert_own" on public.document_chunks;
create policy "document_chunks_insert_own"
on public.document_chunks
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "document_jobs_select_own" on public.document_jobs;
create policy "document_jobs_select_own"
on public.document_jobs
for select
to authenticated
using (
  exists (
    select 1
    from public.documents d
    where d.id = document_jobs.document_id
      and d.user_id = auth.uid()
  )
);

drop policy if exists "document_jobs_insert_own" on public.document_jobs;
create policy "document_jobs_insert_own"
on public.document_jobs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.documents d
    where d.id = document_jobs.document_id
      and d.user_id = auth.uid()
  )
);
