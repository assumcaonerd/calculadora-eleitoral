/**
 * Regras do sistema proporcional brasileiro.
 * Base legal principal:
 * - Código Eleitoral (Lei 4.737/1965), arts. 106 a 109 e 111
 * - Lei 9.504/1997, arts. 5º e 6º-A
 * - Resolução TSE 23.677/2021 (com alterações das Resoluções 23.734/2024 e 23.748/2026)
 * - STF, ADI 7.228 (participação ampla na última fase de sobras)
 */

/**
 * Calcula o Quociente Eleitoral.
 * Art. 106 CE / art. 9º Res. TSE 23.677:
 * votos válidos ÷ vagas, desprezando a fração se ≤ 0,5 ou arredondando para 1 se superior.
 */
export function calcularQE(votosValidos: number, vagas: number): number {
  if (vagas <= 0) return 0;
  const cru = votosValidos / vagas;
  const inteiro = Math.floor(cru);
  const fracao = cru - inteiro;
  return fracao > 0.5 ? inteiro + 1 : inteiro;
}

/** Mínimo individual para ocupar vaga pelo quociente partidário (10% do QE). */
export function minimoIndividual10(qe: number): number {
  return Math.ceil(qe * 0.1);
}

/** Mínimo individual para disputar 1ª fase de sobras (20% do QE). */
export function minimoIndividual20(qe: number): number {
  return Math.ceil(qe * 0.2);
}

/** Limiar partidário para disputar 1ª fase de sobras (80% do QE). */
export function limiarPartido80(qe: number): number {
  return Math.ceil(qe * 0.8);
}

/**
 * Quociente partidário: votos do partido/federação ÷ QE (desprezada a fração).
 * Art. 107 CE / art. 10 Res. TSE 23.677.
 */
export function calcularQP(partidoVotos: number, qe: number): number {
  if (qe <= 0) return 0;
  return Math.floor(partidoVotos / qe);
}

/**
 * Média para distribuição de sobras: votos do partido ÷ (vagas já obtidas + 1).
 * Art. 109, I, CE.
 */
export function calcularMedia(partidoVotos: number, vagasJaObtidas: number): number {
  return partidoVotos / (vagasJaObtidas + 1);
}
