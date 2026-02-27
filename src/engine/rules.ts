export function arredondaQE(qeCru: number): number {
  // Regra prática: em simulação, mantemos QE inteiro para comunicação simples.
  // Em apuração oficial, o TSE trabalha com divisão inteira para QE e QP.
  return Math.floor(qeCru);
}

export function minimoIndividual10(qe: number): number {
  return Math.ceil(qe * 0.10);
}

export function minimoIndividual20(qe: number): number {
  return Math.ceil(qe * 0.20);
}

export function vagasDiretasPorQP(partidoVotos: number, qe: number): number {
  if (qe <= 0) return 0;
  return Math.floor(partidoVotos / qe);
}
