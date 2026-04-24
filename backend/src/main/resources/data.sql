-- ============================================================
-- Smart Campus – Module A: Sample Seed Data
-- This file runs on startup via Spring's sql.init mechanism.
-- It uses INSERT IGNORE so existing rows are not duplicated.
-- ============================================================

INSERT IGNORE INTO resources (
    resource_code, resource_name, resource_type, capacity,
    location, available_from, available_to, status, description,
    created_at, updated_at
) VALUES
('LH-001', 'Main Auditorium', 'LECTURE_HALL', 300,
 'Block A, Ground Floor', '07:30:00', '21:00:00', 'ACTIVE',
 'Large lecture hall with projector, whiteboard, and air conditioning.',
 NOW(), NOW()),

('LH-002', 'Lecture Hall B2', 'LECTURE_HALL', 120,
 'Block B, Second Floor', '08:00:00', '20:00:00', 'ACTIVE',
 'Medium-sized lecture hall with smart board.',
 NOW(), NOW()),

('LAB-001', 'Computer Lab 01', 'LAB', 40,
 'IT Block, First Floor', '08:00:00', '18:00:00', 'ACTIVE',
 '40 workstations with high-speed internet. Suitable for programming practicals.',
 NOW(), NOW()),

('LAB-002', 'Electronics Lab', 'LAB', 30,
 'Engineering Block, Ground Floor', '08:00:00', '17:00:00', 'OUT_OF_SERVICE',
 'Currently under maintenance. Expected to reopen next semester.',
 NOW(), NOW()),

('MR-001', 'Board Room', 'MEETING_ROOM', 20,
 'Admin Building, Third Floor', '09:00:00', '17:00:00', 'ACTIVE',
 'Executive meeting room with video conferencing setup.',
 NOW(), NOW()),

('MR-002', 'Staff Meeting Room', 'MEETING_ROOM', 12,
 'Block C, Second Floor', '08:00:00', '19:00:00', 'ACTIVE',
 'Comfortable meeting room for staff discussions.',
 NOW(), NOW()),

('EQ-001', 'Epson Projector #1', 'PROJECTOR', 1,
 'Equipment Room, Block A', '07:00:00', '22:00:00', 'ACTIVE',
 'Full HD Epson projector. Available for borrowing by academic staff.',
 NOW(), NOW()),

('EQ-002', 'Sony 4K Camera', 'CAMERA', 1,
 'Media Lab, Block D', '09:00:00', '17:00:00', 'ACTIVE',
 'Sony ZV-E10 camera for recording lectures and events.',
 NOW(), NOW()),

('EQ-003', 'Portable Projector #2', 'PROJECTOR', 1,
 'Equipment Room, Block B', '07:00:00', '22:00:00', 'OUT_OF_SERVICE',
 'Lamp needs replacement. Currently out of service.',
 NOW(), NOW()),

('OTH-001', 'Student Lounge Area', 'OTHER', 80,
 'Main Building, Ground Floor', '06:00:00', '23:00:00', 'ACTIVE',
 'Open lounge area for student group work and informal meetings.',
 NOW(), NOW());
