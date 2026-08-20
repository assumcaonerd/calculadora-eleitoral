# Notas da auditoria

## Inconsistências encontradas

1. `docs/index.html` é publicado como interface auto-contida no README, mas o arquivo atual termina com um `alert("Arquivo incompleto...")` e não possui lógica de preenchimento, histórico ou cálculo.
2. O script `test` do `package.json` aponta para `dist/tests/engine.test.js`, mas não existe diretório `src/tests` nem arquivo de teste correspondente; `npm test` falha com `Could not find 'dist/tests/engine.test.js'`.
3. A interface histórica funcional está disponível no commit `c284a3d` (`docs/index.html`, 33.954 bytes), enquanto os commits posteriores que tentaram restaurar o DF reduziram o arquivo para cerca de 8 KB e deixaram apenas um stub no script.
4. O motor TypeScript e a interface precisam compartilhar as mesmas regras e validações para evitar divergência entre o uso via Node e o uso no navegador.

## Regras oficiais conferidas

- A Resolução TSE nº 23.677/2021, em texto compilado, art. 8º, exige candidato com pelo menos 10% do QE nas vagas indicadas pelo QP.
- O art. 9º define QE como votos válidos divididos pelas vagas, desprezando fração igual ou inferior a 0,5 e arredondando para 1 quando superior.
- O art. 10º define o QP pela divisão dos votos do partido/federação pelo QE, desprezada a fração.
- A documentação e a lógica devem deixar claro que o cálculo é uma estimativa de elegibilidade mínima e não uma simulação completa das médias de todos os partidos.

## Plano de correção

- Restaurar uma página `docs/index.html` funcional a partir da última versão histórica completa, preservando os dados já existentes e os estados disponíveis.
- Alinhar a lógica embutida no HTML ao motor TypeScript, incluindo `vagasDiretasDoPartido` no resultado.
- Criar testes automatizados do motor para as regras de arredondamento, QP, limiares, etapas e validações.
- Ajustar scripts/documentação se necessário e validar build, testes e execução da interface de forma reproduzível.

## Validação da interface

A página restaurada foi aberta localmente no Chromium sem o alerta de arquivo incompleto. O formulário carregou 27 UFs, atualizou os campos padrão para o Espírito Santo e exibiu o histórico de 2022. Ao acionar `Calcular`, o bloco de resultado apareceu com QE, QP, vagas diretas, mínimos de 10%/20%, limiar de 80%, explicações e base legal.

A simulação padrão resultou em QE 69.481, QP 1 e 1 vaga direta, coerente com 2.084.430 votos válidos, 30 vagas, 95.000 votos partidários e 12.000 votos nominais.

## Auditoria dos dados históricos

A checagem automatizada dos blocos `historico2022` contra `dados2022` encontrou divergências: MG/estadual (75 contra 77), MG/federal (51 contra 53), RJ/estadual (69 contra 70), BA/estadual (55 contra 63), RS/federal (30 contra 31), CE/estadual (42 contra 46) e GO/estadual (42 contra 41).

As fontes oficiais consultadas foram o [Portal de Dados Abertos do TSE — Resultados 2022](https://dadosabertos.tse.jus.br/dataset/resultados-2022), que disponibiliza a totalização por UF e cargo, e a [tabela da Câmara dos Deputados com os eleitos por estado](https://www.camara.leg.br/internet/agencia/infograficos-html5/tabelasEleicoes/deputados-eleitos-estado/index.html), usada para conferência das bancadas federais.

A página oficial da [ALMG — Perfil dos eleitos 2022](https://eleicoes.almg.gov.br/resultados/2022/deputado-estadual/perfil-dos-eleitos) confirma os 77 deputados estaduais eleitos em Minas Gerais e disponibiliza nome, partido e federação, permitindo recomputar a distribuição partidária a partir de fonte primária.

A extração do DOM da ALMG contou exatamente 77 títulos de eleitos. As contagens partidárias exibidas pela fonte foram: Avante 3, Cidadania 3, DC 1, MDB 2, Novo 2, PCdoB 1, PDT 2, PL 9, PMN 3, PP 6, PSB 1, PSC 3, PSD 9, PSDB 1, PT 12, PV 4, Patri/Patriota 3, Pode 1, Pros 1, Psol 1, Rede 2, Republicanos 3, Solidariedade 1 e União 3.

A página estática do TRE-CE retornou acesso rejeitado no navegador; a fonte alternativa da Folha ficou bloqueada por restrição de acesso. A correção dos históricos estaduais restantes será feita com fontes públicas acessíveis e com a checagem automatizada de somatórios, sem manter listas que não fecham com as vagas oficiais.

## Dados externos adicionais

A tabela de resultados do Ceará em 2022 informa 46 cadeiras estaduais e a distribuição total por partido/federação: FE Brasil 9, Federação PSDB/Cidadania 2, Federação PSOL/Rede 1, Republicanos 2, PP 3, PDT 13, MDB 3, PL 4, PMN 1, União 4, PSD 3 e Avante 1. Fonte consultada: https://pt.wikipedia.org/wiki/Elei%C3%A7%C3%B5es_estaduais_no_Cear%C3%A1_em_2022, seção de resultados por partido/federação, que referencia os resultados eleitorais.

A página de Goiás consultada informa 41 cadeiras estaduais e a composição partidária da 20ª legislatura; a lista de eleitos contém os candidatos necessários para recomputar o total. Fonte: https://pt.wikipedia.org/wiki/Lista_de_deputados_estaduais_de_Goi%C3%A1s_da_20.%C2%AA_legislatura.

A página do Rio de Janeiro consultada informa 70 cadeiras estaduais e disponibiliza a seção de 70 candidatos eleitos com partido. Fonte: https://pt.wikipedia.org/wiki/Elei%C3%A7%C3%B5es_estaduais_no_Rio_de_Janeiro_em_2022.

Na conferência da Bahia, a lista do G1 e a relação nominal do TRE-BA foram bloqueadas pelo acesso automatizado. A lista pública da Wikipédia declara 63 eleitos, mas sua tabela contém um registro excedente; por isso a distribuição estadual será reconciliada com a lista de 63 nomes publicada por fontes eleitorais agregadas, excluindo o registro que não pertence à composição final de 2023–2027.

A lista de 63 eleitos publicada pelo Poder360, cuja página informa a composição da Assembleia em 2023 e menciona dados do TSE, permite fechar a Bahia assim: União 10, PSD 9, PT 9, PP 6, PCdoB 4, PV 4, PL 4, Republicanos 3, PSDB 3, PSB 2, Solidariedade 2, MDB 2, PDT 1, Patriota 1, PSC 1, Psol 1 e Avante 1. Total: 63. Fonte: https://www.poder360.com.br/eleicoes/saiba-quem-sao-os-deputados-estaduais-eleitos-pela-ba-em-2022/.

## Validação final

Após as correções, `scripts/check-history.mjs` informa que todos os históricos disponíveis fecham com o total de vagas declarado. A compilação TypeScript passou; os 8 testes do motor passaram; e `scripts/validate-html.mjs` confirmou que o JavaScript embutido da página estática é válido.

A versão final foi aberta localmente no navegador e a simulação padrão foi executada com sucesso. O bloco de resultado exibiu QE 69.481, QP 1, 1 vaga direta, mínimos de 10% e 20%, limiar de 80%, explicações e base legal, sem o alerta de arquivo incompleto.

## Inventário atualizado dos históricos

A auditoria direta de `docs/index.html` encontrou históricos detalhados para 13 UFs: ES, SP, MG, RJ, BA, PR, RS, PE, CE, SC, GO, PA e MA. As 14 UFs efetivamente ausentes são: AC, AL, AM, AP, DF, MS, MT, PB, PI, RN, RO, RR, SE e TO. A contagem anterior de 16 UFs estava desatualizada porque PA e MA já estavam presentes no arquivo.

A página oficial do [Portal de Dados Abertos do TSE — Resultados 2022](https://dadosabertos.tse.jus.br/dataset/resultados-2022) confirma que os arquivos separados por UF incluem a totalização de Governador, Senador, Deputado Federal e Deputado Estadual. Os recursos identificados para as UFs ausentes incluem AC, AL, AM, AP, DF, MS, MT, PB, PI, RN, RO, RR, SE e TO.

O recurso oficial do AC confirma o padrão de download dos arquivos por UF: `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_AC.zip`, formato ZIP contendo CSV. O padrão pode ser aplicado às 14 UFs restantes substituindo a sigla no nome do arquivo, sempre a partir dos links de recursos do próprio portal do TSE.

A busca por fontes secundárias localizou o panorama [Eleições parlamentares no Brasil em 2022](https://pt.wikipedia.org/wiki/Elei%C3%A7%C3%B5es_parlamentares_no_Brasil_em_2022), que apresenta assentos federais por UF, além do índice [Eleições estaduais no Brasil em 2022](https://pt.wikipedia.org/wiki/Elei%C3%A7%C3%B5es_estaduais_no_Brasil_em_2022). As páginas estaduais individuais podem ser obtidas via API pública da Wikipédia quando necessário.

Para o Distrito Federal, a fonte institucional da [CLDF — perfil dos 24 distritais eleitos para 2023](https://www.cl.df.gov.br/-/conheca-o-perfil-dos-24-novos-distritais-que-assumem-em-2023) foi aberta e salva em HTML pelo navegador. A composição partidária será extraída do conteúdo institucional, complementada pela notícia da CLDF sobre a renovação da Câmara Legislativa se necessário.

A notícia institucional da CLDF confirma os 24 distritais eleitos em 2022. A contagem nominal é: PL 4; PT 3; MDB 3; PSOL 2; PSD 2; Agir 2; PP 2; Republicanos 1; UNIÃO 1; PMN 1; Avante 1; Cidadania 1; PSB 1. Total: 24. Fontes: https://www.cl.df.gov.br/-/-eleicoes-2022-renovacao-na-cldf-chega-a-50-dos-distritais-e-ha-um-novo-campeao-de-votos e https://www.cl.df.gov.br/-/conheca-o-perfil-dos-24-novos-distritais-que-assumem-em-2023.

A lista de 24 eleitos de Roraima publicada pelo Poder360/UOL permite fechar a bancada estadual: Republicanos 4, PP 3, UNIÃO 3, PODE 2, PROS 2, MDB 2, PRTB 2, PMB 2, PL 1, PSD 1, Cidadania 1 e PSC 1. Total: 24. Fontes: https://www.poder360.com.br/eleicoes/saiba-quem-sao-os-deputados-estaduais-eleitos-por-rr-em-2022/ e https://noticias.uol.com.br/eleicoes/2022/10/02/deputados-estaduais-roraima.htm.

## Históricos completados

Foram adicionadas as UFs AC, AL, AM, AP, DF, MS, MT, PB, PI, RN, RO, RR, SE e TO, sempre com os blocos `estadual`/`federal`. As bancadas federais foram contadas na tabela nominal oficial da Câmara dos Deputados. Para as bancadas estaduais, foram usadas as listas nominais e caixas de representação das páginas eleitorais de 2022, com conferência institucional específica da CLDF para o DF e lista publicada pelo Poder360/UOL para RR. A auditoria final confirma cobertura de 27 UFs e fechamento de todos os totais.

A verificação visual final selecionou o Distrito Federal na página local. A interface atualizou corretamente para 24 vagas, 1.607.519 votos válidos, dados-base de 2022 e exibiu o histórico estadual completo com PL 4, PT 3, MDB 3, PSOL 2, PSD 2, Agir 2, PP 2 e os demais partidos com uma cadeira.
