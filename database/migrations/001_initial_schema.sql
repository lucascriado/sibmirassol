BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE ministries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(80) NOT NULL UNIQUE,
  color varchar(20) NOT NULL DEFAULT 'gray',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ministries_color_check CHECK (color IN ('blue', 'green', 'gray', 'purple'))
);

CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name varchar(160) NOT NULL,
  email varchar(254) NOT NULL,
  phone varchar(30),
  birth_date date,
  gender varchar(30),
  marital_status varchar(30),
  cpf varchar(14),
  zip_code varchar(9),
  address varchar(200),
  neighborhood varchar(100),
  city varchar(100),
  state varchar(80),
  avatar_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX people_email_unique_idx ON people (lower(email));
CREATE UNIQUE INDEX people_cpf_unique_idx ON people (cpf) WHERE cpf IS NOT NULL;
CREATE INDEX people_name_search_idx ON people (lower(full_name));

CREATE TABLE members (
  person_id uuid PRIMARY KEY REFERENCES people(id) ON DELETE CASCADE,
  ministry_id uuid REFERENCES ministries(id) ON DELETE SET NULL,
  role varchar(80) NOT NULL DEFAULT 'Membro Comum',
  status varchar(20) NOT NULL DEFAULT 'active',
  baptism_status varchar(20) NOT NULL DEFAULT 'waiting',
  baptism_date date,
  admission_date date NOT NULL DEFAULT CURRENT_DATE,
  is_new boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT members_status_check CHECK (status IN ('active', 'inactive')),
  CONSTRAINT members_baptism_status_check CHECK (baptism_status IN ('baptized', 'waiting'))
);

CREATE INDEX members_ministry_idx ON members (ministry_id);
CREATE INDEX members_status_idx ON members (status);
CREATE INDEX members_baptism_status_idx ON members (baptism_status);

CREATE TABLE visitors (
  person_id uuid PRIMARY KEY REFERENCES people(id) ON DELETE CASCADE,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  invited_by varchar(160) NOT NULL DEFAULT 'Espontâneo',
  follow_up_status varchar(30) NOT NULL DEFAULT 'waiting_contact',
  is_recent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT visitors_follow_up_status_check CHECK (
    follow_up_status IN ('waiting_contact', 'following_up', 'integrated')
  )
);

CREATE INDEX visitors_visit_date_idx ON visitors (visit_date DESC);
CREATE INDEX visitors_follow_up_status_idx ON visitors (follow_up_status);
CREATE INDEX visitors_invited_by_idx ON visitors (lower(invited_by));

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER ministries_set_updated_at BEFORE UPDATE ON ministries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER people_set_updated_at BEFORE UPDATE ON people
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER members_set_updated_at BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER visitors_set_updated_at BEFORE UPDATE ON visitors
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
