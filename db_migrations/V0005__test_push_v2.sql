-- Отмечаем старую тестовую задачу как выполненную чтобы не мешала
UPDATE t_p85754813_daily_planner_app.tasks SET done = true WHERE id = 7;

-- Создаём новую тестовую задачу на 17:05 МСК
INSERT INTO t_p85754813_daily_planner_app.tasks (user_id, text, done, priority, category, date, time, advance, advance_time)
VALUES (2, '🚀 Тест push - от Юры (второй)', false, 'high', 'Тест', '2026-04-18', '17:05', 'none', '');