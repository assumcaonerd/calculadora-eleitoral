# Relatório de correções — Calculadora Eleitoral

## Escopo

Foi revisado o repositório `assumcaonerd/calculadora-eleitoral` e corrigida a inconsistência entre a interface publicada, o motor TypeScript, os testes e os dados históricos das bancadas de 2022.

## Correções realizadas

A página `docs/index.html` foi restaurada para uma versão funcional, com formulário, cálculo, histórico, renderização de resultados, mensagens explicativas e base legal. A lógica embutida foi alinhada ao motor TypeScript, incluindo validação de entradas, cálculo das vagas diretas e exposição de `vagasDiretasDoPartido`.

O motor em `src/engine/calc.ts` passou a rejeitar entradas não numéricas, fracionárias e incoerentes, incluindo votos partidários acima do total válido e votos nominais acima dos votos do partido.

Foi criada uma suíte em `src/tests/engine.test.ts`, cobrindo arredondamento do quociente eleitoral, quociente partidário, requisitos de 10%/20%, limiar de 80%, fase final de sobras e validações de entrada. O ciclo de testes também valida o JavaScript embutido da página por meio de `scripts/validate-html.mjs`.

Os históricos estaduais e federais foram revisados para que as somas das cadeiras fechem com as vagas declaradas. Foram corrigidos, entre outros, os dados de MG, CE, GO, BA, RJ e RS; a auditoria permanente está em `scripts/check-history.mjs`.

O workflow `.github/workflows/deploy-pages.yml` agora executa build, testes e validação da página antes da publicação. O README foi atualizado para refletir o comportamento real do projeto.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| `node scripts/check-history.mjs` | Todos os históricos disponíveis fecham com as vagas declaradas |
| `npm run build` | Passou |
| `npm test` | 8 testes aprovados |
| `npm run validate:web` | JavaScript embutido validado |
| `git diff --check` | Sem erros de whitespace |
| Simulação local no navegador | Interface carregou e exibiu resultado com QE, QP, vagas diretas e base legal |

## Observação de entrega

As alterações foram aplicadas na cópia local clonada em `/home/ubuntu/calculadora-eleitoral`. Nenhum commit ou push foi realizado no GitHub; o pacote corrigido pode ser revisado e publicado pelo responsável pelo repositório.

## Fontes de conferência dos dados

As regras eleitorais foram confrontadas com o [Código Eleitoral no TSE](https://www.tse.jus.br/legislacao/codigo-eleitoral/codigo-eleitoral-1/codigo-eleitoral-lei-nb0-4.737-de-15-de-julho-de-1965) e a [Resolução TSE nº 23.677/2021](https://www.tse.jus.br/legislacao/compilada/res/2021/resolucao-no-23-677-de-16-de-dezembro-de-2021). As bancadas foram verificadas com dados públicos do [TSE](https://dadosabertos.tse.jus.br/dataset/resultados-2022), da [Câmara dos Deputados](https://www.camara.leg.br/internet/agencia/infograficos-html5/tabelasEleicoes/deputados-eleitos-estado/index.html), da [ALMG](https://eleicoes.almg.gov.br/resultados/2022/deputado-estadual/perfil-dos-eleitos), das páginas estaduais de resultados e da lista nominal da [Bahia](https://www.poder360.com.br/eleicoes/saiba-quem-sao-os-deputados-estaduais-eleitos-pela-ba-em-2022/).

## Complementação dos históricos

Na etapa seguinte, foram incluídos os históricos estaduais/distritais e federais de AC, AL, AM, AP, DF, MS, MT, PB, PI, RN, RO, RR, SE e TO. Com isso, `historico2022` agora possui os dois cargos para todos os 26 estados e o Distrito Federal.

As bancadas federais foram conferidas na tabela nominal oficial da Câmara dos Deputados. As bancadas estaduais/distritais foram reconstruídas a partir das listas nominais e caixas de representação das páginas eleitorais de 2022, com conferência institucional da CLDF para o DF e fontes eleitorais publicadas para Roraima. O validador `scripts/check-history.mjs` foi fortalecido para detectar tanto somatórios incorretos quanto UFs ou cargos ausentes.

Após a complementação, todos os históricos fecham com o número de vagas de `dados2022`, a compilação passa, os 8 testes do motor passam, a validação do JavaScript embutido passa e a interface local foi verificada visualmente com o Distrito Federal selecionado.
