import { calcularBasico } from "./engine/calc.js";

/**
 * Exemplo de uso da calculadora eleitoral.
 * Substitua os números pelos dados reais da sua UF/município e do seu partido.
 *
 * Exemplo genérico (valores ilustrativos):
 * - 30 vagas (deputado estadual no ES)
 * - 2.300.000 votos válidos estimados
 * - partido com 95.000 votos
 * - candidato com 12.000 votos
 */
const exemplo = calcularBasico({
  uf: "ES",
  cargo: "depestadual",
  vagas: 30,
  votosValidos: 2_300_000,
  partidoVotos: 95_000,
  candidatoVotos: 12_000,
});

console.log("=== Calculadora Eleitoral – Sistema Proporcional ===\n");
console.log("Resultado da simulação:\n");
console.log(JSON.stringify(exemplo, null, 2));

console.log("\n--- Explicação resumida ---");
exemplo.explicacao.forEach((linha, i) => {
  console.log(`${i + 1}. ${linha}`);
});

console.log("\n--- Base legal ---");
exemplo.baseLegal.forEach((ref) => console.log(`• ${ref}`));
