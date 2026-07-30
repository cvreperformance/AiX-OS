-- Migration: Create get_unprocessed_events RPC function
-- File: supabase/migrations/20260731_get_unprocessed_events.sql

create or replace function public.get_unprocessed_events(limit_val int default 100)
returns setof public.aix_events
language sql
security definer
as $$
  select e.*
  from public.aix_events e
  where not exists (
    select 1
    from public.notification_delivery_log d
    where d.event_id = e.id
  )
  order by e.created_at asc
  limit limit_val;
$$;
