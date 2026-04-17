import { useState } from "react";
import Icon from "@/components/ui/icon";

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface CalEvent {
  date: number;
  month: number;
  year: number;
  title: string;
  time: string;
  color: string;
}

const events: CalEvent[] = [
  { date: 17, month: 3, year: 2026, title: "Созвон с командой", time: "15:00", color: "event--blue" },
  { date: 18, month: 3, year: 2026, title: "Встреча с клиентом", time: "11:00", color: "event--green" },
  { date: 22, month: 3, year: 2026, title: "Дедлайн отчёта", time: "18:00", color: "event--red" },
  { date: 25, month: 3, year: 2026, title: "Планёрка", time: "10:00", color: "event--blue" },
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const CalendarPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(now.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const todayEvents = events.filter(
    (e) => e.date === selected && e.month === month && e.year === year
  );

  const eventDates = new Set(
    events.filter((e) => e.month === month && e.year === year).map((e) => e.date)
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Календарь</h1>
        <button className="icon-btn">
          <Icon name="Plus" size={20} />
        </button>
      </div>

      {/* Month navigation */}
      <div className="month-nav">
        <button className="month-arrow" onClick={prevMonth}>
          <Icon name="ChevronLeft" size={18} />
        </button>
        <span className="month-label">{monthNames[month]} {year}</span>
        <button className="month-arrow" onClick={nextMonth}>
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="cal-grid-header">
        {dayLabels.map((d) => <span key={d} className="cal-day-label">{d}</span>)}
      </div>

      {/* Calendar grid */}
      <div className="cal-grid">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          const isSelected = day === selected;
          const hasEvent = eventDates.has(day);
          return (
            <button
              key={i}
              className={`cal-cell ${isSelected ? "cal-cell--selected" : ""} ${isToday && !isSelected ? "cal-cell--today" : ""}`}
              onClick={() => setSelected(day)}
            >
              {day}
              {hasEvent && <span className="cal-dot" />}
            </button>
          );
        })}
      </div>

      {/* Events for selected day */}
      <div className="section">
        <h2 className="section-title">{selected} {monthNames[month]}</h2>
        {todayEvents.length === 0 ? (
          <div className="empty-state">
            <Icon name="CalendarDays" size={28} />
            <p>Событий нет</p>
          </div>
        ) : (
          <div className="event-list">
            {todayEvents.map((e, i) => (
              <div key={i} className={`event-card ${e.color}`}>
                <span className="event-time">{e.time}</span>
                <span className="event-title">{e.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
