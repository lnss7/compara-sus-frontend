'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import { ShieldCheck, Sliders, Plug, Info, Save, Shield, Palette, Lock, CheckCircle2 } from 'lucide-react';
import { useCrossSUSStore } from '@/lib/store';

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useCrossSUSStore();
  const [activeTab, setActiveTab] = useState<'seguranca' | 'preferencias' | 'integracoes' | 'sobre'>('seguranca');

  return (
    <PageTransition>
      <div className="flex flex-col w-full gap-gutter">
        {/* Standardized Page Header matching reference design */}
        <PageHeader
          title="Configurações do Sistema"
          subtitle="Gerencie preferências locais, segurança de dados e integrações da plataforma."
          actions={
            <div className="flex gap-4">
              <button className="px-6 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors">
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2 font-semibold"
              >
                <Save className="w-4 h-4" /> Salvar Alterações
              </motion.button>
            </div>
          }
        />

        {/* Grid Layout with Sticky Sub-Navigation */}
        <div className="grid grid-cols-12 gap-gutter items-start">
          {/* Navigation Sidebar Tabs */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 sticky top-24">
            <button
              onClick={() => setActiveTab('seguranca')}
              className={`text-left px-4 py-3 rounded-lg font-label-md text-label-md flex items-center gap-3 transition-colors ${
                activeTab === 'seguranca'
                  ? 'bg-surface-container-highest text-on-surface font-semibold'
                  : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <Shield className="w-5 h-5 text-primary" /> Segurança
            </button>
            <button
              onClick={() => setActiveTab('preferencias')}
              className={`text-left px-4 py-3 rounded-lg font-label-md text-label-md flex items-center gap-3 transition-colors ${
                activeTab === 'preferencias'
                  ? 'bg-surface-container-highest text-on-surface font-semibold'
                  : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <Sliders className="w-5 h-5" /> Preferências
            </button>
            <button
              onClick={() => setActiveTab('integracoes')}
              className={`text-left px-4 py-3 rounded-lg font-label-md text-label-md flex items-center gap-3 transition-colors ${
                activeTab === 'integracoes'
                  ? 'bg-surface-container-highest text-on-surface font-semibold'
                  : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <Plug className="w-5 h-5" /> Integrações
            </button>
            <button
              onClick={() => setActiveTab('sobre')}
              className={`text-left px-4 py-3 rounded-lg font-label-md text-label-md flex items-center gap-3 transition-colors ${
                activeTab === 'sobre'
                  ? 'bg-surface-container-highest text-on-surface font-semibold'
                  : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <Info className="w-5 h-5" /> Sobre o Sistema
            </button>
          </div>

          {/* Content Section */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-stack-lg">
            {/* Segurança & Privacidade */}
            <section className="bg-surface-container rounded-2xl p-6 flex flex-col gap-6 border border-outline-variant/20">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" /> Segurança e Privacidade
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Diretrizes institucionais de proteção de dados e auditoria (LGPD).
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Card Informativo 1: Autodestruição de Dados ao Sair */}
                <div className="flex items-start justify-between p-4 bg-surface rounded-xl border border-outline-variant/10">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Autodestruição de Dados ao Sair
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Sempre Ativo (LGPD)
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Limpador automático de memória RAM e cache local. Todos os dados das planilhas são apagados imediatamente ao encerrar a sessão ou fechar a aba do navegador.
                    </span>
                  </div>
                </div>

                {/* Card Informativo 2: Auditoria e Monitoramento de Acesso */}
                <div className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-outline-variant/10">
                  <div className="p-2.5 rounded-lg bg-primary-container/20 text-primary mt-0.5 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Auditoria e Monitoramento de Acesso
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Todas as ações realizadas nesta estação são registradas para fins de segurança, governança e monitoramento institucional.
                    </p>
                    <div className="p-3.5 rounded-xl bg-surface-container-high border border-outline-variant/20 flex items-start gap-2.5 text-xs text-on-surface-variant">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-normal">
                        <strong className="text-on-surface font-semibold">Garantia de Privacidade (Auditoria Cega):</strong> Os registros e dados pessoais de pacientes <strong>NUNCA são salvos ou enviados para banco de dados</strong>. O sistema grava exclusivamente quem acessou (operador), o horário e o tipo de operação realizada.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferências de Usuário */}
            <section className="bg-surface-container rounded-2xl p-6 flex flex-col gap-6 border border-outline-variant/20">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <Palette className="w-6 h-6 text-secondary" /> Preferências de Usuário
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Tema da Interface
                  </label>
                  <select
                    value={theme === 'dark' ? 'dark' : 'light'}
                    onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                    className="w-full bg-surface text-on-surface font-body-md text-body-md p-3 rounded-xl appearance-none outline-none focus:ring-1 focus:ring-primary-container border border-outline-variant/30 cursor-pointer"
                  >
                    <option value="dark">Modo Escuro (Cockpit)</option>
                    <option value="light">Modo Claro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Idioma
                  </label>
                  <select className="w-full bg-surface text-on-surface font-body-md text-body-md p-3 rounded-xl appearance-none outline-none focus:ring-1 focus:ring-primary-container border border-outline-variant/30">
                    <option>Português (Brasil)</option>
                    <option>English (US)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Sobre o Sistema */}
            <section className="bg-surface-container rounded-2xl p-6 flex flex-col gap-4 border border-outline-variant/20">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <Info className="w-5 h-5 text-on-surface-variant" /> Sobre a Plataforma
              </h2>
              <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
                <p>
                  <strong className="text-on-surface">Cruzador de Dados da Saúde (e-SUS vs SIAPS)</strong>
                </p>
                <p>Desenvolvido para a Secretaria Municipal de Saúde de Porto Alegre (SMS-POA).</p>
                <p className="font-mono-data text-xs mt-2">Versão 1.0.0-production • Zero-Storage Engine (Client-Side)</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
