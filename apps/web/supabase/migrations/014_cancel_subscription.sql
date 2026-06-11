-- ── 014  let a user cancel their own Pro subscription ────────────────────────
-- Subscriptions has no user UPDATE policy on purpose (so nobody can self-grant
-- Pro). This security-definer function bypasses RLS but can ONLY downgrade the
-- caller's own row to Free, so it's safe to expose to authenticated users.

create or replace function cancel_subscription()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update subscriptions
     set plan = 'free',
         expires_at = null,
         stripe_subscription_id = null,
         updated_at = now()
   where user_id = auth.uid();

  -- No row yet (shouldn't happen — handle_new_user seeds one) → keep state sane.
  if not found then
    insert into subscriptions (user_id, plan) values (auth.uid(), 'free');
  end if;
end;
$$;

grant execute on function cancel_subscription() to authenticated;
