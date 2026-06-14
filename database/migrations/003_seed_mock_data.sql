BEGIN;

INSERT INTO ministries (name, color) VALUES
  ('Louvor', 'blue'),
  ('Missões', 'green'),
  ('Acolhimento', 'purple'),
  ('Infantil', 'purple')
ON CONFLICT (name) DO UPDATE SET color = EXCLUDED.color;

INSERT INTO people (full_name, email) VALUES
  ('Ana Clara Oliveira', 'ana.clara@email.com'),
  ('Marcos Santos', 'marcos.santos@email.com'),
  ('Julia Pereira', 'julia.p@email.com'),
  ('Ricardo Mendes', 'mendes.r@email.com'),
  ('Beatriz Lima', 'bia.lima@email.com'),
  ('Gabriel Souza', 'gabriel.s@email.com'),
  ('Carla Martins', 'carla.m@email.com'),
  ('Paulo Henrique', 'paulo.h@email.com'),
  ('Larissa Freitas', 'larissa.f@email.com'),
  ('Daniel Rocha', 'daniel.r@email.com'),
  ('Mariana Teixeira', 'mariana.t@email.com'),
  ('Felipe Costa', 'felipe.c@email.com'),
  ('Eduarda Silva', 'eduarda.s@email.com'),
  ('Rafael Alves', 'rafael.a@email.com'),
  ('Natália Cardoso', 'natalia.c@email.com'),
  ('Vinícius Carvalho', 'vinicius.c@email.com'),
  ('Isabela Santos', 'isabela.s@email.com'),
  ('Henrique Oliveira', 'henrique.o@email.com'),
  ('Ricardo Lima', 'ricardo.lima@email.com'),
  ('Mariana Souza', 'mari.souza@email.com'),
  ('Fernando Borges', 'fborges@email.com'),
  ('Clara Pereira', 'clara.p@email.com'),
  ('André Martins', 'andre.m@email.com'),
  ('Letícia Costa', 'leticia.c@email.com'),
  ('João Vitor', 'joao.v@email.com'),
  ('Bianca Santos', 'bianca.s@email.com'),
  ('Gustavo Melo', 'gustavo.m@email.com'),
  ('Tainá Alves', 'taina.a@email.com'),
  ('Renata Barbosa', 'renata.b@email.com'),
  ('Diego Nunes', 'diego.n@email.com')
ON CONFLICT ((lower(email))) DO UPDATE SET full_name = EXCLUDED.full_name;

INSERT INTO members (
  person_id, ministry_id, status, baptism_status, admission_date, is_new
)
SELECT
  p.id,
  mi.id,
  data.status,
  data.baptism_status,
  data.admission_date,
  data.is_new
FROM (
  VALUES
    ('ana.clara@email.com', 'Louvor', 'active', 'baptized', DATE '2021-05-15', false),
    ('marcos.santos@email.com', 'Missões', 'active', 'baptized', DATE '2020-01-10', false),
    ('julia.p@email.com', NULL, 'inactive', 'waiting', DATE '2023-08-22', false),
    ('mendes.r@email.com', 'Acolhimento', 'active', 'baptized', DATE '2019-04-05', false),
    ('bia.lima@email.com', 'Infantil', 'active', 'baptized', DATE '2022-02-18', true),
    ('gabriel.s@email.com', 'Louvor', 'active', 'waiting', DATE '2024-03-03', true),
    ('carla.m@email.com', 'Missões', 'active', 'baptized', DATE '2018-09-11', false),
    ('paulo.h@email.com', 'Acolhimento', 'inactive', 'baptized', DATE '2017-06-29', false),
    ('larissa.f@email.com', 'Infantil', 'active', 'waiting', DATE '2024-05-07', true),
    ('daniel.r@email.com', 'Louvor', 'active', 'baptized', DATE '2020-11-14', false),
    ('mariana.t@email.com', NULL, 'active', 'waiting', DATE '2024-04-23', true),
    ('felipe.c@email.com', 'Missões', 'inactive', 'baptized', DATE '2016-07-17', false),
    ('eduarda.s@email.com', 'Acolhimento', 'active', 'baptized', DATE '2021-10-09', false),
    ('rafael.a@email.com', 'Louvor', 'active', 'waiting', DATE '2024-05-28', true),
    ('natalia.c@email.com', 'Infantil', 'active', 'baptized', DATE '2019-12-12', false),
    ('vinicius.c@email.com', NULL, 'inactive', 'waiting', DATE '2023-01-06', false),
    ('isabela.s@email.com', 'Missões', 'active', 'baptized', DATE '2022-08-19', false),
    ('henrique.o@email.com', 'Acolhimento', 'active', 'waiting', DATE '2024-05-02', true)
) AS data(email, ministry, status, baptism_status, admission_date, is_new)
JOIN people p ON lower(p.email) = lower(data.email)
LEFT JOIN ministries mi ON mi.name = data.ministry
ON CONFLICT (person_id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id,
  status = EXCLUDED.status,
  baptism_status = EXCLUDED.baptism_status,
  admission_date = EXCLUDED.admission_date,
  is_new = EXCLUDED.is_new;

INSERT INTO visitors (
  person_id, visit_date, invited_by, follow_up_status, is_recent
)
SELECT
  p.id,
  data.visit_date,
  data.invited_by,
  data.follow_up_status,
  data.is_recent
FROM (
  VALUES
    ('ricardo.lima@email.com', DATE '2024-05-15', 'Pr. Anderson', 'waiting_contact', true),
    ('mari.souza@email.com', DATE '2024-05-12', 'Espontâneo', 'following_up', true),
    ('fborges@email.com', DATE '2024-05-05', 'Lucas Santos', 'integrated', true),
    ('clara.p@email.com', DATE '2024-05-15', 'Marta Oliveira', 'waiting_contact', true),
    ('andre.m@email.com', DATE '2024-04-28', 'Paulo Henrique', 'following_up', false),
    ('leticia.c@email.com', DATE '2024-04-21', 'Ana Clara', 'integrated', false),
    ('joao.v@email.com', DATE '2024-04-14', 'Espontâneo', 'waiting_contact', false),
    ('bianca.s@email.com', DATE '2024-04-07', 'Marcos Santos', 'following_up', false),
    ('gustavo.m@email.com', DATE '2024-03-31', 'Ricardo Mendes', 'integrated', false),
    ('taina.a@email.com', DATE '2024-03-24', 'Marta Oliveira', 'waiting_contact', false),
    ('renata.b@email.com', DATE '2024-03-17', 'Pr. Anderson', 'following_up', false),
    ('diego.n@email.com', DATE '2024-03-10', 'Espontâneo', 'integrated', false)
) AS data(email, visit_date, invited_by, follow_up_status, is_recent)
JOIN people p ON lower(p.email) = lower(data.email)
ON CONFLICT (person_id) DO UPDATE SET
  visit_date = EXCLUDED.visit_date,
  invited_by = EXCLUDED.invited_by,
  follow_up_status = EXCLUDED.follow_up_status,
  is_recent = EXCLUDED.is_recent;

COMMIT;
