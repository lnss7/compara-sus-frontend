'use client';

import { useEffect } from 'react';
import { Lock, Bell, HelpCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCrossSUSStore } from '@/lib/store';

export function Header() {
  const { pacientes, theme, toggleTheme } = useCrossSUSStore();
  const pacientesCount = pacientes.length;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <header className="fixed top-0 left-[280px] right-0 h-16 bg-surface/80 backdrop-blur-md z-40 flex items-center px-gutter justify-between border-b border-outline-variant/10 transition-colors duration-300 print:hidden">
      {/* Left items: Security badge & RAM status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-surface-container-high/50 px-3 py-1.5 rounded-full border border-outline-variant/20">
          <Lock className="w-4 h-4 text-secondary" />
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Client-Side Engine • Zero-Storage (100% LGPD)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="font-mono-data text-mono-data text-on-surface-variant text-[12px]">
            RAM: {pacientesCount > 0 ? `${(pacientesCount * 0.12).toFixed(1)} MB em uso` : 'Idle'}
          </span>
        </div>
      </div>

      {/* Right items: Theme toggle, Notifications & Support */}
      <div className="flex items-center gap-stack-lg">
        {/* Light / Dark Mode Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors relative"
          title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-tertiary" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </motion.button>

        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
          title="Notificações"
        >
          <Bell className="w-[22px] h-[22px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-outline-variant/20 rounded-lg hover:bg-surface-container-highest transition-colors">
          <HelpCircle className="w-[18px] h-[18px] text-on-surface-variant" />
          <span className="font-label-md text-label-md text-on-surface">Suporte</span>
        </button>
      </div>
    </header>
  );
}
