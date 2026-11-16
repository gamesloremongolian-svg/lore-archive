-- The function is invoked by the AFTER INSERT trigger only.
-- Remove direct API execution while preserving trigger operation.
REVOKE EXECUTE ON FUNCTION public.handle_support_ticket_reply() FROM PUBLIC, anon, authenticated;
