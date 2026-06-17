BEGIN;

ALTER TABLE people
  ADD CONSTRAINT people_avatar_url_base64_check
  CHECK (
    avatar_url IS NULL OR (
      length(avatar_url) <= 122880
      AND avatar_url ~ '^data:image/(png|jpeg);base64,[A-Za-z0-9+/=]+$'
    )
  ) NOT VALID;

COMMIT;
