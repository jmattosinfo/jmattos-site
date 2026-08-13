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
    titulo: "Finance Control (projeto em desenvolvimento)",
    descricaoCurta: "Aplicação web completa para controle orçamentário, métricas em tempo real e relatórios operacionais centralizados.",
    problema: "Centralizar o fluxo financeiro e operacional que antes era descentralizado em planilhas manuais, garantindo autenticação segura, persistência de dados íntegra e dashboard intuitivo.",
    tecnologias: ["[Python]", "[Django]","[]Django Rest Framework]", "[Bootstrap]", "[SQLite]", "[Chart.js]"],
    screenshot:"screenshots/projeto-1.gif",
    linkDemo: null, // ex.: "https://seu-dominio.com/projeto-1"
    linkGitHub: "https://github.com/jmattosinfo/finance_control"
  },
  {
    id: "projeto-2",
    titulo: "Ministério Acolher",
    descricaoCurta: "Plataforma web gratuita, sigilosa e 100% online de acolhimento emocional e espiritual para homens e mulheres maiores de 18 anos que vivenciaram violência doméstica, divórcio ou abuso sexual, conectando cada pessoa a um profissional qualificado.",
    problema: "Pessoas em situação de violência doméstica, divórcio ou abuso sexual enfrentam grande dificuldade para encontrar um espaço seguro, gratuito e confidencial de escuta e apoio emocional/espiritual, agravada pela falta de canais acessíveis que preservem a identidade e direcionem cada pessoa ao profissional adequado ao seu perfil.",
    tecnologias: ["Node.js", "Express", "MySQL", "Tailwind CSS", "Chart.js", "Leaflet", "Nodemailer", "bcryptjs", "i18n"],
    screenshot: "screenshots/projeto-2.png",
    linkDemo: "https://acolher.life",
    linkGitHub: "https://github.com/jmattosinfo/ministerio-acolher"
  },
];

