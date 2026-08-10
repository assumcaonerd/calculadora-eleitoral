export type Cargo = "depestadual" | "depfederal" | "vereador";

/**
 * Etapas de ocupação de vaga no sistema proporcional:
 * - vagas_diretas: partido atingiu QP e candidato tem ≥ 10% do QE
 * - sobras_1: 1ª fase de sobras (partido ≥ 80% QE e candidato ≥ 20% QE)
 * - sobras_2: fase final (aberta a todos os partidos, conforme STF ADI 7228)
 * - nenhuma: não atende os mínimos das etapas aplicáveis
 */
export type Etapa = "vagas_diretas" | "sobras_1" | "sobras_2" | "nenhuma";

export type EntradaCalculo = {
  /** UF ou município (apenas informativo). */
  uf?: string;
  cargo?: Cargo;

  /** Número de cadeiras em disputa. */
  vagas: number;

  /** Total de votos válidos (nominais + legenda) para o cargo. */
  votosValidos: number;

  /** Votos totais do partido ou federação (nominais + legenda). */
  partidoVotos: number;

  /** Votos nominais do candidato. */
  candidatoVotos: number;
};

export type ResultadoCalculo = {
  qe: number;
  qp: number;
  minimo10: number;
  minimo20: number;
  limiar80: number;

  partidoAtingiuQE: boolean;
  partidoAtingiu80: boolean;
  vagasDiretasDoPartido: number;

  candidatoAtinge10: boolean;
  candidatoAtinge20: boolean;

  /** Etapa mais favorável em que o candidato ainda tem chance real. */
  etapaPossivel: Etapa;

  /** Resumo em linguagem simples para o usuário. */
  explicacao: string[];

  /** Referências legais resumidas. */
  baseLegal: string[];
};
