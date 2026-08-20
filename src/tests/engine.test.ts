import test from "node:test";
import assert from "node:assert/strict";
import { calcularBasico } from "../engine/calc.js";

const entradaBase = {
  vagas: 10,
  votosValidos: 1_000,
  partidoVotos: 0,
  candidatoVotos: 0,
};

test("calcula o QE desprezando a fração igual a 0,5", () => {
  const resultado = calcularBasico({
    ...entradaBase,
    votosValidos: 105,
  });

  assert.equal(resultado.qe, 10);
});

test("arredonda o QE para cima quando a fração é superior a 0,5", () => {
  const resultado = calcularBasico({
    ...entradaBase,
    votosValidos: 106,
  });

  assert.equal(resultado.qe, 11);
});

test("calcula vagas diretas pelo QP e pelo mínimo individual de 10%", () => {
  const resultado = calcularBasico({
    ...entradaBase,
    votosValidos: 106,
    partidoVotos: 22,
    candidatoVotos: 2,
  });

  assert.equal(resultado.qe, 11);
  assert.equal(resultado.qp, 2);
  assert.equal(resultado.vagasDiretasDoPartido, 2);
  assert.equal(resultado.etapaPossivel, "vagas_diretas");
  assert.equal(resultado.candidatoAtinge10, true);
});

test("classifica a primeira fase de sobras com 80% e 20%", () => {
  const resultado = calcularBasico({
    ...entradaBase,
    partidoVotos: 80,
    candidatoVotos: 20,
  });

  assert.equal(resultado.qe, 100);
  assert.equal(resultado.partidoAtingiu80, true);
  assert.equal(resultado.candidatoAtinge20, true);
  assert.equal(resultado.etapaPossivel, "sobras_1");
  assert.match(resultado.explicacao.join(" "), /1ª fase de sobras/);
});

test("classifica a fase final quando os requisitos da primeira sobra não são atendidos", () => {
  const resultado = calcularBasico({
    ...entradaBase,
    partidoVotos: 79,
    candidatoVotos: 19,
  });

  assert.equal(resultado.etapaPossivel, "sobras_2");
  assert.equal(resultado.partidoAtingiu80, false);
  assert.equal(resultado.candidatoAtinge20, false);
  assert.match(resultado.explicacao.join(" "), /todos os partidos, federações, candidatas e candidatos/);
  assert.match(resultado.explicacao.join(" "), /sem exigência mínima de 80% ou 20%/);
});

test("20% não impede vaga direta pelo QP quando o candidato alcança 10%", () => {
  const resultado = calcularBasico({
    ...entradaBase,
    partidoVotos: 100,
    candidatoVotos: 10,
  });

  assert.equal(resultado.qe, 100);
  assert.equal(resultado.qp, 1);
  assert.equal(resultado.candidatoAtinge10, true);
  assert.equal(resultado.candidatoAtinge20, false);
  assert.equal(resultado.etapaPossivel, "vagas_diretas");
  assert.match(resultado.explicacao.join(" "), /não elimina eventual vaga direta pelo QP/);
});

test("rejeita votos partidários maiores que o total de votos válidos", () => {
  assert.throws(
    () => calcularBasico({ ...entradaBase, partidoVotos: 1_001 }),
    /não podem superar os votos válidos totais/,
  );
});

test("rejeita votos nominais maiores que os votos do partido", () => {
  assert.throws(
    () => calcularBasico({ ...entradaBase, partidoVotos: 100, candidatoVotos: 101 }),
    /não podem superar os votos do partido/,
  );
});

test("rejeita entradas fracionárias", () => {
  assert.throws(
    () => calcularBasico({ ...entradaBase, candidatoVotos: 1.5 }),
    /apenas números inteiros/,
  );
});
