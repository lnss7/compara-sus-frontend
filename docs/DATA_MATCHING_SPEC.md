# Especificação Técnica de Limpeza e Cruzamento

## 🛠️ Normalização Regex (JavaScript)

```typescript
export function normalizarDocumento(valor: string | number | null | undefined): string {
  if (!valor) return "";
  
  // Converte números para string ignorando notação científica
  let str = String(valor).trim();
  
  // Remove tudo que não for número
  let apenasDigitos = str.replace(/\D/g, "");
  
  if (apenasDigitos.length === 0) return "";
  
  // Se for <= 11 dígitos, preenche com zeros à esquerda até dar 11 (CPF)
  if (apenasDigitos.length <= 11) {
    return apenasDigitos.padStart(11, "0");
  }
  
  // Se for > 11 e <= 15 dígitos, preenche com zeros à esquerda até dar 15 (CNS)
  if (apenasDigitos.length <= 15) {
    return apenasDigitos.padStart(15, "0");
  }
  
  return apenasDigitos;
}
```

## 🔄 Algoritmo de Cruzamento (Lógica Pseudocódigo)

```typescript
1. Mapear e-SUS
const mapEsus = new Map<string, PacienteEsus>();
esusData.forEach(row => {
  const docLimpo = normalizarDocumento(row["CPF/CNS"]);
  if (docLimpo) mapEsus.set(docLimpo, row);
});

// 2. Mapear SIAPS
const mapSiaps = new Map<string, PacienteSiaps>();
siapsData.forEach(row => {
  const docLimpo = normalizarDocumento(row["CPF"]) || normalizarDocumento(row["CNS"]);
  if (docLimpo) mapSiaps.set(docLimpo, row);
});

// 3. Executar Join
const todosDocumentos = new Set([...mapEsus.keys(), ...mapSiaps.keys()]);
const resultado = [];

todosDocumentos.forEach(doc => {
  const esus = mapEsus.get(doc);
  const siaps = mapSiaps.get(doc);

  let status = "";
  if (esus && siaps) status = "PRESENTE NAS DUAS PLANILHAS";
  else if (esus) status = "PRESENTE APENAS NA PLANILHA 1 (e-SUS)";
  else status = "PRESENTE APENAS NA PLANILHA 2 (SIAPS)";

  resultado.push({
    documento: doc,
    nome: esus?.Nome || "NOME NÃO CONSTA NO SIAPS",
    equipe: esus?.["Nome equipe"] || "-",
    ine: esus?.["INE equipe"] || siaps?.INE || "-",
    status: status
  });
});
```