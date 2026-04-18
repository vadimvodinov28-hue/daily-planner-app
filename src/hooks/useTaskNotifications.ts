import { useEffect, useRef } from "react";

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
}

interface Reminder {
  id: number;
  title: string;
  time: string;
  date: string;
  repeat: string;
  active: boolean;
  advance: string;
}

const advanceMinutes: Record<string, number> = {
  "За 15 мин": 15,
  "За 1 час": 60,
  "За 3 часа": 180,
  "За 6 часов": 360,
  "За 1 день": 1440,
  "За 2 дня": 2880,
};

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const times = [0, 0.25, 0.5];
    times.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + t + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + t + 0.2);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.25);
    });
  } catch {
    // AudioContext недоступен
  }
}

function sendNotification(title: string, body: string, tag: string) {
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      tag,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      vibrate: [200, 100, 200],
    } as NotificationOptions);
  } catch {
    // fallback — не поддерживается
  }
  playBeep();
}

function getTaskFireTimes(task: Task): { fireAt: number; tag: string; label: string }[] {
  if (task.done || !task.date) return [];
  const results: { fireAt: number; tag: string; label: string }[] = [];

  if (task.time) {
    const [h, m] = task.time.split(":").map(Number);
    const base = new Date(task.date + "T" + task.time);
    if (!isNaN(base.getTime())) {
      results.push({
        fireAt: base.getTime(),
        tag: `task-${task.id}-exact`,
        label: `Время задачи: ${task.text}`,
      });

      const advMin = task.advance && task.advance !== "none" && task.advance !== "custom"
        ? advanceMinutes[task.advance] ?? 0
        : 0;
      const customTime = task.advance === "custom" && task.advanceTime
        ? task.advanceTime
        : null;

      if (advMin > 0) {
        const advFire = base.getTime() - advMin * 60 * 1000;
        results.push({
          fireAt: advFire,
          tag: `task-${task.id}-advance`,
          label: `Через ${advMin < 60 ? advMin + " мин" : advMin / 60 + " ч"}: ${task.text}`,
        });
      }

      if (customTime) {
        const [ch, cm] = customTime.split(":").map(Number);
        const custom = new Date(task.date);
        custom.setHours(ch, cm, 0, 0);
        results.push({
          fireAt: custom.getTime(),
          tag: `task-${task.id}-custom`,
          label: `Напоминание: ${task.text}`,
        });
      }
    }
  }

  return results;
}

function getReminderFireTime(r: Reminder): { fireAt: number; tag: string } | null {
  if (!r.active || !r.time) return null;
  const now = new Date();
  const [h, m] = r.time.split(":").map(Number);

  let base: Date;
  if (r.repeat === "daily" || r.repeat === "weekdays" || r.repeat === "weekly" || r.repeat === "once") {
    base = new Date();
    base.setHours(h, m, 0, 0);
    if (base.getTime() < now.getTime()) {
      base.setDate(base.getDate() + 1);
    }
  } else {
    return null;
  }

  return { fireAt: base.getTime(), tag: `reminder-${r.id}` };
}

export function useTaskNotifications() {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const window_ms = 30_000; // огонь в течение 30 сек от нужного времени

      const rawTasks = localStorage.getItem("diary_tasks");
      const rawReminders = localStorage.getItem("diary_reminders");
      const tasks: Task[] = rawTasks ? JSON.parse(rawTasks) : [];
      const reminders: Reminder[] = rawReminders ? JSON.parse(rawReminders) : [];

      // Задачи
      for (const task of tasks) {
        const fireTimes = getTaskFireTimes(task);
        for (const ft of fireTimes) {
          if (firedRef.current.has(ft.tag)) continue;
          if (ft.fireAt <= now && now - ft.fireAt < window_ms) {
            firedRef.current.add(ft.tag);
            sendNotification("Ежедневник", ft.label, ft.tag);
          }
        }
      }

      // Напоминания
      for (const r of reminders) {
        const ft = getReminderFireTime(r);
        if (!ft) continue;
        const dayTag = ft.tag + "-" + new Date().toDateString();
        if (firedRef.current.has(dayTag)) continue;
        if (ft.fireAt <= now && now - ft.fireAt < window_ms) {
          firedRef.current.add(dayTag);
          sendNotification("Напоминание", r.title + " · " + r.time, dayTag);
        }
      }
    };

    tick();
    const interval = setInterval(tick, 15_000);
    return () => clearInterval(interval);
  }, []);
}