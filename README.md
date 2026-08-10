# Calculadora Eleitoral

Motor de cálculo do **sistema proporcional brasileiro** (quociente eleitoral, quociente partidário e sobras).

Serve para estimar a **viabilidade real** de um candidato a cargo proporcional (deputado estadual, federal ou vereador), mostrando em qual etapa ele ainda tem chance:

1. **Vagas diretas** (partido faz o QP + candidato ≥ 10% do QE)
2. **1ª fase de sobras** (partido ≥ 80% do QE + candidato ≥ 20% do QE)
3. **Fase final de sobras** (aberta a todos os partidos, conforme decisão do STF)

## Base legal atualizada

- Código Eleitoral (Lei 4.737/1965), arts. 106 a 109 e 111
- Lei 9.504/1997, arts. 5º e 6º-A
- Resolução TSE 23.677/2021 (com as alterações das Resoluções 23.734/2024 e 23.748/2026)
- STF, ADI 7.228 (participação de todos os partidos na última fase de sobras)

### Regras principais implementadas

| Etapa | Exigência do partido | Exigência do candidato |
|-------|----------------------|------------------------|
| Vagas diretas | QP ≥ 1 (atingiu o QE) | ≥ 10% do QE |
| 1ª fase de sobras | ≥ 80% do QE | ≥ 20% do QE |
| Fase final de sobras | Nenhuma (todos concorrem) | Ordem de votação nominal da legenda |

O Quociente Eleitoral é calculado conforme o art. 9º da Res. TSE 23.677:  
votos válidos ÷ vagas, **desprezando a fração se ≤ 0,5** ou **arredondando para 1 se superior**.

## Como usar

### 1. Instalação

```bash
npm install
npm run build
```

### 2. Executar o exemplo

```bash
npm start
```

### 3. Usar no seu código

```ts
import { calcularBasico } from "./dist/engine/calc.js";

const resultado = calcularBasico({
  uf: "ES",
  cargo: "depestadual",
  vagas: 30,                 // número de cadeiras
  votosValidos: 2_300_000,   // total de votos válidos estimados
  partidoVotos: 95_000,      // votos do partido/federação
  candidatoVotos: 12_000,    // votos do candidato
});

console.log(resultado.etapaPossivel);
console.log(resultado.explicacao);
```

### Campos de entrada

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `vagas` | sim | Número de cadeiras em disputa |
| `votosValidos` | sim | Total de votos válidos (nominais + legenda) |
| `partidoVotos` | sim | Votos do partido ou federação |
| `candidatoVotos` | sim | Votos nominais do candidato |
| `uf` | não | Apenas informativo |
| `cargo` | não | `depestadual`, `depfederal` ou `vereador` |

### O que o resultado traz

- `qe`, `qp`, `minimo10`, `minimo20`, `limiar80`
- Se o partido atingiu QE e 80%
- Se o candidato atingiu 10% e 20%
- `etapaPossivel`: a etapa mais favorável em que ainda há chance
- `explicacao`: textos claros em português
- `baseLegal`: referências das normas usadas

## Limitações (importante)

Esta ferramenta avalia a **elegibilidade mínima** do candidato e do partido em cada etapa.  
Ela **não simula** a disputa completa de médias entre todos os partidos (isso exigiria a lista completa de legendas e seus votos). A ocupação efetiva das sobras depende das médias relativas e da ordem de votação nominal dentro da legenda.

Use como ferramenta de **planejamento e estimativa**, não como previsão definitiva de eleição.

## Licença

MIT
