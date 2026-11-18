-- Enable real-time notifications when a new private conversation is created.
-- Row-level security remains enforced by the existing participant-only policies.
alter publication supabase_realtime add table public.direct_conversations;
