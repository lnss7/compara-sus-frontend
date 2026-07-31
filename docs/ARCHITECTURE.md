# Arquitetura do Sistema - Cruzador de Dados SMS

## 🏗️ Visão Geral da Arquitetura

O sistema adota uma arquitetura **Client-Side Heavy (Stateless)**, garantindo que o processamento pesado e os dados sensíveis fiquem isolados na máquina local do servidor público.

┌─────────────────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR DO USUÁRIO (CLIENTE)                        │
│                                                                             │
│  ┌──────────────────────┐   ┌──────────────────────┐   ┌─────────────────┐  │
│  │  Drag & Drop Excel   │──►│ Engine de Limpeza    │──►│ Engine de Join  │  │
│  │  (e-SUS / SIAPS)     │   │ (Regex CPF/CNS)      │   │ (Full Outer)    │  │
│  └──────────────────────┘   └──────────────────────┘   └─────────────────┘  │
│                                                                 │           │
│  ┌──────────────────────┐   ┌──────────────────────┐            │           │
│  │ Download do Excel    │◄──│ Data Grid (Filtros & │◄───────────┘           │
│  │ Consolidado          │   │ Visualização)        │                        │
│  └──────────────────────┘   └──────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────┘
│ (Apenas Chamada de Audit Log Cego)
▼
┌──────────────────────────┐
│  Supabase DB Serverless  │
│  - Admins & RBAC         │
│  - Logs sem PII          │
│    (Data, Qtd_Linhas)    │
└──────────────────────────┘

## 🔒 Segurança e Conformidade LGPD
* **Zero Storage Strategy:** Nenhum dado extraído das planilhas é salvo em disco ou banco de dados.
* **Tráfego Seguro:** Todo o tráfego HTTP é forçado via HTTPS pela infraestrutura da Vercel.
* **Blind Logging:** O banco de dados no Supabase armazena apenas registros no seguinte formato:
  ```json
  {
    "user_email": "servidor@portoalegre.rs.gov.br",
    "timestamp": "2026-07-31T10:00:00Z",
    "total_records_processed": 4571,
    "action": "CRUZAMENTO_EXECUTA_SUCESSO"
  }