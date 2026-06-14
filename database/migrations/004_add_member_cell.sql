BEGIN;

ALTER TABLE members
ADD COLUMN cell_name varchar(120) NOT NULL DEFAULT 'Sem célula';

UPDATE members m
SET cell_name = data.cell_name
FROM (
  VALUES
    ('ana.clara@email.com', 'Célula Esperança'),
    ('marcos.santos@email.com', 'Célula Graça'),
    ('julia.p@email.com', 'Sem célula'),
    ('mendes.r@email.com', 'Célula Família'),
    ('bia.lima@email.com', 'Célula Esperança'),
    ('gabriel.s@email.com', 'Célula Jovens'),
    ('carla.m@email.com', 'Célula Graça'),
    ('paulo.h@email.com', 'Célula Família'),
    ('larissa.f@email.com', 'Célula Jovens'),
    ('daniel.r@email.com', 'Célula Esperança'),
    ('mariana.t@email.com', 'Sem célula'),
    ('felipe.c@email.com', 'Célula Graça'),
    ('eduarda.s@email.com', 'Célula Família'),
    ('rafael.a@email.com', 'Célula Jovens'),
    ('natalia.c@email.com', 'Célula Esperança'),
    ('vinicius.c@email.com', 'Sem célula'),
    ('isabela.s@email.com', 'Célula Graça'),
    ('henrique.o@email.com', 'Célula Família')
) AS data(email, cell_name)
JOIN people p ON lower(p.email) = lower(data.email)
WHERE m.person_id = p.id;

CREATE INDEX members_cell_name_idx ON members (lower(cell_name));

CREATE OR REPLACE VIEW member_directory AS
SELECT
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.birth_date,
  p.gender,
  p.marital_status,
  p.cpf,
  p.zip_code,
  p.address,
  p.neighborhood,
  p.city,
  p.state,
  p.avatar_url,
  p.notes,
  COALESCE(mi.name, 'Nenhum') AS ministry,
  COALESCE(mi.color, 'gray') AS ministry_color,
  m.role,
  m.status,
  m.baptism_status,
  m.baptism_date,
  m.admission_date,
  m.is_new,
  m.created_at,
  m.updated_at,
  m.cell_name
FROM members m
JOIN people p ON p.id = m.person_id
LEFT JOIN ministries mi ON mi.id = m.ministry_id;

COMMIT;
