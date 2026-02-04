export function arredondaQE(qeCru: number): number {
  // Para simulação e comunicação simples, usamos QE inteiro.
  // Observação: a apuração oficial usa regras próprias de divisão inteira/medias nas etapas.
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
