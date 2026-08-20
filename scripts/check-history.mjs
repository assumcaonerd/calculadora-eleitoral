import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../docs/index.html", import.meta.url), "utf8");
const extractObject = (name) => {
  const pattern = new RegExp(`const ${name} = (\\{[\\s\\S]*?\\n    \\});`);
  const match = html.match(pattern);
  if (!match) throw new Error(`Não foi possível extrair ${name}.`);
  return vm.runInNewContext(`(${match[1]})`);
};

const dados = extractObject("dados2022");
const historico = extractObject("historico2022");
const divergencias = [];

for (const uf of Object.keys(dados)) {
  if (!historico[uf]) {
    divergencias.push(`${uf}: histórico ausente`);
    continue;
  }
  for (const cargo of ["estadual", "federal"]) {
    const partidos = historico[uf][cargo];
    if (!Array.isArray(partidos)) {
      divergencias.push(`${uf}/${cargo}: histórico ausente`);
      continue;
    }
    const esperado = cargo === "federal" ? dados[uf].federal : dados[uf].estadual;
    const apurado = partidos.reduce((total, item) => total + item.cadeiras, 0);
    if (apurado !== esperado) {
      divergencias.push(`${uf}/${cargo}: histórico=${apurado}, vagas=${esperado}`);
    }
  }
}

if (divergencias.length > 0) {
  console.error(divergencias.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Todos os históricos disponíveis fecham com o total de vagas declarado.");
}
