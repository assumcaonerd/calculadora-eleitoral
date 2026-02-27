import { calcularBasico } from "./engine/calc.js";

const exemplo = calcularBasico({
  votosValidos: 100000,
  vagas: 10,
  partidoVotos: 25000,
  candidatoVotos: 3500,
});

console.log("Resultado da simulação:");
console.log(JSON.stringify(exemplo, null, 2));
