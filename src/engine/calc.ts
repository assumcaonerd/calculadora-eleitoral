import { EntradaCalculo, ResultadoCalculo, Etapa } from "./types.js";
import {
  calcularQE,
  calcularQP,
  minimoIndividual10,
  minimoIndividual20,
  limiarPartido80,
} from "./rules.js";

/**
 * Avalia a situação de um candidato no sistema proporcional.
 * Útil para estimar viabilidade real (vagas diretas x sobras).
 *
 * Não simula a disputa completa de médias entre todos os partidos
 * (isso exigiria a lista completa de legendas). Foca no que o
 * candidato e seu partido precisam atingir para ter chance em cada etapa.
 */
export function calcularBasico(input: EntradaCalculo): ResultadoCalculo {
  const { votosValidos, vagas, partidoVotos, candidatoVotos } = input;

  const valores = [vagas, votosValidos, partidoVotos, candidatoVotos];
  if (!valores.every(Number.isInteger)) {
    throw new Error("Informe apenas números inteiros para vagas e votos.");
  }
  if (vagas <= 0 || votosValidos <= 0) {
    throw new Error("Informe número de vagas e votos válidos maiores que zero.");
  }
  if (partidoVotos < 0 || candidatoVotos < 0) {
    throw new Error("Votos do partido e do candidato não podem ser negativos.");
  }
  if (partidoVotos > votosValidos) {
    throw new Error("Os votos do partido/federação não podem superar os votos válidos totais.");
  }
  if (candidatoVotos > partidoVotos) {
    throw new Error("Os votos do candidato não podem superar os votos do partido/federação.");
  }

  const qe = calcularQE(votosValidos, vagas);
  const qp = calcularQP(partidoVotos, qe);
  const minimo10 = minimoIndividual10(qe);
  const minimo20 = minimoIndividual20(qe);
  const limiar80 = limiarPartido80(qe);

  const partidoAtingiuQE = qp >= 1;
  const partidoAtingiu80 = partidoVotos >= limiar80;
  const candidatoAtinge10 = candidatoVotos >= minimo10;
  const candidatoAtinge20 = candidatoVotos >= minimo20;

  const explicacao: string[] = [];
  const baseLegal: string[] = [
    "Art. 106 a 109 do Código Eleitoral",
    "Arts. 5º e 6º-A da Lei 9.504/1997",
    "Res. TSE 23.677/2021 (alterada pelas Res. 23.734/2024 e 23.748/2026)",
    "STF, ADI 7.228 (fase final de sobras aberta a todos os partidos)",
  ];

  explicacao.push(`Quociente Eleitoral (QE): ${qe.toLocaleString("pt-BR")} votos.`);
  explicacao.push(`Quociente Partidário (QP) do partido/federação: ${qp} vaga(s).`);
  explicacao.push(`Mínimo individual 10% do QE: ${minimo10.toLocaleString("pt-BR")} votos.`);
  explicacao.push(`Referência individual de 20% do QE para a 1ª fase das sobras: ${minimo20.toLocaleString("pt-BR")} votos.`);
  explicacao.push(`Limiar partidário 80% do QE (1ª fase de sobras): ${limiar80.toLocaleString("pt-BR")} votos.`);

  let etapaPossivel: Etapa = "nenhuma";

  // 1) Vagas diretas (QP + 10%)
  if (partidoAtingiuQE && candidatoAtinge10) {
    etapaPossivel = "vagas_diretas";
    explicacao.push(
      "O partido atingiu o quociente partidário e o candidato alcançou 10% do QE. Há chance real de ocupação de vaga direta (na ordem de votação nominal da legenda)."
    );
  } else if (partidoAtingiuQE && !candidatoAtinge10) {
    explicacao.push(
      "O partido fez o quociente, mas o candidato não atingiu 10% do QE. Não ocupa vaga direta. Pode disputar sobras se cumprir os requisitos da etapa seguinte."
    );
  } else {
    explicacao.push("O partido não atingiu o quociente partidário (QP = 0). Não há vaga direta.");
  }

  // 2) 1ª fase de sobras (80% partido + 20% candidato)
  if (etapaPossivel === "nenhuma" || etapaPossivel === "vagas_diretas") {
    if (partidoAtingiu80 && candidatoAtinge20) {
      if (etapaPossivel === "nenhuma") {
        etapaPossivel = "sobras_1";
      }
      explicacao.push(
        "Partido ≥ 80% do QE e candidato ≥ 20% do QE: apto a disputar a 1ª fase de sobras (distribuição por média)."
      );
    } else {
      if (!partidoAtingiu80) {
        explicacao.push(
          `O partido não atingiu 80% do QE (${limiar80.toLocaleString("pt-BR")}). Não participa da 1ª fase de sobras.`
        );
      }
      if (!candidatoAtinge20) {
        explicacao.push(
          `O candidato não atingiu 20% do QE (${minimo20.toLocaleString("pt-BR")}). Isso impede apenas a participação na 1ª fase de sobras; não elimina eventual vaga direta pelo QP nem a participação na fase final.`
        );
      }
    }
  }

  // 3) Fase final (sobras das sobras) – aberta a todos, conforme STF
  if (etapaPossivel === "nenhuma") {
    etapaPossivel = "sobras_2";
    explicacao.push(
      "Na fase final de sobras (quando ainda restam vagas após a 1ª distribuição por média), todos os partidos, federações, candidatas e candidatos podem participar, sem exigência mínima de 80% ou 20%. A ocupação depende das maiores médias e da ordem de votação da legenda."
    );
  } else if (etapaPossivel === "sobras_1") {
    explicacao.push(
      "Se não houver vaga na 1ª fase de sobras, ainda resta a fase final, aberta a todos os partidos, federações, candidatas e candidatos, sem exigência mínima de 80% ou 20%."
    );
  }

  // Aviso prático
  explicacao.push(
    "Atenção: esta é uma estimativa de elegibilidade mínima. A ocupação efetiva das sobras depende das médias de todos os partidos e da ordem de votação nominal dentro da legenda."
  );

  return {
    qe,
    qp,
    minimo10,
    minimo20,
    limiar80,
    partidoAtingiuQE,
    partidoAtingiu80,
    vagasDiretasDoPartido: qp,
    candidatoAtinge10,
    candidatoAtinge20,
    etapaPossivel,
    explicacao,
    baseLegal,
  };
}

/** Alias para compatibilidade com versões anteriores. */
export const calcular = calcularBasico;
