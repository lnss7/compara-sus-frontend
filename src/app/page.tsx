'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  UploadCloud,
  FileText,
  Table,
  Trash2,
  Cpu,
  Eraser,
  History,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useCrossSUSStore, ArquivoAtivo } from '@/lib/store';

export default function ImportacaoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { arquivos, historico, adicionarArquivo, removerArquivo, limparMemoria, processarArquivosReais, isProcessing } =
    useCrossSUSStore();
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const nomeUpper = file.name.toUpperCase();

      let tipo: 'e-SUS AB' | 'SIAPS' = 'e-SUS AB';
      if (nomeUpper.includes('SIAPS') || nomeUpper.includes('ATENDIMENTO')) {
        tipo = 'SIAPS';
      } else if (nomeUpper.includes('ESUS') || nomeUpper.includes('E-SUS')) {
        tipo = 'e-SUS AB';
      } else {
        // Se indefinido, decide com base nos arquivos existentes
        const jaTemEsus = arquivos.some((a) => a.tipo === 'e-SUS AB');
        tipo = jaTemEsus ? 'SIAPS' : 'e-SUS AB';
      }

      const tamanhoMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));

      const novoArquivo: ArquivoAtivo = {
        id: String(Date.now() + Math.random()),
        nome: file.name,
        tipo,
        tamanhoMB,
        registros: 0, // será atualizado no cruzamento
        buffer,
      };

      adicionarArquivo(novoArquivo);
      setErrorMsg(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((f) => processFile(f));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((f) => processFile(f));
    }
  };

  const handleIniciarProcessamento = () => {
    router.push('/cruzamento?autoProcess=true');
  };

  const temEsus = arquivos.some((a) => a.tipo === 'e-SUS AB');
  const temSiaps = arquivos.some((a) => a.tipo === 'SIAPS');
  const prontoParaProcessar = temEsus && temSiaps;

  const getTextoBotaoProcessar = () => {
    if (isProcessing) return 'Redirecionando para o Dashboard...';
    if (!temEsus && !temSiaps) return 'Anexe as 2 Planilhas (e-SUS e SIAPS) para Avançar';
    if (temEsus && !temSiaps) return 'Falta Anexar a Base SIAPS (1/2 Carregado)';
    if (!temEsus && temSiaps) return 'Falta Anexar a Base e-SUS (1/2 Carregado)';
    return 'Ir para o Dashboard e Iniciar Processamento (2/2 Prontos)';
  };

  return (
    <PageTransition>
      <div className="flex flex-col w-full gap-stack-lg">
        <PageHeader
          title="Gerenciamento de Arquivos e Importação"
          subtitle="Gerencie e processe as bases de dados e-SUS e SIAPS para o cruzamento analítico."
        />

        {errorMsg && (
          <div className="bg-error/10 border border-error/30 text-error p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="font-body-md text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
          {/* Left Column: Dropzone & Files List */}
          <div className="xl:col-span-8 flex flex-col gap-stack-lg">
            {/* Input oculto */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
              multiple
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`bg-surface-container/60 backdrop-blur-md rounded-xl p-8 border ${
                dragOver ? 'border-primary bg-surface-container/90' : 'border-outline-variant/20'
              } flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden group cursor-pointer transition-all hover:border-primary/50 hover:bg-surface-container/80 shadow-lg shadow-black/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="z-10 flex flex-col items-center gap-stack-md text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <div className="flex flex-col gap-stack-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Arraste seus arquivos e-SUS e SIAPS aqui
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Suporta Excel (.xlsx, .xls) e CSV. Leitura 100% Client-Side.
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-4 px-6 py-2 bg-surface border border-outline-variant/30 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-highest transition-colors"
                >
                  Procurar Arquivos no Computador
                </motion.button>
              </div>
            </motion.div>

            {/* Arquivos Ativos */}
            <div className="flex flex-col gap-stack-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Arquivos Ativos na Memória
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-label-sm text-label-sm px-3 py-1 rounded-full border ${
                      temEsus
                        ? 'text-secondary bg-secondary/10 border-secondary/20'
                        : 'text-on-surface-variant/60 bg-surface-container-high border-outline-variant/20'
                    }`}
                  >
                    e-SUS: {temEsus ? '✓ Anexado' : 'Pendente'}
                  </span>
                  <span
                    className={`font-label-sm text-label-sm px-3 py-1 rounded-full border ${
                      temSiaps
                        ? 'text-secondary bg-secondary/10 border-secondary/20'
                        : 'text-on-surface-variant/60 bg-surface-container-high border-outline-variant/20'
                    }`}
                  >
                    SIAPS: {temSiaps ? '✓ Anexado' : 'Pendente'}
                  </span>
                </div>
              </div>

              {arquivos.length === 0 ? (
                <div className="p-6 bg-surface-container/40 rounded-xl border border-dashed border-outline-variant/30 flex items-center justify-center text-center">
                  <p className="font-body-md text-on-surface-variant/70 text-sm">
                    Nenhum arquivo anexado ainda. Faça o upload das duas planilhas acima para habilitar o cruzamento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {arquivos.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -2 }}
                      className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 flex flex-col gap-stack-md shadow-md shadow-black/20 relative overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 ${
                          file.tipo === 'e-SUS AB' ? 'bg-primary/10' : 'bg-secondary/10'
                        } rounded-full blur-2xl -mr-16 -mt-16`}
                      ></div>
                      <div className="flex items-start justify-between z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
                            {file.tipo === 'e-SUS AB' ? (
                              <FileText className="w-5 h-5 text-primary" />
                            ) : (
                              <Table className="w-5 h-5 text-secondary" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface truncate max-w-[180px]">
                              {file.nome}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                              {file.tipo}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removerArquivo(file.id)}
                          className="text-on-surface-variant hover:text-error transition-colors p-1"
                          title="Excluir arquivo"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2 border-t border-outline-variant/10 pt-4 z-10">
                        <div className="flex flex-col gap-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Tamanho
                          </span>
                          <span className="font-mono-data text-mono-data text-on-surface">
                            {file.tamanhoMB} MB
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Status
                          </span>
                          <span className="font-mono-data text-mono-data text-secondary flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Anexado
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex items-center gap-4 mt-4">
              <motion.button
                whileHover={prontoParaProcessar && !isProcessing ? { scale: 1.01 } : {}}
                whileTap={prontoParaProcessar && !isProcessing ? { scale: 0.99 } : {}}
                disabled={!prontoParaProcessar || isProcessing}
                onClick={handleIniciarProcessamento}
                className={`flex-1 font-label-md text-label-md px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden group font-semibold ${
                  prontoParaProcessar && !isProcessing
                    ? 'bg-primary-container text-on-primary-container hover:bg-primary-container/90 shadow-lg shadow-primary-container/20 cursor-pointer'
                    : 'bg-surface-container-high text-on-surface-variant/50 border border-outline-variant/20 cursor-not-allowed opacity-60'
                }`}
              >
                <Cpu className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                {getTextoBotaoProcessar()}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={limparMemoria}
                className="px-6 py-4 rounded-xl border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface transition-colors flex items-center gap-2"
              >
                <Eraser className="w-5 h-5" />
                Limpar Tudo
              </motion.button>
            </div>
          </div>

          {/* Right Column: Queue & History */}
          <div className="xl:col-span-4 flex flex-col gap-stack-md">
            <div className="bg-surface-container rounded-xl border border-outline-variant/20 flex flex-col overflow-hidden shadow-lg shadow-black/20 h-full">
              <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-highest/50">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <History className="w-5 h-5 text-on-surface-variant" />
                  Histórico de Cruzamentos
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {historico.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg bg-surface border ${
                      item.status === 'Sucesso'
                        ? 'border-outline-variant/10 hover:bg-surface-container-highest'
                        : 'border-error/20 hover:bg-error/5 relative overflow-hidden'
                    } flex flex-col gap-3 transition-colors group`}
                  >
                    {item.status !== 'Sucesso' && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.status === 'Sucesso'
                              ? 'bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]'
                              : 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.5)]'
                          }`}
                        ></span>
                        <span
                          className={`font-label-md text-label-md ${
                            item.status === 'Sucesso' ? 'text-on-surface' : 'text-error'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <span className="font-mono-data text-[11px] text-on-surface-variant">
                        {item.horario}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.titulo}
                      </span>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`font-mono-data text-[12px] px-2 py-1 rounded ${
                            item.status === 'Sucesso'
                              ? 'text-on-surface-variant bg-surface-container'
                              : 'text-error bg-error/10'
                          }`}
                        >
                          {item.registros}
                        </span>
                        <span
                          className={`font-mono-data text-[12px] ${
                            item.status === 'Sucesso' ? 'text-secondary' : 'text-on-surface-variant'
                          }`}
                        >
                          {item.tempo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
