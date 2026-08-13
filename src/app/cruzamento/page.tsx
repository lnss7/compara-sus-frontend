'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Network,
  Table,
  CheckCircle2,
  Zap,
  Trash2,
  Users,
  GitMerge,
  Database,
  Cross,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Loader2,
} from 'lucide-react';
import { useComparaSUSStore } from '@/lib/store';

export default function CruzamentoWorkspacePage() {
  const { arquivos, pacientes, kpis, limparMemoria: storeLimparMemoria, processarArquivosReais, exportarExcel, isProcessing } =
    useComparaSUSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [teamFilter, setTeamFilter] = useState<string>('TODAS');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  const filteredPacientes = useMemo(() => {
    return pacientes.filter((p) => {
      const matchSearch =
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.equipe.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'TODOS'
          ? true
          : statusFilter === 'AMBAS'
          ? p.status === 'PRESENTE NAS DUAS PLANILHAS'
          : statusFilter === 'ESUS'
          ? p.status === 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)'
          : statusFilter === 'SIAPS'
          ? p.status === 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)'
          : true;

      const matchTeam = teamFilter === 'TODAS' ? true : p.equipe === teamFilter;

      return matchSearch && matchStatus && matchTeam;
    });
  }, [pacientes, searchTerm, statusFilter, teamFilter]);

  const equipesUnicas = useMemo(() => {
    const set = new Set<string>();
    pacientes.forEach((p) => {
      if (p.equipe && p.equipe !== '-') set.add(p.equipe);
    });
    return Array.from(set).sort();
  }, [pacientes]);

  const esusFile = arquivos.find((a) => a.tipo === 'e-SUS AB');
  const siapsFile = arquivos.find((a) => a.tipo === 'SIAPS');

  const handleProcessar = async () => {
    setFeedbackMsg(null);
    setIsProcessed(false);

    const res = await processarArquivosReais();

    if (!res.sucesso) {
      setFeedbackMsg(res.erros?.join(' ') || 'Erro ao processar planilhas.');
      setIsProcessed(false);
    } else {
      setFeedbackMsg('Cruzamento analítico de dados concluído com sucesso.');
      setIsProcessed(true);
    }
  };

  const handleLimparMemoria = () => {
    storeLimparMemoria();
    setIsProcessed(false);
    setFeedbackMsg(null);
  };

  const handleExportar = () => {
    const statusFiltroReal =
      statusFilter === 'AMBAS'
        ? 'PRESENTE NAS DUAS PLANILHAS'
        : statusFilter === 'ESUS'
        ? 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)'
        : statusFilter === 'SIAPS'
        ? 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)'
        : undefined;

    exportarExcel(statusFiltroReal);
  };

  return (
    <PageTransition>
      <div className="flex flex-col w-full p-2 lg:p-4 gap-6 max-w-container-max mx-auto">
        {/* Standardized Page Header */}
        <PageHeader
          title="Painel de Cruzamento"
          subtitle={
            <>
              Análise em tempo real de pacientes cadastrados. Arquivos processados na memória local{' '}
              <span className="font-mono-data text-secondary">sem envio para servidores</span>.
            </>
          }
        />

        {/* Section 1: Ingestion Workspace */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/30 p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-on-surface-variant" />
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Importação e Cruzamento de Bases{' '}
                <span className="text-on-surface-variant text-base font-normal ml-1">
                  (e-SUS x SIAPS)
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* File Card e-SUS */}
            <div className="bg-surface flex items-center p-3.5 rounded-lg border border-outline-variant/20">
              <div
                className={`w-10 h-10 rounded flex items-center justify-center mr-3 border ${
                  esusFile
                    ? 'bg-secondary/10 border-secondary/20 text-secondary'
                    : 'bg-outline-variant/10 border-outline-variant/20 text-on-surface-variant'
                }`}
              >
                <Table className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase">
                    BASE E-SUS
                  </p>
                  {esusFile ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  ) : (
                    <span className="text-[10px] font-mono-data text-on-surface-variant/70 bg-surface-container-high px-2 py-0.5 rounded">
                      NÃO CARREGADO
                    </span>
                  )}
                </div>
                <p className="font-body-md text-body-md text-on-surface truncate mt-0.5 font-medium">
                  {esusFile ? esusFile.nome : 'Nenhum arquivo e-SUS selecionado'}
                </p>
                <p className="font-mono-data text-mono-data text-on-surface-variant text-[11px] mt-0.5">
                  {esusFile
                    ? `${esusFile.registros.toLocaleString('pt-BR')} linhas processadas`
                    : 'Aguardando importação'}
                </p>
              </div>
            </div>

            {/* File Card SIAPS */}
            <div className="bg-surface flex items-center p-3.5 rounded-lg border border-outline-variant/20">
              <div
                className={`w-10 h-10 rounded flex items-center justify-center mr-3 border ${
                  siapsFile
                    ? 'bg-secondary/10 border-secondary/20 text-secondary'
                    : 'bg-outline-variant/10 border-outline-variant/20 text-on-surface-variant'
                }`}
              >
                <Table className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase">
                    BASE SIAPS
                  </p>
                  {siapsFile ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  ) : (
                    <span className="text-[10px] font-mono-data text-on-surface-variant/70 bg-surface-container-high px-2 py-0.5 rounded">
                      NÃO CARREGADO
                    </span>
                  )}
                </div>
                <p className="font-body-md text-body-md text-on-surface truncate mt-0.5 font-medium">
                  {siapsFile ? siapsFile.nome : 'Nenhum arquivo SIAPS selecionado'}
                </p>
                <p className="font-mono-data text-mono-data text-on-surface-variant text-[11px] mt-0.5">
                  {siapsFile
                    ? `${siapsFile.registros.toLocaleString('pt-BR')} linhas processadas`
                    : 'Aguardando importação'}
                </p>
              </div>
            </div>
          </div>

          {feedbackMsg && (
            <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-sm font-label-md">
              {feedbackMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProcessar}
              disabled={isProcessing}
              className={`transition-all font-label-md text-label-md uppercase px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50 cursor-pointer shadow-md ${
                isProcessed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary hover:bg-primary-fixed-dim text-on-primary'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PROCESSANDO DADOS...</span>
                </>
              ) : isProcessed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DADOS PROCESSADOS</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>PROCESSAR CRUZAMENTO DE DADOS</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLimparMemoria}
              className="px-5 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant uppercase border border-outline-variant/30 hover:bg-surface-container-high transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              LIMPAR ARQUIVOS
            </motion.button>
          </div>
        </section>

        {/* Section 2: KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-surface-container rounded-xl border border-outline-variant/20 p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                TOTAL ANALISADO
              </p>
              <Users className="w-4 h-4 text-on-surface-variant" />
            </div>
            <p className="font-display-lg text-display-lg text-on-surface mt-1">
              {kpis.totalAnalisado.toLocaleString('pt-BR')}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-auto">
              Total de Pacientes,<br />Unificados por CPF/CNS
            </p>
          </motion.div>

          {/* Matches */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-surface-container rounded-xl border border-outline-variant/20 p-4 flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-16 h-16 bg-secondary/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <p className="font-label-sm text-label-sm text-secondary uppercase">
                  INTERSEÇÃO
                </p>
              </div>
              <GitMerge className="w-4 h-4 text-secondary" />
            </div>
            <p className="font-display-lg text-display-lg text-on-surface relative z-10 mt-1">
              {kpis.intersecao.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center gap-2 mt-auto relative z-10">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                {kpis.totalAnalisado ? Math.round((kpis.intersecao / kpis.totalAnalisado) * 100) : 0}%
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Presente nas Duas Bases
              </p>
            </div>
          </motion.div>

          {/* Only e-SUS */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-surface-container rounded-xl border border-outline-variant/20 p-4 flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <p className="font-label-sm text-label-sm text-primary uppercase">
                  APENAS E-SUS
                </p>
              </div>
              <Database className="w-4 h-4 text-primary" />
            </div>
            <p className="font-display-lg text-display-lg text-on-surface relative z-10 mt-1">
              {kpis.apenasEsus.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center gap-2 mt-auto relative z-10">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                {kpis.totalAnalisado ? Math.round((kpis.apenasEsus / kpis.totalAnalisado) * 100) : 0}%
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Exclusivo e-SUS
              </p>
            </div>
          </motion.div>

          {/* Only SIAPS */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-surface-container rounded-xl border border-outline-variant/20 p-4 flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-16 h-16 bg-tertiary/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <p className="font-label-sm text-label-sm text-tertiary uppercase">
                  APENAS SIAPS
                </p>
              </div>
              <Cross className="w-4 h-4 text-tertiary" />
            </div>
            <p className="font-display-lg text-display-lg text-on-surface relative z-10 mt-1">
              {kpis.apenasSiaps.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center gap-2 mt-auto relative z-10">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary/10 text-tertiary border border-tertiary/20">
                {kpis.totalAnalisado ? Math.round((kpis.apenasSiaps / kpis.totalAnalisado) * 100) : 0}%
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Exclusivo SIAPS
              </p>
            </div>
          </motion.div>
        </section>

        {/* Section 3 & 4: Data Grid */}
        <section className="flex flex-col bg-surface-container rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
          {/* Redesigned Toolbar */}
          <div className="p-4 flex flex-col gap-3.5 border-b border-outline-variant/10 bg-surface-container-highest/15">
            {/* Row 1: Search + Team Dropdown + Export Button */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg py-2 pl-9 pr-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-xs"
                  placeholder="Buscar por Nome, CPF, CNS ou Equipe..."
                  type="text"
                />
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                {/* Dynamic Team Selector */}
                <div className="relative min-w-[200px]">
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    className="w-full appearance-none bg-surface border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all text-sm h-[38px] cursor-pointer shadow-xs"
                  >
                    <option value="TODAS">Todas as Equipes ({equipesUnicas.length})</option>
                    {equipesUnicas.map((eq) => (
                      <option key={eq} value={eq}>
                        Equipe: {eq}
                      </option>
                    ))}
                  </select>
                  <Users className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>

                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportar}
                  className="px-4 py-2 h-[38px] rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:bg-secondary-fixed-dim transition-colors flex items-center gap-2 whitespace-nowrap text-xs font-semibold shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel Consolidado (.xlsx)
                </motion.button>
              </div>
            </div>

            {/* Row 2: Status Filter Segmented Control Bar */}
            <div className="flex items-center overflow-x-auto pt-1 pb-0.5 no-scrollbar">
              <div className="flex items-center bg-surface border border-outline-variant/30 p-1 rounded-xl gap-1 min-w-max shadow-xs">
                {/* TODOS */}
                <button
                  onClick={() => setStatusFilter('TODOS')}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-xs flex items-center gap-2 transition-all ${
                    statusFilter === 'TODOS'
                      ? 'bg-surface-container-highest text-on-surface font-semibold shadow-xs border border-outline-variant/30'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                  }`}
                >
                  <span>Todos os Registros</span>
                  <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-[11px] rounded-md font-mono-data font-bold">
                    {pacientes.length.toLocaleString('pt-BR')}
                  </span>
                </button>

                {/* AMBAS */}
                <button
                  onClick={() => setStatusFilter('AMBAS')}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-xs flex items-center gap-2 transition-all ${
                    statusFilter === 'AMBAS'
                      ? 'bg-secondary/15 text-secondary border border-secondary/30 font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Presente em Ambas</span>
                  <span className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-[11px] rounded-md font-mono-data font-bold">
                    {kpis.intersecao.toLocaleString('pt-BR')}
                  </span>
                </button>

                {/* APENAS ESUS */}
                <button
                  onClick={() => setStatusFilter('ESUS')}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-xs flex items-center gap-2 transition-all ${
                    statusFilter === 'ESUS'
                      ? 'bg-primary/15 text-primary border border-primary/30 font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Apenas e-SUS</span>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[11px] rounded-md font-mono-data font-bold">
                    {kpis.apenasEsus.toLocaleString('pt-BR')}
                  </span>
                </button>

                {/* APENAS SIAPS */}
                <button
                  onClick={() => setStatusFilter('SIAPS')}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-xs flex items-center gap-2 transition-all ${
                    statusFilter === 'SIAPS'
                      ? 'bg-tertiary/15 text-tertiary border border-tertiary/30 font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span>Apenas SIAPS</span>
                  <span className="px-1.5 py-0.5 bg-tertiary/10 text-tertiary text-[11px] rounded-md font-mono-data font-bold">
                    {kpis.apenasSiaps.toLocaleString('pt-BR')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/30 border-b border-outline-variant/10">
                  <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                    Documento (CPF/CNS)
                  </th>
                  <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Nome do Paciente
                  </th>
                  <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                    Status do Cruzamento
                  </th>
                  <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                    Equipe de Saúde
                  </th>
                  <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    INE
                  </th>
                  <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md divide-y divide-outline-variant/10">
                {filteredPacientes.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-container-highest/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono-data text-on-surface">{p.documento}</td>
                    <td
                      className={`px-4 py-3 truncate max-w-[250px] ${
                        p.nome === 'NOME NÃO CONSTA NO SIAPS'
                          ? 'text-on-surface-variant italic'
                          : 'text-on-surface font-medium'
                      }`}
                      title={p.nome}
                    >
                      {p.nome}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === 'PRESENTE NAS DUAS PLANILHAS' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase">
                          PRESENTE NAS DUAS
                        </span>
                      )}
                      {p.status === 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase">
                          APENAS NO E-SUS
                        </span>
                      )}
                      {p.status === 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary/10 text-tertiary border border-tertiary/20 uppercase">
                          APENAS NO SIAPS
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{p.equipe}</td>
                    <td className="px-4 py-3 font-mono-data text-on-surface-variant">{p.ine}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPacientes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">
                      Nenhum registro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-outline-variant/10 bg-surface-container-highest/20">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Exibindo <span className="font-mono-data text-on-surface">1-{filteredPacientes.length}</span> de{' '}
              <span className="font-mono-data text-on-surface">{kpis.totalAnalisado.toLocaleString('pt-BR')}</span> registros
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLimparMemoria}
              className="px-4 py-1.5 rounded-md font-label-md text-label-md text-error hover:bg-error/10 border border-error/20 hover:border-error/50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Cpu className="w-4 h-4" />
              Destruir Dados da Memória RAM e Sair
            </motion.button>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
