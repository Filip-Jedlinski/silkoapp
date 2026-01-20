import React from "react";
import {
  Calendar,
  TrendingUp,
  Settings as SettingsIcon,
  Dumbbell,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface BottomNavProps {
  items: NavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${
              item.active
                ? "text-primary-500 bg-primary-50"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const getNavItems = (
  currentScreen: string,
  onNavigate: (screen: string) => void,
): NavItem[] => [
  {
    id: "training",
    label: "Trening",
    icon: <Dumbbell className="w-5 h-5" />,
    active: currentScreen === "training",
    onClick: () => onNavigate("training"),
  },
  {
    id: "weekly",
    label: "Plan",
    icon: <Calendar className="w-5 h-5" />,
    active: currentScreen === "weekly",
    onClick: () => onNavigate("weekly"),
  },
  {
    id: "progress",
    label: "Progres",
    icon: <TrendingUp className="w-5 h-5" />,
    active: currentScreen === "progress",
    onClick: () => onNavigate("progress"),
  },
  {
    id: "settings",
    label: "Ustawienia",
    icon: <SettingsIcon className="w-5 h-5" />,
    active: currentScreen === "settings",
    onClick: () => onNavigate("settings"),
  },
];
