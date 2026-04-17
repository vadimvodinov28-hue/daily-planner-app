import { useState } from "react";
import Icon from "@/components/ui/icon";

const today = new Date();
const dayNames = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

const quickStats = [
  { label: "Задач сегодня", value: "4", icon: "CheckSquare", done: 1 },
  { label: "Напоминаний", value: "2", icon: "Bell", done: 0 },
  { label: "События", value: "1", icon: "CalendarDays", done: 0 },
];

const recentTasks = [
  { id: 1, text: "Подготовить отчёт за квартал", done: true },
  { id: 2, text: "Созвон с командой в 15:00", done: false },
  { id: 3, text: "Обновить базу контактов", done: false },
  { id: 4, text: "Отправить предложение клиенту", done: false },
];

const HomePage = () => {
  const [tasks, setTasks] = useState(recentTasks);

  const toggle = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="greeting-day">{dayNames[today.getDay()]}</p>
          <h1 className="greeting-date">
            {today.getDate()} {monthNames[today.getMonth()]}
          </h1>
        </div>
        <div className="avatar-circle">А</div>
      </div>

      {/* Progress */}
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-label">Прогресс дня</span>
          <span className="progress-pct">{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-sub">{doneCount} из {tasks.length} задач выполнено</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {quickStats.map((s) => (
          <div key={s.label} className="stat-card">
            <Icon name={s.icon} size={18} />
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tasks preview */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">На сегодня</h2>
          <span className="section-meta">{tasks.length} задач</span>
        </div>
        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-row ${task.done ? "task-row--done" : ""}`}
              onClick={() => toggle(task.id)}
            >
              <div className={`task-check ${task.done ? "task-check--done" : ""}`}>
                {task.done && <Icon name="Check" size={12} />}
              </div>
              <span className="task-text">{task.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
