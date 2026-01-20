import React from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "info";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = "md",
  variant = "primary",
}) => {
  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }[size];

  const colorClass = {
    primary: "bg-primary-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  }[variant];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">Postęp</span>
          <span className="text-sm font-bold text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${heightClass} bg-neutral-200 rounded-full overflow-hidden`}
      >
        <div
          className={`${heightClass} ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

interface StatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  unit,
  icon,
  className,
}) => {
  const cardClass = className
    ? `card p-4 flex items-center gap-3 ${className}`
    : "card p-4 flex items-center gap-3";
  return (
    <div className={cardClass}>
      {icon && <div className="text-primary-500 flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-neutral-900">
          {value}
          {unit && (
            <span className="text-sm text-neutral-600 ml-1">{unit}</span>
          )}
        </p>
      </div>
    </div>
  );
};

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
}) => {
  const variantClass = {
    primary: "bg-primary-100 text-primary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
  }[variant];

  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  }[size];

  return (
    <span
      className={`inline-block font-medium rounded-full ${variantClass} ${sizeClass}`}
    >
      {label}
    </span>
  );
};

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-primary-500 text-white shadow-card"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
