-- Additional sample data for testing different scenarios

DO $$
DECLARE
    demo_user_id INTEGER;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@example.com';
    
    -- Insert more diverse tasks for better testing
    INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, importance, progress, reorganizable, strict, notes) VALUES
    (demo_user_id, 'Plan vacation', 'Research and book summer vacation', 'Personal', 'Low', 'Todo', CURRENT_TIMESTAMP + INTERVAL '30 days', 2, 0, true, false, 'Consider Europe or Asia'),
    (demo_user_id, 'Fix kitchen sink', 'Repair leaky kitchen faucet', 'Home', 'High', 'Todo', CURRENT_TIMESTAMP + INTERVAL '3 days', 8, 0, true, false, 'Need to buy replacement parts'),
    (demo_user_id, 'Learn new programming language', 'Start Rust programming course', 'Learning', 'Medium', 'In Progress', CURRENT_TIMESTAMP + INTERVAL '60 days', 6, 25, true, false, 'Completed first 3 chapters'),
    (demo_user_id, 'Organize digital photos', 'Sort and backup family photos', 'Personal', 'Low', 'Todo', CURRENT_TIMESTAMP + INTERVAL '21 days', 3, 0, true, false, 'Use Google Photos for backup'),
    (demo_user_id, 'Prepare tax documents', 'Gather documents for tax filing', 'Finance', 'High', 'In Progress', CURRENT_TIMESTAMP + INTERVAL '45 days', 9, 40, false, true, 'Deadline is April 15th'),
    (demo_user_id, 'Call mom', 'Weekly check-in call with family', 'Personal', 'Medium', 'Todo', CURRENT_TIMESTAMP + INTERVAL '2 days', 7, 0, true, false, 'She mentioned wanting to video chat'),
    (demo_user_id, 'Update LinkedIn profile', 'Add recent work experience', 'Career', 'Low', 'Todo', CURRENT_TIMESTAMP + INTERVAL '20 days', 4, 0, true, false, 'Include new skills learned'),
    (demo_user_id, 'Dentist appointment', 'Regular dental cleaning', 'Health', 'Medium', 'Todo', CURRENT_TIMESTAMP + INTERVAL '14 days', 6, 0, false, true, 'Every 6 months'),
    (demo_user_id, 'Write blog post', 'Technical article about MMTM development', 'Work', 'Medium', 'Todo', CURRENT_TIMESTAMP + INTERVAL '12 days', 5, 0, true, false, 'Share development insights'),
    (demo_user_id, 'Clean garage', 'Organize and declutter garage space', 'Home', 'Low', 'Todo', CURRENT_TIMESTAMP + INTERVAL '25 days', 3, 0, true, false, 'Donate items we don''t need');
    
    -- Insert some mood logs for testing
    INSERT INTO mood_logs (user_id, mood, confidence, text_input) VALUES
    (demo_user_id, 'Focused', 0.8, 'I''m feeling really concentrated today and ready to tackle my important tasks'),
    (demo_user_id, 'Tired', 0.9, 'I''m so exhausted from yesterday, need to take it easy'),
    (demo_user_id, 'Energetic', 0.7, 'Had a great workout this morning, feeling pumped and ready to go!'),
    (demo_user_id, 'Stressed', 0.85, 'There''s so much pressure at work right now, feeling overwhelmed'),
    (demo_user_id, 'Happy', 0.75, 'What a wonderful day! Everything is going great and I''m in such a good mood');
END $$;
