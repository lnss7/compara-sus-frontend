import { create } from 'zustand';

export interface PacienteCruzado {
  id: string;
  documento: string; // CPF or CNS normalized
  nome: string;
  equipe: string;
  ine: string;
  status: 'PRESENTE NAS DUAS PLANILHAS' | 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)' | 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)';
}

export interface ArquivoAtivo {
  id: string;
  nome: string;
  tipo: 'e-SUS AB' | 'SIAPS';
  tamanhoMB: number;
  registros: number;
}

export interface KPIs {
  totalAnalisado: number;
  intersecao: number;
  apenasEsus: number;
  apenasSiaps: number;
}

export interface ProcessingItem {
  id: string;
  titulo: string;
  status: 'Sucesso' | 'Erro de Schema';
  horario: string;
  registros: string;
  tempo: string;
}

interface CrossSUSState {
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
  limparMemoria: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const mockArquivosIniciais: ArquivoAtivo[] = [
  {
    id: '1',
    nome: 'e-SUS_Pacientes_2023.xlsx',
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
    nome: 'MARIA EDUARDA MARQUES MENDES',
    status: 'PRESENTE NAS DUAS PLANILHAS',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
  {
    id: '2',
    documento: '700.908.924-84',
    nome: 'LUIS HENRIQUE LAIDENS PEREIRA',
    status: 'PRESENTE NAS DUAS PLANILHAS',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
  {
    id: '3',
    documento: '702.400.539-87',
    nome: 'GABRIELA ROSA DA SILVA',
    status: 'PRESENTE APENAS NA PLANILHA 1 (e-SUS)',
    equipe: 'ESF ASA BRANCA I',
    ine: '430382',
  },
  {
    id: '4',
    documento: '735.112.340-34',
    nome: 'NOME NÃO CONSTA NO SIAPS',
    status: 'PRESENTE APENAS NA PLANILHA 2 (SIAPS)',
    equipe: '-',
    ine: '430382',
  },
  {
    id: '5',
    documento: '000.101.850-70',
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
    titulo: 'Cruzamento e-SUS + SISREG',
    status: 'Sucesso',
    horario: 'Hoje, 09:41',
    registros: '245k reg.',
    tempo: '42s',
  },
  {
    id: '2',
    titulo: 'Importação CNES_Atualizado.csv',
    status: 'Erro de Schema',
    horario: 'Ontem, 16:20',
    registros: 'Col. ausente',
    tempo: '--',
  },
  {
    id: '3',
    titulo: 'Atualização Base Territorial',
    status: 'Sucesso',
    horario: '12 Fev, 14:15',
    registros: '1.2M reg.',
    tempo: '3m 12s',
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

export const useCrossSUSStore = create<CrossSUSState>((set) => ({
  arquivos: mockArquivosIniciais,
  pacientes: mockPacientesIniciais,
  kpis: mockKPIsIniciais,
  historico: mockHistoricoInicial,
  isProcessing: false,
  theme: 'dark',

  adicionarArquivo: (novoArquivo) =>
    set((state) => ({ arquivos: [...state.arquivos, novoArquivo] })),

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
