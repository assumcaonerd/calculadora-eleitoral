import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../docs/index.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/i)?.[1];

if (!script) {
  throw new Error("docs/index.html não contém um bloco de script inline.");
}

if (/Arquivo incompleto|index_df_final\.html/i.test(html)) {
  throw new Error("docs/index.html contém o stub de restauração incompleta.");
}

new vm.Script(script, { filename: "docs/index.html" });

for (const required of [
  "const dados2022",
  "function calcular",
  "form.addEventListener",
  "vagasDiretasDoPartido",
  "1ª fase das sobras",
  "sem exigência mínima de 80% ou 20%",
]) {
  if (!script.includes(required)) {
    throw new Error(`docs/index.html não contém o trecho funcional esperado: ${required}`);
  }
}

console.log("HTML e JavaScript embutido validados.");
