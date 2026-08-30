// ============================================================
// DADOS DE DISPONIBILIDADE — JMATTOS.DEV
// ------------------------------------------------------------
// Fonte ÚNICA de verdade do estado de disponibilidade do site
// (badge no Hero, hub de caminhos e CTAs por público).
//
// Para alternar o que o site comunica, edite APENAS os valores
// `abertoParaVaga` e `aceitandoProjetos` abaixo — o restante é
// atualizado automaticamente (badges, CTAs e rodapé).
//
// IMPORTANTE — NÃO INVENTE ESTADO:
// Os valores booleanos são decisão do dono do site. O mecanismo
// apenas reflete o que está configurado aqui.
// ============================================================
export const disponibilidade = {
  // Estado atual: foco em oportunidades de emprego; projetos pontuais.
  abertoParaVaga: false,
  aceitandoProjetos: true,

  // Rótulos das badges (Hero e cards do hub de caminhos)
  rotuloBadgeVaga: "Aberto a oportunidades de emprego",
  rotuloBadgeVagaOff: "Não busco novas oportunidades no momento",
  rotuloBadgeProjeto: "Aceitando projetos pontuais",
  rotuloBadgeProjetoOff: "Projetos: agenda sob consulta",

  // Texto dos CTAs por público
  ctaVaga: "Enviar proposta de trabalho",
  ctaVagaOff: "Conhecer meu perfil",
  ctaProjeto: "Solicitar orçamento",
  ctaProjetoOff: "Agendar conversa",

  // Microcopy do card VAGA conforme o estado. Quando fechado, o card
  // continua útil (conexão e futuras vagas) sem prometer uma vaga.
  textoCardVaga:
    "Full Stack com Python/Django e React, base em infraestrutura e redes e automação de processos. Perfil completo com projetos de código aberto — pronto para conversar sobre a sua vaga.",
  textoCardVagaOff:
    "No momento não estou buscando novas oportunidades de emprego, mas o perfil segue disponível para conexão e futuras vagas.",
};
