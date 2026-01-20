import React from "react";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  actions,
  subtitle,
}) => {
  return (
    <header className="sticky top-0 bg-white border-b border-neutral-100 z-10 safe-area-top">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="btn-icon flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-neutral-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-neutral-500 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </header>
  );
};

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <main className={`max-w-lg mx-auto px-3 py-2 pb-24 ${className}`}>
      {children}
    </main>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="min-h-screen bg-neutral-50">{children}</div>;
};
