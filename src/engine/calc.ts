import { EntradaCalculo, ResultadoCalculo } from "./types.js";
import {
  arredondaQE,
  minimoIndividual10,
  minimoIndividual20,
  vagasDiretasPorQP
} from "./rules.js";

export function calcularBasico(input: EntradaCalculo): ResultadoCalculo {
  const qeCru = input.votosValidos / input.vagas;
  const qe = arredondaQE(qeCru);

  const minimo10 = minimoIndividual10(qe);
  const minimo20 = minimoIndividual20(qe);

  const vagasDiretas = vagasDiretasPorQP(input.partidoVotos, qe);
  const partidoFezQE = input.partidoFezQE ?? (vagasDiretas >= 1);

  const atende10 = input.candidatoVotos >= minimo10;
  const atende20 = input.candidatoVotos >= minimo20;

  let etapaPossivel: ResultadoCalculo["etapaPossivel"] = "vagas_diretas";
  const explicacao: string[] = [];

  explicacao.push(`QE estimado: ${qe} (votos válidos ÷ vagas).`);
  explicacao.push(`Mínimo 10% do QE: ${minimo10}.`);
  explicacao.push(`Mínimo 20% do QE: ${minimo20}.`);
  explicacao.push(`Vagas diretas estimadas do partido: ${vagasDiretas}.`);

  if (partidoFezQE) {
    if (!atende10) {
      etapaPossivel = "vagas_diretas";
      explicacao.push("O partido tende a fazer o quociente, mas o candidato não atingiu o mínimo individual de 10%.");
    } else {
      etapaPossivel = "sobras_1";
      explicacao.push("O partido fez o quociente e o candidato atingiu 10%, podendo disputar vagas e primeiras sobras.");
    }
  } else {
    etapaPossivel = "sobras_2";
    explicacao.push("O partido não fez o quociente. A disputa tende a ocorrer apenas nas sobras finais.");

    if (!atende20) {
      explicacao.push("O candidato não atingiu 20% do QE, requisito mínimo típico para sobras finais.");
    } else {
      explicacao.push("O candidato atingiu 20% do QE, podendo disputar sobras finais.");
    }
  }

  return {
    qe,
    minimo10,
    minimo20,
    partidoFezQE,
    vagasDiretasDoPartido: vagasDiretas,
    etapaPossivel,
    elegibilidadeMinima: { atende10, atende20 },
    explicacaoCurta: explicacao
  };
}
