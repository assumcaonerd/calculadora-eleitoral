export type Cargo = "depestadual" | "depfederal" | "vereador";

export type Etapa = "vagas_diretas" | "sobras_1" | "sobras_2";

export type EntradaCalculo = {
  uf: string;
  cargo: Cargo;

  // número de cadeiras no estado/município
  vagas: number;

  // votos válidos totais (para aquele cargo e UF)
  votosValidos: number;

  // votos totais do partido/federação naquele cargo/UF
  partidoVotos: number;

  // votos do candidato
  candidatoVotos: number;

  // opcional: se o partido alcançou 1 QE (pode ser inferido)
  partidoFezQE?: boolean;
};

export type ResultadoCalculo = {
  qe: number;
  minimo10: number;
  minimo20: number;

  partidoFezQE: boolean;
  vagasDiretasDoPartido: number;

  etapaPossivel: Etapa;

  elegibilidadeMinima: {
    atende10: boolean;
    atende20: boolean;
  };

  explicacaoCurta: string[];
};
