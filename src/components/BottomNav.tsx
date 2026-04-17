import Icon from "@/components/ui/icon";
import type { Page } from "@/pages/Index";

interface NavItem {
  id: Page;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Главная", icon: "House" },
  { id: "tasks", label: "Задачи", icon: "CheckSquare" },
  { id: "calendar", label: "Календарь", icon: "CalendarDays" },
  { id: "reminders", label: "Напомин.", icon: "Bell" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

interface Props {
  activePage: Page;
  onChange: (page: Page) => void;
}

const BottomNav = ({ activePage, onChange }: Props) => {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`nav-item ${isActive ? "nav-item--active" : ""}`}
          >
            <Icon name={item.icon} size={20} />
            <span className="nav-label">{item.label}</span>
            {isActive && <span className="nav-dot" />}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
