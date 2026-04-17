import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  icon: string;
  value: boolean;
}

const initialToggles: SettingToggle[] = [
  { id: "notifications", label: "Уведомления", description: "Push-уведомления о задачах", icon: "Bell", value: true },
  { id: "sounds", label: "Звуки", description: "Звук при завершении задачи", icon: "Volume2", value: false },
  { id: "darkmode", label: "Тёмная тема", description: "Переключить на тёмный режим", icon: "Moon", value: false },
  { id: "weekstart", label: "Неделя с понедельника", description: "Начинать календарь с пн", icon: "CalendarDays", value: true },
];

const SettingsPage = () => {
  const [toggles, setToggles] = useLocalStorage("diary_settings", initialToggles);

  const toggle = (id: string) => {
    setToggles((prev) => prev.map((t) => t.id === id ? { ...t, value: !t.value } : t));
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Настройки</h1>
      </div>

      {/* Profile block */}
      <div className="profile-card">
        <div className="profile-avatar">А</div>
        <div className="profile-info">
          <span className="profile-name">Алексей Иванов</span>
          <span className="profile-email">aleksey@example.com</span>
        </div>
        <button className="icon-btn">
          <Icon name="Pencil" size={16} />
        </button>
      </div>

      {/* Toggles */}
      <div className="section">
        <h2 className="section-title">Предпочтения</h2>
        <div className="settings-list">
          {toggles.map((t) => (
            <div key={t.id} className="settings-row">
              <div className="settings-icon-wrap">
                <Icon name={t.icon} size={16} />
              </div>
              <div className="settings-info">
                <span className="settings-label">{t.label}</span>
                <span className="settings-desc">{t.description}</span>
              </div>
              <button
                className={`toggle-switch ${t.value ? "toggle-switch--on" : ""}`}
                onClick={() => toggle(t.id)}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="section">
        <h2 className="section-title">Другое</h2>
        <div className="settings-list">
          {[
            { icon: "ShieldCheck", label: "Конфиденциальность" },
            { icon: "CircleHelp", label: "Помощь и поддержка" },
            { icon: "Info", label: "О приложении" },
          ].map((item) => (
            <div key={item.label} className="settings-row settings-row--link">
              <div className="settings-icon-wrap">
                <Icon name={item.icon} size={16} />
              </div>
              <span className="settings-label">{item.label}</span>
              <Icon name="ChevronRight" size={16} />
            </div>
          ))}
        </div>
      </div>

      <button className="logout-btn">
        <Icon name="LogOut" size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default SettingsPage;