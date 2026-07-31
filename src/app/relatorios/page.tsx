'use client';

import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Calendar,
  Download,
  FileCode,
  FileSpreadsheet,
  Code2,
  MoreVertical,
} from 'lucide-react';

export default function RelatoriosPage() {
  return (
    <PageTransition>
      <div className="flex flex-col w-full relative">
        {/* Ambient Background Blur */}
        <div className="fixed top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-20 left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

        {/* Standardized Page Header matching reference design */}
        <PageHeader
          title="Central de Relatórios Analíticos"
          subtitle="Visualize métricas de cruzamento, discrepâncias por unidade e exporte relatórios consolidados do painel CrossSUS."
          actions={
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-all shadow-sm group"
              >
                <Calendar className="w-5 h-5 text-on-surface-variant group-hover:text-on-surface transition-colors" />
                <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">
                  Últimos 30 Dias
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl hover:bg-primary-container transition-all shadow-md hover:shadow-lg hover:shadow-primary/20 group"
              >
                <Download className="w-5 h-5 text-on-primary" />
                <span className="font-label-md text-label-md text-on-primary font-semibold">
                  Exportar Tudo
                </span>
              </motion.button>
            </>
          }
        />

        {/* 1. Quick Export Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
          {/* PDF Export Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary/50 transition-colors cursor-pointer group flex flex-col justify-between h-40"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-center w-12 h-12 bg-surface-container-high rounded-xl group-hover:bg-secondary/10 transition-colors">
                <FileCode className="w-6 h-6 text-error group-hover:text-secondary transition-colors" />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md">
                Consolidado
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Relatório Executivo (PDF)
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Resumo visual para gestão SMS.
              </p>
            </div>
          </motion.div>

          {/* XLSX Export Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary/50 transition-colors cursor-pointer group flex flex-col justify-between h-40"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-center w-12 h-12 bg-surface-container-high rounded-xl group-hover:bg-secondary/10 transition-colors">
                <FileSpreadsheet className="w-6 h-6 text-secondary group-hover:text-secondary transition-colors" />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md">
                Analítico
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Planilha Detalhada (XLSX)
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Dados brutos com abas por unidade.
              </p>
            </div>
          </motion.div>

          {/* CSV Export Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary/50 transition-colors cursor-pointer group flex flex-col justify-between h-40"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-center w-12 h-12 bg-surface-container-high rounded-xl group-hover:bg-secondary/10 transition-colors">
                <Code2 className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md">
                Integração
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Exportação Bruta (CSV)
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Formato leve para importação externa.
              </p>
            </div>
          </motion.div>
        </section>

        {/* 2. Analytics Overview (Bento Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-stack-lg">
          {/* Bar Chart: Discrepâncias por Unidade */}
          <div className="lg:col-span-8 bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/30 flex flex-col h-[420px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Discrepâncias por Unidade de Saúde
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Top 10 unidades com maior volume de divergências eSUS x SIAPS
                </p>
              </div>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative w-full h-full">
              <svg className="w-full h-full preserve-aspect-ratio-none" viewBox="0 0 800 300">
                <line className="text-outline-variant/20 stroke-dasharray-4" stroke="currentColor" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                <line className="text-outline-variant/20 stroke-dasharray-4" stroke="currentColor" strokeWidth="1" x1="0" x2="800" y1="125" y2="125"></line>
                <line className="text-outline-variant/20 stroke-dasharray-4" stroke="currentColor" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                <line className="text-outline-variant/20" stroke="currentColor" strokeWidth="1" x1="0" x2="800" y1="275" y2="275"></line>

                <g className="bars">
                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 195, y: 80 }} transition={{ duration: 0.6 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="40"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="55" y="295">US 1</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 155, y: 120 }} transition={{ duration: 0.6, delay: 0.05 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="110"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="125" y="295">US 2</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 135, y: 140 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="180"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="195" y="295">US 3</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 110, y: 165 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="250"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="265" y="295">US 4</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 95, y: 180 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="320"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="335" y="295">US 5</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 80, y: 195 }} transition={{ duration: 0.6, delay: 0.25 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="390"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="405" y="295">US 6</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 65, y: 210 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="460"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="475" y="295">US 7</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 50, y: 225 }} transition={{ duration: 0.6, delay: 0.35 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="530"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="545" y="295">US 8</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 40, y: 235 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="600"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="615" y="295">US 9</text>

                  <motion.rect initial={{ height: 0, y: 275 }} animate={{ height: 25, y: 250 }} transition={{ duration: 0.6, delay: 0.45 }} className="text-tertiary-container hover:text-tertiary transition-colors duration-300" fill="currentColor" rx="4" width="30" x="670"></motion.rect>
                  <text className="text-on-surface-variant" fill="currentColor" fontFamily="Inter" fontSize="10" textAnchor="middle" x="685" y="295">US 10</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Resumo por Distrito */}
          <div className="lg:col-span-4 bg-surface-container/60 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-[420px]">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                Resumo por Distrito de Saúde
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Distribuição percentual de conformidade.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-medium">Distrito Centro</span>
                  <span className="text-secondary font-mono-data">84%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 0.8 }} className="bg-secondary h-full rounded-full"></motion.div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-medium">Distrito Norte</span>
                  <span className="text-secondary font-mono-data">72%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 0.8, delay: 0.1 }} className="bg-secondary h-full rounded-full"></motion.div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-medium">Distrito Sul</span>
                  <span className="text-tertiary font-mono-data">58%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '58%' }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-tertiary h-full rounded-full"></motion.div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-medium">Distrito Leste</span>
                  <span className="text-error font-mono-data">41%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '41%' }} transition={{ duration: 0.8, delay: 0.3 }} className="bg-error h-full rounded-full"></motion.div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Média Geral SMS</span>
              <span className="font-mono-data text-mono-data text-on-surface font-bold">63.75%</span>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
