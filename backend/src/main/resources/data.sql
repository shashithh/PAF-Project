-- Seed data for development — mirrors the frontend mock bookings
-- Runs automatically on startup when spring.jpa.hibernate.ddl-auto=create-drop

INSERT INTO bookings (user_id, user_name, resource_id, resource_name, date, start_time, end_time, purpose, status, created_at) VALUES
('u1','Alice Tan',  'r1','Computer Lab A',      '2026-04-20','09:00','11:00','Final year project — frontend integration sprint','APPROVED', '2026-04-15T08:30:00'),
('u1','Alice Tan',  'r3','Conference Room 101', '2026-04-22','14:00','15:30','Capstone project team sync — milestone review',  'PENDING',  '2026-04-16T10:00:00'),
('u1','Alice Tan',  'r5','Projector Kit #3',    '2026-04-25','10:00','12:00','Presentation rehearsal for CS401 demo day',      'PENDING',  '2026-04-17T09:15:00'),
('u1','Alice Tan',  'r2','Computer Lab B',      '2026-04-10','13:00','15:00','Database assignment — group session',            'APPROVED', '2026-04-07T11:00:00'),
('u1','Alice Tan',  'r4','Physics Lab',         '2026-04-08','08:00','10:00','Lab report experiment — optics module',          'CANCELLED','2026-04-05T14:20:00'),
('u1','Alice Tan',  'r3','Conference Room 101', '2026-04-28','16:00','17:00','Mock interview practice with career advisor',    'APPROVED', '2026-04-18T08:00:00'),
('u2','Bob Lim',    'r2','Computer Lab B',      '2026-04-22','10:00','12:00','Data structures lab — binary tree implementation','REJECTED', '2026-04-14T09:00:00'),
('u2','Bob Lim',    'r1','Computer Lab A',      '2026-04-23','14:00','16:00','Machine learning assignment — model training',   'PENDING',  '2026-04-17T15:30:00'),
('u2','Bob Lim',    'r4','Physics Lab',         '2026-04-11','09:00','11:30','Electromagnetic induction experiment',           'APPROVED', '2026-04-08T10:00:00'),
('u2','Bob Lim',    'r5','Projector Kit #3',    '2026-04-30','11:00','12:00','Club recruitment presentation — Robotics Society','PENDING', '2026-04-18T11:45:00'),
('u3','Carol Ng',   'r3','Conference Room 101', '2026-04-21','09:00','10:00','Study group — Advanced Algorithms revision',     'APPROVED', '2026-04-15T13:00:00'),
('u3','Carol Ng',   'r1','Computer Lab A',      '2026-04-24','15:00','17:00','Web development project — React component testing','PENDING','2026-04-18T09:30:00'),
('u3','Carol Ng',   'r2','Computer Lab B',      '2026-04-09','10:00','11:00','Operating systems tutorial — process scheduling','APPROVED', '2026-04-06T08:00:00'),
('u3','Carol Ng',   'r4','Physics Lab',         '2026-04-29','13:00','15:00','Thermodynamics experiment — heat transfer lab',  'REJECTED', '2026-04-17T16:00:00'),
('u4','David Koh',  'r5','Projector Kit #3',    '2026-04-21','13:00','14:00','Entrepreneurship pitch deck — startup competition','APPROVED','2026-04-14T12:00:00'),
('u4','David Koh',  'r3','Conference Room 101', '2026-04-26','10:00','11:30','Internship interview preparation — mock session', 'PENDING', '2026-04-18T14:00:00'),
('u4','David Koh',  'r1','Computer Lab A',      '2026-04-07','11:00','13:00','Network security assignment — packet analysis',  'CANCELLED','2026-04-04T09:00:00'),
('u4','David Koh',  'r2','Computer Lab B',      '2026-05-02','09:00','11:00','Final exam revision — compiler design',          'PENDING',  '2026-04-18T16:30:00');
