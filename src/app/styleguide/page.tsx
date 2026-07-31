'use client';

import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import { useCrossSUSStore } from '@/lib/store';
import {
  Palette,
  Sun,
  Moon,
  Type,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  Search,
  Zap,
  Layout,
} from 'lucide-react';

export default function StyleGuidePage() {
  const { theme, toggleTheme } = useCrossSUSStore();

  return (
    <PageTransition>
      <div className="flex flex-col w-full gap-stack-lg max-w-container-max mx-auto py-2">
        {/* Standardized Page Header */}
        <PageHeader
          title="Design System & Style Guide"
          subtitle="Guia oficial de estilos e padronização visual do CrossSUS (SMS Porto Alegre) com especificações de tipografia, cabeçalhos, paleta de cores e animações."
          actions={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleTheme}
              className="flex items-center gap-3 px-6 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl hover:bg-surface-container-highest transition-colors shadow-sm"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5 text-tertiary" />
                  <span className="font-label-md text-label-md text-on-surface">
                    Tema Atual: <strong>Modo Escuro (Cockpit)</strong>
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-primary" />
                  <span className="font-label-md text-label-md text-on-surface">
                    Tema Atual: <strong>Modo Claro</strong>
                  </span>
                </>
              )}
            </motion.button>
          }
        />

        {/* 0. Page Header Reference Pattern Demo */}
        <section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <Layout className="w-5 h-5 text-secondary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              0. Padrão Oficial de Cabeçalho de Página (&lt;PageHeader /&gt;)
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Padrão visual unificado (barra verde vertical + título em destaque + subtítulo explicativo):
          </p>
          <div className="p-6 bg-surface rounded-xl border border-outline-variant/20 shadow-inner">
            <PageHeader
              title="Central de Relatórios Analíticos"
              subtitle="Visualize métricas de cruzamento, discrepâncias por unidade e exporte relatórios consolidados do painel CrossSUS."
            />
          </div>
        </section>

        {/* 1. Typography Section */}
        <section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              1. Hierarquia de Tipografia & Classes CSS Utilitárias
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Page Title */}
            <div className="p-4 bg-surface rounded-xl border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Page Title (36px Bold)
                </span>
                <p className="text-page-title mt-1">
                  Gerenciamento de Arquivos e Importação
                </p>
              </div>
              <code className="font-mono-data text-xs text-secondary bg-surface-container px-3 py-1 rounded">
                .text-page-title
              </code>
            </div>

            {/* Section Title */}
            <div className="p-4 bg-surface rounded-xl border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Section Title (24px SemiBold)
                </span>
                <p className="text-section-title mt-1">
                  Importação e Cruzamento de Bases (e-SUS x SIAPS)
                </p>
              </div>
              <code className="font-mono-data text-xs text-secondary bg-surface-container px-3 py-1 rounded">
                .text-section-title
              </code>
            </div>

            {/* Card Title */}
            <div className="p-4 bg-surface rounded-xl border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Card Title (18px SemiBold)
                </span>
                <p className="text-card-title mt-1">
                  Relatório Executivo Consolidado
                </p>
              </div>
              <code className="font-mono-data text-xs text-secondary bg-surface-container px-3 py-1 rounded">
                .text-card-title
              </code>
            </div>

            {/* Body Lead & Body Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Body Lead (16px Regular)
                </span>
                <p className="text-body-lead mt-1">
                  Visualize métricas de cruzamento e relatórios de discrepâncias.
                </p>
                <code className="font-mono-data text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded mt-2 inline-block">
                  .text-body-lead
                </code>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Body Content (14px Regular)
                </span>
                <p className="text-body-content mt-1">
                  Gerencie e processe as bases de dados para o cruzamento analítico.
                </p>
                <code className="font-mono-data text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded mt-2 inline-block">
                  .text-body-content
                </code>
              </div>
            </div>

            {/* Mono Data */}
            <div className="p-4 bg-surface rounded-xl border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Mono Data (JetBrains Mono 14px Medium)
                </span>
                <p className="text-code-mono mt-1">
                  CPF: 700.004.471-49 | CNS: 702400539870000 | INE: 430382
                </p>
              </div>
              <code className="font-mono-data text-xs text-secondary bg-surface-container px-3 py-1 rounded">
                .text-code-mono
              </code>
            </div>
          </div>
        </section>

        {/* 2. Color Palette Section */}
        <section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <Layers className="w-5 h-5 text-secondary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              2. Paleta de Cores e Tokens do Tema
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-background rounded-xl border border-outline-variant/20 flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">Background</span>
              <span className="font-mono-data text-[11px] text-on-surface-variant">var(--background)</span>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-outline-variant/20 flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">Surface</span>
              <span className="font-mono-data text-[11px] text-on-surface-variant">var(--surface)</span>
            </div>

            <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/20 flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">Surface Container</span>
              <span className="font-mono-data text-[11px] text-on-surface-variant">--surface-container</span>
            </div>

            <div className="p-4 bg-primary text-on-primary rounded-xl flex flex-col gap-2 shadow-md">
              <span className="font-label-sm text-label-sm font-semibold">Primary</span>
              <span className="font-mono-data text-[11px]">e-SUS Azul</span>
            </div>

            <div className="p-4 bg-secondary text-on-secondary-container rounded-xl flex flex-col gap-2 shadow-md">
              <span className="font-label-sm text-label-sm font-semibold">Secondary</span>
              <span className="font-mono-data text-[11px]">Saúde Verde</span>
            </div>

            <div className="p-4 bg-tertiary text-on-tertiary-container rounded-xl flex flex-col gap-2 shadow-md">
              <span className="font-label-sm text-label-sm font-semibold">Tertiary</span>
              <span className="font-mono-data text-[11px]">SIAPS Laranja</span>
            </div>
          </div>
        </section>

        {/* 3. Component Showcase Section */}
        <section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <Sparkles className="w-5 h-5 text-tertiary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              3. Componentes de UI (Badges, Botões, Inputs)
            </h2>
          </div>

          {/* Badges & Status Tags */}
          <div className="flex flex-col gap-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Status Badges
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase">
                PRESENTE NAS DUAS PLANILHAS
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase">
                APENAS NO E-SUS
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary/10 text-tertiary border border-tertiary/20 uppercase">
                APENAS NO SIAPS
              </span>
            </div>
          </div>

          {/* Buttons Showcase */}
          <div className="flex flex-col gap-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Botões Interativos (Framer Motion)
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md text-label-md font-semibold flex items-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4" /> Processar Dados
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-surface-container-high text-on-surface border border-outline-variant/30 px-6 py-3 rounded-xl font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
              >
                Cancelar
              </motion.button>
            </div>
          </div>

          {/* Inputs & Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                className="w-full bg-surface border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary text-sm"
                placeholder="Exemplo de Input de Busca..."
                type="text"
              />
            </div>
            <select className="bg-surface border border-outline-variant/30 rounded-xl py-2.5 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary text-sm">
              <option>Equipe: ESF ASA BRANCA I</option>
              <option>Equipe: ESF CENTRO</option>
            </select>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
