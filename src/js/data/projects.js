// ============================================================
// DADOS DOS PROJETOS — JMATTOS.DEV
// ------------------------------------------------------------
// Fonte ÚNICA de verdade da seção #projetos.
// O HTML não contém informações de projeto: os cards são gerados
// por src/js/projects.js a partir deste array.
//
// Para adicionar um projeto real, copie um dos objetos abaixo,
// preencha os campos e remova os colchetes [ ].
//
// Estrutura de cada projeto (estudo de caso):
//   id             — identificador único (usado em âncoras/keys)
//   titulo         — nome do projeto
//   descricaoCurta — 1–2 frases de resumo exibidas no card
//   problema       — problema ou objetivo que o projeto resolve
//   tecnologias    — array de strings (tecnologias utilizadas)
//   screenshot     — caminho da imagem (relativo à pasta /public)
//                    ou null enquanto não houver imagem
//   linkDemo       — URL de demonstração ou null se não existir
//   linkGitHub     — URL do repositório ou null se não existir
//
// Regras:
//   • Use null para campos que ainda não existem (ex.: projeto
//     sem demonstração publicada). O card omite o link ausente.
//   • NÃO invente projetos. Mantenha os placeholders [ ] até
//     que os dados reais estejam disponíveis.
// ============================================================
export const projetos = [
  {
    id: "projeto-1",
    titulo: "[NOME DO PROJETO 1]",
    descricaoCurta: "[DESCRIÇÃO CURTA DO PROJETO 1 — placeholder]",
    problema: "[PROBLEMA OU OBJETIVO QUE O PROJETO 1 RESOLVE — placeholder]",
    tecnologias: ["[TECNOLOGIA 1]", "[TECNOLOGIA 2]", "[TECNOLOGIA 3]"],
    screenshot: null, // ex.: "screenshots/projeto-1.png"
    linkDemo: null, // ex.: "https://seu-dominio.com/projeto-1"
    linkGitHub: null, // ex.: "https://github.com/seuusuario/projeto-1"
  },
  {
    id: "projeto-2",
    titulo: "[NOME DO PROJETO 2]",
    descricaoCurta: "[DESCRIÇÃO CURTA DO PROJETO 2 — placeholder]",
    problema: "[PROBLEMA OU OBJETIVO QUE O PROJETO 2 RESOLVE — placeholder]",
    tecnologias: ["[TECNOLOGIA 1]", "[TECNOLOGIA 2]"],
    screenshot: null, // ex.: "screenshots/projeto-2.png"
    linkDemo: null, // ex.: "https://seu-dominio.com/projeto-2"
    linkGitHub: null, // ex.: "https://github.com/seuusuario/projeto-2"
  },
];
