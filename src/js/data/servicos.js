$// ============================================================
// DADOS DOS SERVIÇOS — JMATTOS.DEV
// ------------------------------------------------------------
// Fonte ÚNICA de verdade da seção #servicos.
// Os cards são gerados por src/js/servicos.js a partir deste array.
//
// IMPORTANTE — NÃO INVENTE SERVIÇOS:
// Adicione/remova serviços aqui SOMENTE quando forem confirmados.
// Se o array estiver vazio, a seção exibe cards placeholder
// ("a confirmar") — nenhum serviço é apresentado antes da hora.
//
// Estrutura de cada serviço:
//   titulo    — nome do serviço (ex.: "Desenvolvimento Web & Sites")
//   descricao — 1–2 frases do que é entregue
//   icone     — nome do ícone lucide em kebab-case (ex.: "code-2",
//               "workflow", "headset", "chart-column"). Opcional: sem
//               ícone, o card usa um ícone neutro (circle-dot).
//               Todo ícone usado aqui PRECISA ser importado em
//               src/js/main.js no objeto do createIcons (tree-shaking).
// ============================================================
export const servicos = [
    {
        titulo: "Desenvolvimento Web & Sites",
        descricao: "Criação de sites modernos, responsivos e otimizados, focados em performance e em transmitir uma presença digital profissional.",
        icone: "code-2",
    },

    {
        titulo: "RPA & Automação de Processos",
        descricao: "Desenvolvimento de rotinas automatizadas para eliminar tarefas repetitivas, integrar sistemas e otimizar fluxos de trabalho operacionais.",
        icone: "workflow",
    },

    {
        titulo: "Consultoria & Suporte de TI",
        descricao: "Orientação técnica especializada em infraestrutura, redes e suporte, estruturando ambientes seguros e eficientes para o crescimento tecnológico.",
        icone: "headset",
    },
    {
        titulo: "Sistemas & Plataformas de Estudo (Gestão Financeira)",
        descricao: "Desenvolvimento prático e contínuo de aplicações web voltadas para o controle financeiro, explorando regras de negócio e arquitetura como parte da minha evolução técnica.",
        icone: "chart-column",
    }

];
