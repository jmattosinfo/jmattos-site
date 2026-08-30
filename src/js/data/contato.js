// ============================================================
// DADOS DE CONTATO — JMATTOS.DEV
// ------------------------------------------------------------
// Fonte ÚNICA de verdade da seção #contato.
//
// IMPORTANTE — NÃO INVENTE O E-MAIL:
// Enquanto o endereço real não for fornecido, mantenha o
// placeholder abaixo. O e-mail é usado pelo link direto, pelo
// envio via POST /api/contato e, como fallback, por um mailto
// honesto quando o servidor não estiver disponível (ver
// src/js/contato.js).
//
// Quando o e-mail for um placeholder (contém "["), os links de
// contato ficam desabilitados e o formulário mostra um aviso em
// vez de abrir um mailto quebrado.
// ============================================================
export const contato = {
  // Substitua pelo seu e-mail real (ex.: "contato@jmattos.dev")
  email: "jmattosinfo@gmail.com",

  // Assunto padrão usado ao montar a mensagem. O tipo escolhido no
  // select é anexado ao assunto (ex.: "Contato pelo portfólio — Site"
  // ou "Contato pelo portfólio — Proposta de vaga").
  assunto: "Contato pelo portfólio",

  // Texto exibido no card "Tempo de resposta" da seção de contato.
  tempoResposta: "Respondo em até 24h úteis.",

  // Opções do select "Assunto do contato". Cada opção tem:
  //   valor  — enviado no POST e usado no assunto do mailto
  //   rotulo — texto exibido no <option>
  // "vaga" cobre propostas de emprego (recrutadores/empresas); as
  // demais cobrem contratação de serviços (clientes).
  tiposProjeto: [
    { valor: "site", rotulo: "Site" },
    { valor: "sistema-web", rotulo: "Sistema web" },
    { valor: "automacao", rotulo: "Automação / RPA" },
    { valor: "vaga", rotulo: "Proposta de vaga" },
    { valor: "outro", rotulo: "Outro" },
  ],
};
