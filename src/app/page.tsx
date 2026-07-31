'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { useCrossSUSStore } from '@/lib/store';

export default function ImportacaoPage() {
  const router = useRouter();
  const { arquivos, historico, removerArquivo, limparMemoria } = useCrossSUSStore();
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleIniciarProcessamento = () => {
    router.push('/cruzamento');
  };

  return (
    <PageTransition>
      <div className="flex flex-col w-full gap-stack-lg">
        {/* Standardized Page Header */}
        <PageHeader
          title="Gerenciamento de Arquivos e Importação"
          subtitle="Gerencie e processe as bases de dados e-SUS e SIAPS para o cruzamento analítico."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
          {/* Left Column: Dropzone & Files List */}
          <div className="xl:col-span-8 flex flex-col gap-stack-lg">
            {/* Drag & Drop Zone */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
                    Arraste seus arquivos aqui
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Suporta Excel (.xlsx, .xls) e CSV. Tamanho máximo: 500MB.
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 px-6 py-2 bg-surface border border-outline-variant/30 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-highest transition-colors"
                >
                  Procurar Arquivos
                </motion.button>
              </div>
            </motion.div>

            {/* Arquivos Ativos */}
            <div className="flex flex-col gap-stack-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Arquivos Ativos
                </h2>
                <span className="font-label-sm text-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                  {arquivos.length} Arquivos Prontos
                </span>
              </div>

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
                          <span className="font-label-md text-label-md text-on-surface">
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
                          Registros
                        </span>
                        <span className="font-mono-data text-mono-data text-on-surface">
                          {file.registros.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex items-center gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleIniciarProcessamento}
                className="flex-1 bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container/90 transition-colors shadow-lg shadow-primary-container/20 relative overflow-hidden group font-semibold"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                <Cpu className="w-5 h-5" />
                Iniciar Processamento Analítico
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
                  Fila de Processamento
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
