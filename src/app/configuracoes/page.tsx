'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import { ShieldCheck, Sliders, Plug, Info, Save, Shield, Palette } from 'lucide-react';
import { useCrossSUSStore } from '@/lib/store';

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useCrossSUSStore();
  const [activeTab, setActiveTab] = useState<'seguranca' | 'preferencias' | 'integracoes' | 'sobre'>('seguranca');
  const [autoDestruct, setAutoDestruct] = useState(true);
  const [maskCpf, setMaskCpf] = useState(true);
  const [localAudit, setLocalAudit] = useState(false);

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
                  Configurações críticas de proteção de dados (LGPD).
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {/* Toggle 1: Autodestruição */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface">
                      Autodestruição de Dados ao Sair
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Limpa o cache local e memória RAM ao fechar o navegador.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoDestruct(!autoDestruct)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoDestruct ? 'bg-primary-container' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        autoDestruct ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Mascaramento de CPF */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface">
                      Mascaramento de CPF
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Oculta os primeiros dígitos (ex: ***.***.123-45).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaskCpf(!maskCpf)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      maskCpf ? 'bg-primary-container' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        maskCpf ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3: Logs de Auditoria Local */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface">
                      Logs de Auditoria Local
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Registra ações no console local (não enviado ao servidor).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocalAudit(!localAudit)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      localAudit ? 'bg-primary-container' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        localAudit ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
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
