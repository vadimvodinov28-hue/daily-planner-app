import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TaskModal, { type NewTask } from "@/components/TaskModal";

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  date: string;
  time?: string;
  advance?: string;
  advanceTime?: string;
  melody?: string;
}

const priorityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

const isWeekend = (di: number) => di === 5 || di === 6;

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const toIso = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const CalendarPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(now.getDate());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>("diary_tasks", []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(toIso(now.getFullYear(), now.getMonth(), now.getDate()));
  const [editingId, setEditingId] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const tasksByDate = (iso: string) => tasks.filter((t) => t.date === iso);

  const openAddForDate = (iso: string) => {
    setEditingId(null);
    setModalDate(iso);
    document.querySelector(".main-content")?.scrollTo({ top: 0 });
    setModalOpen(true);
  };

  const saveTask = (data: NewTask) => {
    if (editingId !== null) {
      setTasks((prev) => prev.map((t) => t.id === editingId ? { ...t, ...data } : t));
      setEditingId(null);
    } else {
      setTasks((prev) => [...prev, { id: Date.now(), done: false, ...data, date: modalDate }]);
    }
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setModalDate(task.date);
    document.querySelector(".main-content")?.scrollTo({ top: 0 });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const editingTask = editingId !== null ? tasks.find((t) => t.id === editingId) : undefined;

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const allCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (allCells.length % 7 !== 0) allCells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  const weekKey = (weekIdx: number) => `${year}-${month}-${weekIdx}`;

  const toggleWeek = (weekIdx: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekKey(weekIdx))) next.delete(weekKey(weekIdx));
      else next.add(weekKey(weekIdx));
      return next;
    });
  };

  const toggleAllWeeks = () => {
    if (allExpanded) {
      setExpandedWeeks(new Set());
      setAllExpanded(false);
    } else {
      const allKeys = weeks.map((_, wi) => weekKey(wi));
      setExpandedWeeks(new Set(allKeys));
      setAllExpanded(true);
    }
  };

  const selectedIso = toIso(year, month, selected);
  const selectedTasks = tasksByDate(selectedIso);

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Календарь</h1>
        <button className="cal-toggle-all-btn" onClick={toggleAllWeeks}>
          <Icon name={allExpanded ? "ChevronsUp" : "ChevronsDown"} size={15} />
          {allExpanded ? "Свернуть" : "Все задачи"}
        </button>
      </div>

      {/* Month navigation */}
      <div className="cal-month-nav">
        <button className="cal-month-arrow" onClick={prevMonth}>
          <Icon name="ChevronLeft" size={20} />
        </button>
        <span className="cal-month-label">{monthNames[month]} {year}</span>
        <button className="cal-month-arrow" onClick={nextMonth}>
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="cal-dow-header">
        {dayLabels.map((d, i) => (
          <span key={d} className={`cal-dow-cell${isWeekend(i) ? " cal-dow-cell--weekend" : ""}`}>{d}</span>
        ))}
      </div>

      {/* Weeks */}
      <div className="cal-weeks-list">
        {weeks.map((week, wi) => {
          const isExpanded = expandedWeeks.has(weekKey(wi));
          const weekHasTasks = week.some((day) => day && tasksByDate(toIso(year, month, day)).length > 0);

          return (
            <div key={wi} className="cal-week-block2">
              {/* Week cells row */}
              <div className="cal-week-row2">
                <div className="cal-week-cells">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="cal-cell2 cal-cell2--empty" />;
                    const iso = toIso(year, month, day);
                    const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                    const isSelected = day === selected && !isExpanded;
                    const dayTasks = tasksByDate(iso);
                    const weekend = isWeekend(di);
                    return (
                      <button
                        key={di}
                        className={[
                          "cal-cell2",
                          isSelected ? "cal-cell2--selected" : "",
                          isToday && !isSelected ? "cal-cell2--today" : "",
                          weekend && !isSelected ? "cal-cell2--weekend" : "",
                        ].join(" ")}
                        onClick={() => setSelected(day)}
                      >
                        <span className="cal-cell2-day">{dayLabels[di]}</span>
                        <span className="cal-cell2-num">{day}</span>
                        {dayTasks.length > 0 && (
                          <span className="cal-cell2-dot" style={{ background: priorityColors[dayTasks[0].priority] }} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  className={`cal-expand-btn${isExpanded ? " cal-expand-btn--open" : ""}`}
                  onClick={() => toggleWeek(wi)}
                  title={isExpanded ? "Свернуть" : "Развернуть"}
                >
                  <Icon name="ChevronDown" size={13} />
                  {weekHasTasks && !isExpanded && <span className="cal-expand-dot" />}
                </button>
              </div>

              {/* Expanded week detail */}
              {isExpanded && (
                <div className="cal-detail">
                  {week.map((day, di) => {
                    if (!day) return null;
                    const iso = toIso(year, month, day);
                    const dayTasks = tasksByDate(iso);
                    const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                    const weekend = isWeekend(di);
                    return (
                      <div key={di} className={`cal-detail-day${isToday ? " cal-detail-day--today" : ""}`}>
                        {/* Day label */}
                        <div className={`cal-detail-dayhead${weekend ? " cal-detail-dayhead--weekend" : ""}`}>
                          <span className="cal-detail-dow">{dayLabels[di]}</span>
                          <span className={`cal-detail-num${isToday ? " cal-detail-num--today" : ""}`}>{day}</span>
                          <button
                            className="cal-detail-add"
                            onClick={() => openAddForDate(iso)}
                            title="Добавить задачу"
                          >
                            <Icon name="Plus" size={12} />
                          </button>
                        </div>

                        {/* Tasks */}
                        <div className="cal-detail-tasks">
                          {dayTasks.length === 0 ? (
                            <button className="cal-detail-empty" onClick={() => openAddForDate(iso)}>
                              <Icon name="Plus" size={11} />
                              Добавить задачу
                            </button>
                          ) : (
                            <>
                              {dayTasks.map((t) => (
                                <div
                                  key={t.id}
                                  className={`cal-task-row${t.done ? " cal-task-row--done" : ""}`}
                                  style={{ borderLeftColor: priorityColors[t.priority] }}
                                >
                                  {/* Галочка СЛЕВА */}
                                  <button
                                    className={`cal-task-check${t.done ? " cal-task-check--done" : ""}`}
                                    onClick={() => toggleTask(t.id)}
                                    aria-label="Отметить"
                                  >
                                    {t.done
                                      ? <Icon name="CheckCircle2" size={15} />
                                      : <Icon name="Circle" size={15} />
                                    }
                                  </button>
                                  {/* Текст задачи */}
                                  <div className="cal-task-body">
                                    <span className="cal-task-text">{t.text}</span>
                                    {t.time && (
                                      <span className="cal-task-time">
                                        <Icon name="Clock" size={10} />
                                        {t.time}
                                      </span>
                                    )}
                                  </div>
                                  {/* Редактировать */}
                                  <button
                                    className="cal-task-edit"
                                    onClick={() => openEdit(t)}
                                    aria-label="Редактировать"
                                  >
                                    <Icon name="Pencil" size={12} />
                                  </button>
                                </div>
                              ))}
                              <button className="cal-detail-add-more" onClick={() => openAddForDate(iso)}>
                                <Icon name="Plus" size={11} />
                                Добавить
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Collapse button */}
                  <button className="cal-detail-collapse" onClick={() => toggleWeek(wi)}>
                    <Icon name="ChevronUp" size={13} />
                    Свернуть
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day tasks */}
      <div className="cal-selected-day">
        <div className="cal-selected-day-header">
          <span className="cal-selected-day-title">
            {dayLabels[(new Date(year, month, selected).getDay() + 6) % 7]}, {selected} {monthNames[month].toLowerCase()}
          </span>
          <button className="cal-selected-add-btn" onClick={() => openAddForDate(selectedIso)}>
            <Icon name="Plus" size={14} />
            Добавить
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <button className="cal-selected-empty" onClick={() => openAddForDate(selectedIso)}>
            <Icon name="CalendarPlus" size={22} />
            <span>Нет задач — нажми чтобы добавить</span>
          </button>
        ) : (
          <div className="cal-selected-tasks">
            {selectedTasks.map((t) => (
              <div
                key={t.id}
                className={`cal-task-row${t.done ? " cal-task-row--done" : ""}`}
                style={{ borderLeftColor: priorityColors[t.priority] }}
              >
                <button
                  className={`cal-task-check${t.done ? " cal-task-check--done" : ""}`}
                  onClick={() => toggleTask(t.id)}
                  aria-label="Отметить"
                >
                  {t.done
                    ? <Icon name="CheckCircle2" size={15} />
                    : <Icon name="Circle" size={15} />
                  }
                </button>
                <div className="cal-task-body">
                  <span className="cal-task-text">{t.text}</span>
                  {t.time && (
                    <span className="cal-task-time">
                      <Icon name="Clock" size={10} />
                      {t.time}
                    </span>
                  )}
                </div>
                <button
                  className="cal-task-edit"
                  onClick={() => openEdit(t)}
                  aria-label="Редактировать"
                >
                  <Icon name="Pencil" size={12} />
                </button>
                <button
                  className="cal-task-delete"
                  onClick={() => { if (confirm("Удалить задачу?")) removeTask(t.id); }}
                  aria-label="Удалить"
                >
                  <Icon name="Trash2" size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        onSave={saveTask}
        defaultDate={modalDate}
        initial={editingTask}
        editMode={!!editingTask}
        onDelete={editingTask ? () => { removeTask(editingTask.id); closeModal(); } : undefined}
        hideDatePicker={false}
      />
    </div>
  );
};

export default CalendarPage;
