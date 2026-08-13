import { create } from 'zustand';
import {
  CruzamentoController,
  ExcelExporterAdapter,
  PacienteCruzadoItem,
  KPIsCruzamento,
  BlindAuditPayload,
} from '@backend/index';

export interface PacienteCruzado extends PacienteCruzadoItem {}

export interface ArquivoAtivo {
  id: string;
  nome: string;
  tipo: 'e-SUS AB' | 'SIAPS';
  tamanhoMB: number;
  registros: number;
  buffer?: ArrayBuffer;
}

export interface KPIs extends KPIsCruzamento {}

export interface ProcessingItem {
  id: string;
  titulo: string;
  status: 'Sucesso' | 'Erro de Schema';
  horario: string;
  registros: string;
  tempo: string;
}

interface ComparaSUSState {
  arquivos: ArquivoAtivo[];
  pacientes: PacienteCruzado[];
  kpis: KPIs;
  historico: ProcessingItem[];
  isProcessing: boolean;
  theme: 'dark' | 'light';

  // Actions
  adicionarArquivo: (arquivo: ArquivoAtivo) => void;
  removerArquivo: (id: string) => void;
  processarCruzamento: (novosPacientes: PacienteCruzado[]) => void;
  processarArquivosReais: (userEmail?: string) => Promise<{ sucesso: boolean; erros?: string[] }>;
  exportarExcel: (filtrarStatus?: string, filename?: string) => void;
  limparMemoria: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const mockArquivosIniciais: ArquivoAtivo[] = [
  {
    id: '1',
    nome: 'e-SUS_Pacientes_2026.xlsx',
    tipo: 'e-SUS AB',
    tamanhoMB: 45.2,
    registros: 124502,
  },
  {
    id: '2',
    nome: 'SIAPS_Atendimentos_Q3.csv',
    tipo: 'SIAPS',
    tamanhoMB: 89.1,
    registros: 312980,
  },
];

const mockPacientesIniciais: PacienteCruzado[] = [
  {
    id: '1',
    documento: '700.004.471-49',
    documentoLimpo: '70000447149',
    nome: 'MARIA EDUARDA MARQUES MENDES',
    status: 'PRESENTE NAS DUAS PLANILHAS',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
  {
    id: '2',
    documento: '700.908.924-84',
    documentoLimpo: '70090892484',
    nome: 'LUIS HENRIQUE LAIDENS PEREIRA',
    status: 'PRESENTE NAS DUAS PLANILHAS',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
  {
    id: '3',
    documento: '702.400.539-87',
    documentoLimpo: '70240053987',
    nome: 'GABRIELA ROSA DA SILVA',
    status: 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
  {
    id: '4',
    documento: '735.112.340-34',
    documentoLimpo: '73511234034',
    nome: 'NOME NÃO CONSTA NO SIAPS',
    status: 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)',
    equipe: '-',
    ine: '430382',
  },
  {
    id: '5',
    documento: '000.101.850-70',
    documentoLimpo: '00010185070',
    nome: 'CLAUDIO DO NASCIMENTO BERSAGUI JUNIOR',
    status: 'PRESENTE NAS DUAS PLANILHAS',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
];

const mockKPIsIniciais: KPIs = {
  totalAnalisado: 4571,
  intersecao: 3060,
  apenasEsus: 1423,
  apenasSiaps: 445,
};

const mockHistoricoInicial: ProcessingItem[] = [
  {
    id: '1',
    titulo: 'Cruzamento e-SUS + SIAPS',
    status: 'Sucesso',
    horario: 'Hoje, 09:41',
    registros: '4.571 reg.',
    tempo: '0.4s',
  },
];

const applyThemeToDOM = (theme: 'dark' | 'light') => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

export const useComparaSUSStore = create<ComparaSUSState>((set, get) => ({
  arquivos: [],
  pacientes: [],
  kpis: {
    totalAnalisado: 0,
    intersecao: 0,
    apenasEsus: 0,
    apenasSiaps: 0,
  },
  historico: mockHistoricoInicial,
  isProcessing: false,
  theme: 'dark',

  adicionarArquivo: (novoArquivo) =>
    set((state) => {
      // Substitui se já existir o mesmo tipo, ou adiciona
      const filtrados = state.arquivos.filter((a) => a.tipo !== novoArquivo.tipo);
      return { arquivos: [...filtrados, novoArquivo] };
    }),

  removerArquivo: (id) =>
    set((state) => ({ arquivos: state.arquivos.filter((a) => a.id !== id) })),

  processarCruzamento: (novosPacientes) => {
    const total = novosPacientes.length;
    const intersecao = novosPacientes.filter(
      (p) => p.status === 'PRESENTE NAS DUAS PLANILHAS'
    ).length;
    const apenasEsus = novosPacientes.filter(
      (p) => p.status === 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)'
    ).length;
    const apenasSiaps = novosPacientes.filter(
      (p) => p.status === 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)'
    ).length;

    set({
      pacientes: novosPacientes,
      kpis: {
        totalAnalisado: total,
        intersecao,
        apenasEsus,
        apenasSiaps,
      },
    });
  },

  processarArquivosReais: async (userEmail?: string) => {
    const { arquivos } = get();
    const esusFile = arquivos.find((a) => a.tipo === 'e-SUS AB');
    const siapsFile = arquivos.find((a) => a.tipo === 'SIAPS');

    if (!esusFile?.buffer || !siapsFile?.buffer) {
      return {
        sucesso: false,
        erros: ['Por favor, selecione ambos os arquivos (e-SUS e SIAPS) com buffer de dados válido.'],
      };
    }

    set({ isProcessing: true });
    const inicio = performance.now();

    try {
      const controller = new CruzamentoController();
      const res = await controller.processarArquivos(esusFile.buffer, siapsFile.buffer, userEmail);

      const tempoMs = ((performance.now() - inicio) / 1000).toFixed(1);

      if (!res.sucesso || !res.resultado) {
        set((state) => ({
          isProcessing: false,
          historico: [
            {
              id: String(Date.now()),
              titulo: `Cruzamento ${esusFile.nome} + ${siapsFile.nome}`,
              status: 'Erro de Schema',
              horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              registros: 'Schema inválido',
              tempo: `${tempoMs}s`,
            },
            ...state.historico,
          ],
        }));
        return { sucesso: false, erros: res.erros || ['Erro de validação de esquema.'] };
      }

      // Atualiza estado do frontend com o resultado limpo do backend
      const resultado = res.resultado;
      set((state) => ({
        pacientes: resultado.pacientes,
        kpis: resultado.kpis,
        isProcessing: false,
        historico: [
          {
            id: String(Date.now()),
            titulo: `Cruzamento e-SUS (${resultado.kpis.totalAnalisado} reg.)`,
            status: 'Sucesso',
            horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            registros: `${resultado.kpis.totalAnalisado.toLocaleString('pt-BR')} reg.`,
            tempo: `${tempoMs}s`,
          },
          ...state.historico,
        ],
      }));

      // Dispara envio do Blind Audit Log para a API /api/audit (Supabase / Fallback)
      try {
        const payload: BlindAuditPayload = {
          userEmail: userEmail || 'servidor@portoalegre.rs.gov.br',
          timestamp: new Date().toISOString(),
          totalRecordsProcessed: resultado.kpis.totalAnalisado,
          action: 'CRUZAMENTO_EXECUTA_SUCESSO',
        };
        await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (auditErr) {
        console.warn('Falha silenciosa ao registrar audit log na API:', auditErr);
      }

      return { sucesso: true };
    } catch (err: any) {
      set({ isProcessing: false });
      return { sucesso: false, erros: [err.message || 'Erro inesperado no cruzamento.'] };
    }
  },

  exportarExcel: (filtrarStatus?: string, filename = 'Resultado_Cruzamento_ComparaSUS.xlsx') => {
    const { pacientes } = get();
    const exporter = new ExcelExporterAdapter();
    const buffer = exporter.gerarPlanilhaBuffer(pacientes, { filtrarStatus });

    // Converte Buffer para ArrayBuffer puro para o Blob do navegador
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  limparMemoria: () =>
    set({
      arquivos: [],
      pacientes: [],
      kpis: {
        totalAnalisado: 0,
        intersecao: 0,
        apenasEsus: 0,
        apenasSiaps: 0,
      },
    }),

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyThemeToDOM(nextTheme);
      return { theme: nextTheme };
    }),

  setTheme: (newTheme) => {
    applyThemeToDOM(newTheme);
    set({ theme: newTheme });
  },
}));

// Export alias for backwards compatibility
export const useCrossSUSStore = useComparaSUSStore;
