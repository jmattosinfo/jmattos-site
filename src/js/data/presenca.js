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
      "Repositórios de código aberto, projetos acadêmicos e aplicações práticas em desenvolvimento (incluindo os estudos de arquitetura e sistemas).",
    icone: "folder-git-2",
    url: "https://github.com/jmattosinfo/jmattosinfo",
    rotuloAcao: "Acessar perfil",
    externa: true,
  },
  {
    nome: "LinkedIn",
    descricao:
      "Minha trajetória profissional em tecnologia, histórico em suporte, redes e minha transição atual para o desenvolvimento de software.",
    icone: "briefcase",
    url: "https://www.linkedin.com/in/juliomattos-dev/",
    rotuloAcao: "Acessar perfil",
    externa: true,
  },
  // {
  //   nome: "Instagram",
  //   descricao:
  //     "Bastidores do aprendizado, rotina de estudos, conteúdos técnicos e atualizações sobre a evolução dos meus projetos.",
  //   icone: "camera",
  //   url: null,
  //   rotuloAcao: "Acessar perfil",
  //   externa: true,
  // },
  {
    nome: "E-mail",
    descricao:
      "Canal direto para propostas, dúvidas profissionais, parcerias ou contato comercial.",
    icone: "mail",
    url: "mailto:jmattosinfo@gmail.com",
    rotuloAcao: "Enviar e-mail",
    externa: false,
  },
  {
    nome: "WhatsApp",
    descricao:
      "Contato direto e ágil para conversas rápidas, dúvidas sobre serviços de TI e alinhamento de projetos.",
    icone: "message-circle",
    url: "https://wa.me/5551999009727?text=Oi%21%20Cheguei%20aqui%20pelo%20site%20e%20gostaria%20de%20falar%20contigo%20sobre",
    rotuloAcao: "Chamar no WhatsApp",
    externa: true,
  },
];
