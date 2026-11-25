-- Jalankan sekali di Supabase > SQL Editor.
-- Auth users dibuat manual oleh admin melalui Authentication > Users > Add user.
create table if not exists public.bloom_device_locks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  device_id text not null,
  created_at timestamptz not null default now()
);
alter table public.bloom_device_locks enable row level security;
revoke all on public.bloom_device_locks from anon, authenticated;

create or replace function public.claim_bloom_device(p_device_id text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare current_user_id uuid := auth.uid();
declare saved_device text;
begin
  if current_user_id is null or p_device_id is null or length(p_device_id) < 8 then return false; end if;
  insert into public.bloom_device_locks(user_id, device_id)
  values (current_user_id, p_device_id)
  on conflict (user_id) do nothing;
  select device_id into saved_device from public.bloom_device_locks where user_id = current_user_id;
  return saved_device = p_device_id;
end;
$$;
revoke all on function public.claim_bloom_device(text) from public;
grant execute on function public.claim_bloom_device(text) to authenticated;
