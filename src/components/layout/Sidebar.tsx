'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UploadCloud, LineChart, Settings, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/cruzamento', icon: LayoutDashboard },
    { name: 'Importação', path: '/', icon: UploadCloud },
    { name: 'Relatórios', path: '/relatorios', icon: LineChart },
    { name: 'Configurações', path: '/configuracoes', icon: Settings },
    { name: 'Style Guide', path: '/styleguide', icon: Palette },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#060e20] dark:bg-surface-container-lowest z-50 flex flex-col border-r border-outline-variant/20 shadow-xl shadow-black/20 text-on-surface">
      {/* Brand Header */}
      <div className="p-6 mb-4 flex items-center gap-stack-sm">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center font-bold text-secondary text-xl">
          CS
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-secondary tracking-tight">
            CrossSUS
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            SMS • Porto Alegre
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-[0_0_15px_rgba(0,165,114,0.1)]'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }`}
              >
                <Icon
                  className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                    isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'
                  }`}
                />
                <span className="font-label-md text-label-md">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="px-6 py-6 border-t border-outline-variant/10">
        <div className="bg-surface-container p-4 rounded-xl flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-outline-variant/30 bg-surface-container-high flex items-center justify-center font-medium text-on-surface text-sm">
              MS
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface truncate">
              Maria Silva
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Operador Master
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
