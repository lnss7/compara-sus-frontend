### 3. `docs/FEATURES.md`

```markdown
# Especificação de Funcionalidades (Features)

## 📦 Módulo 1: Ingestão de Planilhas
- [ ] **Area Drag & Drop:** Suporte para arquivos `.xlsx` e `.xls`.
- [ ] **Leitura Automática de Abas:** Mapeamento automático das abas `ESUS` e `SIAPS`.
- [ ] **Tratamento de Cabeçalhos Assíncronos:** Ignora automaticamente as 17 linhas de metadados do SIAPS e lê o e-SUS a partir da linha 2.
- [ ] **Validação em Tempo Real:** Alerta visual se o arquivo não contiver as colunas esperadas.

## ⚙️ Módulo 2: Motor de Cruzamento
- [ ] **Higienização de Documentos:**
  - Extração e limpeza de caracteres de CPF e CNS.
  - Padding de zeros à esquerda (CPF = 11 dígitos, CNS = 15 dígitos).
- [ ] **Cruzamento Full Outer Join:**
  - `PRESENTE NAS DUAS PLANILHAS`
  - `PRESENTE APENAS NA PLANILHA 1 (e-SUS)`
  - `PRESENTE APENAS NA PLANILHA 2 (SIAPS)`
- [ ] **Unificação de Nomes:** Preenchimento do campo Nome no resultado usando a base e-SUS quando o SIAPS estiver em branco.

## 📊 Módulo 3: Visualização & Dashboard
- [ ] **Cards de Métricas (KPIs):**
  - Total de registros analisados.
  - Total de correspondências (Ambas).
  - Total exclusivo e-SUS.
  - Total exclusivo SIAPS.
- [ ] **Data Grid Interativo:**
  - Pagição de alta performance (TanStack Table).
  - Busca global rápida por CPF, CNS ou Nome.
  - Filtros combinados por Tag de Status e Nome da Equipe.
  - Badges coloridas por status.

## 📥 Módulo 4: Exportação
- [ ] **Gerador Excel:** Exportação com formatação (cabeçalhos destacados, ajuste automático de largura de coluna).
- [ ] **Exportação Parcial:** Opção de baixar apenas os dados filtrados na tela.

## 👥 Módulo 5: Administração e Auditoria
- [ ] **Login com Device Flow / Chave Institucional.**
- [ ] **Painel Admin:** Gerenciamento de acessos de servidores.
- [ ] **Histórico de Logs Cegos:** Registro de acessos e contagem de execuções.