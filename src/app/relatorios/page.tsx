'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Download,
  FileCode,
  FileSpreadsheet,
  Code2,
  Users,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowRight,
} from 'lucide-react';
import { useCrossSUSStore } from '@/lib/store';
import Link from 'next/link';

export default function RelatoriosPage() {
  const { pacientes, kpis, exportarExcel, arquivos } = useCrossSUSStore();

  const temDados = pacientes.length > 0;

  // Estatísticas reais agrupadas por Equipe de Saúde
  const breakdownPorEquipe = useMemo(() => {
    const map = new Map<
      string,
      { total: number; intersecao: number; apenasEsus: number; apenasSiaps: number }
    >();

    for (const p of pacientes) {
      const eq = p.equipe && p.equipe !== '-' ? p.equipe : 'EQUIPE NÃO INFORMADA';
      const curr = map.get(eq) || { total: 0, intersecao: 0, apenasEsus: 0, apenasSiaps: 0 };
      curr.total++;
      if (p.status === 'PRESENTE NAS DUAS PLANILHAS') curr.intersecao++;
      else if (p.status === 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)') curr.apenasEsus++;
      else if (p.status === 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)') curr.apenasSiaps++;
      map.set(eq, curr);
    }

    return Array.from(map.entries())
      .map(([equipe, data]) => ({
        equipe,
        ...data,
        pctConformidade: data.total ? Math.round((data.intersecao / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [pacientes]);

  const handleExportarXLSX = () => {
    exportarExcel();
  };

  const handleExportarCSV = () => {
    if (pacientes.length === 0) return;

    const headers = [
      'Nome',
      'Cpf/CNS',
      'Status do Cruzamento',
      'Endereco',
      'Telefone',
      'Nascimento',
      'Sexo',
      'Raca cor',
      'CNES',
      'INE',
      'Parametro',
      'Cadastro Individual',
      'Cadastro Individual e Cadastro Domiciliar',
      'Pessoa acompanhada sem criterio de vulnerabilidade',
      'Crianca acompanhada',
      'Pessoa Idosa acompanhada',
      'Beneficiario BPC ou PBF',
      'Crianca beneficiaria BPC ou PBF',
      'Pessoa Idosa beneficiaria BPC ou PBF',
      'Pessoa Vinculada a Equipe',
    ];

    const csvRows = [headers.join(';')];

    for (const p of pacientes) {
      const rawE = p.rawEsus || {};
      const rawS = p.rawSiaps || {};

      const values = [
        `"${(p.nome || '').replace(/"/g, '""')}"`,
        `"${p.documento || ''}"`,
        `"${p.status || ''}"`,
        `"${(rawE['Endereço'] || rawE['Endereco'] || '').replace(/"/g, '""')}"`,
        `"${(rawE['Telefone celular'] || rawE['Telefone residencial'] || rawE['Telefone de contato'] || '').replace(/"/g, '""')}"`,
        `"${rawE['Data de nascimento'] || rawS['Nascimento'] || ''}"`,
        `"${rawE['Sexo'] || rawS['Sexo'] || ''}"`,
        `"${rawS['Raça cor'] || ''}"`,
        `"${rawS['CNES'] || ''}"`,
        `"${p.ine !== '-' ? p.ine : rawS['INE'] || ''}"`,
        `"${rawS['Parâmetro'] || ''}"`,
        `"${rawS['Cadastro Individual'] || ''}"`,
        `"${rawS['Cadastro Individual e Cadastro Domiciliar'] || ''}"`,
        `"${rawS['Pessoa acompanhada sem critério de vulnerabilidade'] || ''}"`,
        `"${rawS['Criança acompanhada'] || ''}"`,
        `"${rawS['Pessoa Idosa acompanhada'] || ''}"`,
        `"${rawS['Beneficiário BPC ou PBF'] || ''}"`,
        `"${rawS['Criança beneficiária BPC ou PBF'] || ''}"`,
        `"${rawS['Pessoa Idosa beneficiária BPC ou PBF'] || ''}"`,
        `"${rawS['Pessoa Vinculada à Equipe'] || ''}"`,
      ];
      csvRows.push(values.join(';'));
    }

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cruzamento_eSUS_SIAPS_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImprimirRelatorio = () => {
    window.print();
  };

  const dataAtual = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  return (
    <PageTransition>
      {/* 1. Interface Web da Tela (Oculta ao Imprimir / Gerar PDF) */}
      <div className="flex flex-col w-full relative p-2 lg:p-4 gap-6 max-w-container-max mx-auto print:hidden">
        {/* Header */}
        <PageHeader
          title="Central de Relatórios Analíticos"
          subtitle="Gere relatórios consolidados em XLSX, CSV e PDF baseados nos dados higienizados da memória local."
          actions={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportarXLSX}
              disabled={!temDados}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-xl hover:bg-primary-container transition-all shadow-md text-on-primary font-semibold text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel Consolidado (.xlsx)</span>
            </motion.button>
          }
        />

        {/* State Banner if No Data */}
        {!temDados && (
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 text-tertiary flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface text-base font-semibold">
                  Nenhuma planilha importada no momento
                </h3>
                <p className="text-on-surface-variant text-sm mt-0.5">
                  Anexe os relatórios do e-SUS e SIAPS para gerar relatórios e métricas de conformidade em tempo real.
                </p>
              </div>
            </div>
            <Link
              href="/cruzamento"
              className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-semibold text-xs flex items-center gap-2 hover:bg-secondary-fixed-dim transition-colors whitespace-nowrap"
            >
              <span>Ir para Importação</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Cards de Exportação */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card XLSX */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={handleExportarXLSX}
            className={`bg-surface-container p-5 rounded-2xl border border-outline-variant/30 transition-all flex flex-col justify-between h-40 ${
              temDados ? 'cursor-pointer hover:border-secondary/50 shadow-sm' : 'opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 uppercase">
                20 COLUNAS
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface font-semibold text-base mb-0.5">
                Planilha Detalhada (.xlsx)
              </h3>
              <p className="text-on-surface-variant text-xs">
                Exporta os 20 campos consolidados do e-SUS e SIAPS.
              </p>
            </div>
          </motion.div>

          {/* Card CSV */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={handleExportarCSV}
            className={`bg-surface-container p-5 rounded-2xl border border-outline-variant/30 transition-all flex flex-col justify-between h-40 ${
              temDados ? 'cursor-pointer hover:border-primary/50 shadow-sm' : 'opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase">
                CSV UTF-8
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface font-semibold text-base mb-0.5">
                Exportação Bruta (.csv)
              </h3>
              <p className="text-on-surface-variant text-xs">
                Formato leve separado por ponto e vírgula.
              </p>
            </div>
          </motion.div>

          {/* Card PDF / Impressão */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={handleImprimirRelatorio}
            className={`bg-surface-container p-5 rounded-2xl border border-outline-variant/30 transition-all flex flex-col justify-between h-40 ${
              temDados ? 'cursor-pointer hover:border-tertiary/50 shadow-sm' : 'opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 text-tertiary flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/20 uppercase">
                EXECUTIVO
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface font-semibold text-base mb-0.5">
                Relatório de Gestão (PDF/Print)
              </h3>
              <p className="text-on-surface-variant text-xs">
                Imprime o resumo executivo e métricas da SMS.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Análise Gráfica */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tabela/Métricas por Equipe */}
          <div className="lg:col-span-8 bg-surface-container p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  <h2 className="font-headline-md text-on-surface text-base font-semibold">
                    Consolidado por Equipe de Saúde
                  </h2>
                </div>
                <span className="text-xs font-mono-data text-on-surface-variant">
                  {breakdownPorEquipe.length} equipe(s) encontrada(s)
                </span>
              </div>

              {temDados ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/10 text-[11px] uppercase tracking-wider text-on-surface-variant">
                        <th className="py-2.5 px-3">Equipe</th>
                        <th className="py-2.5 px-3">Total Analisado</th>
                        <th className="py-2.5 px-3">Interseção (Ambas)</th>
                        <th className="py-2.5 px-3">Apenas e-SUS</th>
                        <th className="py-2.5 px-3">Apenas SIAPS</th>
                        <th className="py-2.5 px-3 text-right">Conformidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-sm">
                      {breakdownPorEquipe.map((eq) => (
                        <tr key={eq.equipe} className="hover:bg-surface-container-highest/30">
                          <td className="py-3 px-3 font-medium text-on-surface">{eq.equipe}</td>
                          <td className="py-3 px-3 font-mono-data text-on-surface">
                            {eq.total.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-3 font-mono-data text-secondary font-semibold">
                            {eq.intersecao.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-3 font-mono-data text-primary">
                            {eq.apenasEsus.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-3 font-mono-data text-tertiary">
                            {eq.apenasSiaps.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2 py-0.5 rounded text-xs font-bold font-mono-data bg-secondary/10 text-secondary border border-secondary/20">
                              {eq.pctConformidade}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center text-on-surface-variant text-sm">
                  Aguardando importação dos relatórios para exibir as métricas por equipe.
                </div>
              )}
            </div>
          </div>

          {/* Resumo Geral de Conformidade */}
          <div className="lg:col-span-4 bg-surface-container p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-primary" />
                <h2 className="font-headline-md text-on-surface text-base font-semibold">
                  Índice de Conformidade Geral
                </h2>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {/* Interseção */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      Presentes nas duas bases (Interseção)
                    </span>
                    <span className="text-secondary font-mono-data font-bold">
                      {kpis.totalAnalisado
                        ? Math.round((kpis.intersecao / kpis.totalAnalisado) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          kpis.totalAnalisado
                            ? Math.round((kpis.intersecao / kpis.totalAnalisado) * 100)
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 0.8 }}
                      className="bg-secondary h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Apenas e-SUS */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Exclusivos e-SUS AB
                    </span>
                    <span className="text-primary font-mono-data font-bold">
                      {kpis.totalAnalisado
                        ? Math.round((kpis.apenasEsus / kpis.totalAnalisado) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          kpis.totalAnalisado
                            ? Math.round((kpis.apenasEsus / kpis.totalAnalisado) * 100)
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Apenas SIAPS */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      Exclusivos SIAPS
                    </span>
                    <span className="text-tertiary font-mono-data font-bold">
                      {kpis.totalAnalisado
                        ? Math.round((kpis.apenasSiaps / kpis.totalAnalisado) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          kpis.totalAnalisado
                            ? Math.round((kpis.apenasSiaps / kpis.totalAnalisado) * 100)
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-tertiary h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Total Geral SMS Porto Alegre</span>
              <span className="font-mono-data text-on-surface font-bold text-sm">
                {kpis.totalAnalisado.toLocaleString('pt-BR')} pacientes
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 2. Documento Formal em PDF (Exibido EXCLUSIVAMENTE na Impressão / Salvamento PDF) */}
      <div className="hidden print:block font-sans text-slate-900 bg-white p-6 w-full max-w-4xl mx-auto">
        {/* Cabeçalho Institucional */}
        <div className="border-b-2 border-slate-900 pb-3 mb-5 flex justify-between items-start">
          <div>
            <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
              Secretaria Municipal de Saúde de Porto Alegre
            </h1>
            <h2 className="text-sm font-bold text-slate-700 mt-1">
              Relatório Executivo de Cruzamento de Dados (e-SUS AB x SIAPS)
            </h2>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Higienização de duplicidades e inconsistências cadastrais da Atenção Primária
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-700">
            <p className="font-bold text-slate-900">COMPARA-SUS • SMS POA</p>
            <p>Data: {dataAtual}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Local Processed (LGPD)</p>
          </div>
        </div>

        {/* 1. Indicadores Globais */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            1. Indicadores Globais de Conformidade
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-2.5 border border-slate-300 rounded bg-slate-50">
              <p className="text-[10px] font-bold text-slate-600 uppercase">Total Analisado</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {kpis.totalAnalisado.toLocaleString('pt-BR')}
              </p>
              <p className="text-[9px] text-slate-500">Pacientes unificados</p>
            </div>

            <div className="p-2.5 border border-emerald-400 rounded bg-emerald-50/60">
              <p className="text-[10px] font-bold text-emerald-800 uppercase">Presentes em Ambas</p>
              <p className="text-base font-bold text-emerald-900 mt-0.5">
                {kpis.intersecao.toLocaleString('pt-BR')}
              </p>
              <p className="text-[9px] font-bold text-emerald-700">
                {kpis.totalAnalisado ? Math.round((kpis.intersecao / kpis.totalAnalisado) * 100) : 0}% de conformidade
              </p>
            </div>

            <div className="p-2.5 border border-blue-400 rounded bg-blue-50/60">
              <p className="text-[10px] font-bold text-blue-800 uppercase">Apenas e-SUS AB</p>
              <p className="text-base font-bold text-blue-900 mt-0.5">
                {kpis.apenasEsus.toLocaleString('pt-BR')}
              </p>
              <p className="text-[9px] font-bold text-blue-700">
                {kpis.totalAnalisado ? Math.round((kpis.apenasEsus / kpis.totalAnalisado) * 100) : 0}% do total
              </p>
            </div>

            <div className="p-2.5 border border-amber-400 rounded bg-amber-50/60">
              <p className="text-[10px] font-bold text-amber-800 uppercase">Apenas SIAPS</p>
              <p className="text-base font-bold text-amber-900 mt-0.5">
                {kpis.apenasSiaps.toLocaleString('pt-BR')}
              </p>
              <p className="text-[9px] font-bold text-amber-700">
                {kpis.totalAnalisado ? Math.round((kpis.apenasSiaps / kpis.totalAnalisado) * 100) : 0}% do total
              </p>
            </div>
          </div>
        </div>

        {/* 2. Tabela de Desempenho por Equipes de Saúde */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            2. Desempenho e Divergências por Equipe de Saúde
          </h3>
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 text-slate-800">
                <th className="py-1.5 px-2 font-bold">Equipe de Saúde</th>
                <th className="py-1.5 px-2 font-bold text-center">Total Analisado</th>
                <th className="py-1.5 px-2 font-bold text-emerald-800 text-center">Presentes em Ambas</th>
                <th className="py-1.5 px-2 font-bold text-blue-800 text-center">Exclusivos e-SUS</th>
                <th className="py-1.5 px-2 font-bold text-amber-800 text-center">Exclusivos SIAPS</th>
                <th className="py-1.5 px-2 font-bold text-slate-900 text-right">Taxa Conformidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {breakdownPorEquipe.map((eq) => (
                <tr key={eq.equipe}>
                  <td className="py-1.5 px-2 font-semibold text-slate-900">{eq.equipe}</td>
                  <td className="py-1.5 px-2 text-center text-slate-700">{eq.total.toLocaleString('pt-BR')}</td>
                  <td className="py-1.5 px-2 text-center text-emerald-800 font-bold">{eq.intersecao.toLocaleString('pt-BR')}</td>
                  <td className="py-1.5 px-2 text-center text-blue-800">{eq.apenasEsus.toLocaleString('pt-BR')}</td>
                  <td className="py-1.5 px-2 text-center text-amber-800">{eq.apenasSiaps.toLocaleString('pt-BR')}</td>
                  <td className="py-1.5 px-2 text-right font-bold text-slate-900">{eq.pctConformidade}%</td>
                </tr>
              ))}
              {breakdownPorEquipe.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-slate-500 italic">
                    Nenhuma equipe processada na memória local.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Resumo de Porcentagens de Discrepância */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            3. Resumo Percentual de Conformidade
          </h3>
          <div className="space-y-1.5 text-[11px] bg-slate-50 p-3 border border-slate-200 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Conformidade Plena (Cadastrados em ambas as bases):</span>
              <span className="font-bold text-emerald-800">
                {kpis.totalAnalisado ? Math.round((kpis.intersecao / kpis.totalAnalisado) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Discrepância e-SUS (Pendente de vínculo SIAPS):</span>
              <span className="font-bold text-blue-800">
                {kpis.totalAnalisado ? Math.round((kpis.apenasEsus / kpis.totalAnalisado) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Discrepância SIAPS (Pendente de cadastro e-SUS):</span>
              <span className="font-bold text-amber-800">
                {kpis.totalAnalisado ? Math.round((kpis.apenasSiaps / kpis.totalAnalisado) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé Oficial */}
        <div className="border-t border-slate-400 pt-3 mt-8 flex justify-between items-center text-[9px] text-slate-500">
          <p>Documento oficial emitido pelo sistema COMPARA-SUS • Secretaria Municipal de Saúde de Porto Alegre</p>
          <p>Processamento 100% Client-Side em Conformidade com a LGPD</p>
        </div>
      </div>
    </PageTransition>
  );
}

