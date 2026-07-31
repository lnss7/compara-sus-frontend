'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-stack-lg mb-stack-lg">
      <div className="flex flex-col gap-1.5 max-w-3xl">
        {badge && <div className="mb-1">{badge}</div>}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-secondary rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            {title}
          </h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant pl-4.5 max-w-2xl mt-0.5">
          {subtitle}
        </p>
      </div>
      {actions && (
        <div className="flex items-center gap-stack-md flex-shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
