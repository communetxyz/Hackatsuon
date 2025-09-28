-- Remove the unique constraint that prevents multiple votes from same IP
-- This allows users to vote multiple times from the same IP address

-- Drop the existing unique constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_project_id_voter_ip_key;

-- The table will now allow multiple votes from the same IP for the same project
-- while still recording the IP address for tracking purposes
