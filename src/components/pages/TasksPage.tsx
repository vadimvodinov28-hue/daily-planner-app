import { useState } from "react";
import Icon from "@/components/ui/icon";

type Priority = "high" | "medium" | "low";
type Filter = "all" | "active" | "done";

interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: Priority;
  category: string;
}

const initialTasks: Task[] = [
  { id: 1, text: "Подготовить отчёт за квартал", done: true, priority: "high", category: "Работа" },
  { id: 2, text: "Созвон с командой в 15:00", done: false, priority: "high", category: "Работа" },
  { id: 3, text: "Обновить базу контактов", done: false, priority: "medium", category: "Работа" },
  { id: 4, text: "Купить продукты", done: false, priority: "low", category: "Личное" },
  { id: 5, text: "Записаться к врачу", done: false, priority: "medium", category: "Личное" },
  { id: 6, text: "Прочитать книгу", done: false, priority: "low", category: "Развитие" },
];

const priorityColors: Record<Priority, string> = {
  high: "priority--high",
  medium: "priority--medium",
  low: "priority--low",
};

const priorityLabels: Record<Priority, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Filter>("all");
  const [newText, setNewText] = useState("");

  const toggle = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks((prev) => [...prev, {
      id: Date.now(), text: newText.trim(), done: false, priority: "medium", category: "Общее"
    }]);
    setNewText("");
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Задачи</h1>
        <span className="badge-count">{doneCount}/{tasks.length}</span>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {(["all", "active", "done"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-tab ${filter === f ? "filter-tab--active" : ""}`}
          >
            {f === "all" ? "Все" : f === "active" ? "Активные" : "Выполненные"}
          </button>
        ))}
      </div>

      {/* Add task */}
      <div className="add-task-row">
        <input
          className="add-task-input"
          placeholder="Новая задача..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-task-btn" onClick={addTask}>
          <Icon name="Plus" size={18} />
        </button>
      </div>

      {/* Task list */}
      <div className="task-list">
        {filtered.map((task) => (
          <div
            key={task.id}
            className={`task-row-full ${task.done ? "task-row--done" : ""}`}
            onClick={() => toggle(task.id)}
          >
            <div className={`task-check ${task.done ? "task-check--done" : ""}`}>
              {task.done && <Icon name="Check" size={12} />}
            </div>
            <div className="task-info">
              <span className="task-text">{task.text}</span>
              <span className="task-category">{task.category}</span>
            </div>
            <span className={`priority-dot ${priorityColors[task.priority]}`} title={priorityLabels[task.priority]} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <Icon name="CheckCircle" size={32} />
            <p>Задач нет</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
