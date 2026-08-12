// ============================================================
// DADOS DA PRESENÇA PROFISSIONAL — JMATTOS.DEV
// ------------------------------------------------------------
// Fonte ÚNICA de verdade da seção #presenca.
// Os cards são gerados por src/js/presenca.js a partir deste array.
//
// IMPORTANTE — NÃO INVENTE URLs:
// Mantenha o campo url como null enquanto o link real não for
// fornecido. Enquanto null, o card exibe "[Link pendente]".
//
// Estrutura de cada canal:
//   nome          — nome do canal (ex.: "GitHub")
//   descricao     — 1–2 frases do que o visitante encontra ali
//   icone         — nome do ícone lucide em kebab-case
//   url           — URL real ou null enquanto não for fornecida.
//                   Para E-mail, use "mailto:seuemail@exemplo.com".
//   rotuloAcao    — texto do link de ação (ex.: "Acessar perfil")
//   externa       — true = link externo (target="_blank" +
//                   rel="noopener noreferrer");
//                   false = link interno, sem nova aba (ex.: mailto:)
//
// NOTA SOBRE ÍCONES:
// Os ícones de marca (Github, Linkedin, Instagram) foram REMOVIDOS
// do Lucide v1.31. Usamos proxies neutros que representam a função
// de cada canal, mantendo a identidade visual consistente:
//   folder-git-2 (GitHub) · briefcase (LinkedIn) · camera (Instagram)
//   mail (E-mail) · message-circle (WhatsApp)
// ============================================================
export const canais = [
  {
    nome: "GitHub",
    descricao:
      "[O QUE O VISITANTE ENCONTRA NO SEU GITHUB — placeholder. Ex.: repositórios, projetos e código aberto.]",
    icone: "folder-git-2",
    url: null,
    rotuloAcao: "Acessar perfil",
    externa: true,
  },
  {
    nome: "LinkedIn",
    descricao:
      "[O QUE O VISITANTE ENCONTRA NO SEU LINKEDIN — placeholder. Ex.: trajetória, experiências e conexões profissionais.]",
    icone: "briefcase",
    url: null,
    rotuloAcao: "Acessar perfil",
    externa: true,
  },
  {
    nome: "Instagram",
    descricao:
      "[O QUE O VISITANTE ENCONTRA NO SEU INSTAGRAM — placeholder. Ex.: bastidores, conteúdo técnico e atualizações.]",
    icone: "camera",
    url: null,
    rotuloAcao: "Acessar perfil",
    externa: true,
  },
  {
    nome: "E-mail",
    descricao:
      "[SEU E-MAIL PROFISSIONAL — placeholder. Ex.: para propostas, dúvidas e parcerias.]",
    icone: "mail",
    url: null,
    rotuloAcao: "Enviar e-mail",
    externa: false,
  },
  {
    nome: "WhatsApp",
    descricao:
      "[EM BREVE — placeholder. Ex.: contato direto e rápido para demandas urgentes.]",
    icone: "message-circle",
    url: null,
    rotuloAcao: "Chamar no WhatsApp",
    externa: true,
  },
];
