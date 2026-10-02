# 📘 Manual Definitivo de Conteinerização

## PARTE 1: Conteinerizar Projetos Existentes (O Caminho da Migração)

Quando você tem um projeto a rodar solto no sistema operativo (com PM2, venv, ou dependências instaladas globalmente), o objetivo é "encapsular" tudo sem quebrar o que já funciona.

### Passo 1: O Mapeamento (Raio-X do Projeto)

Antes de criar qualquer arquivo Docker, faça três perguntas sobre o projeto:

1. Qual é a linguagem/versão exata? (Ex: Node.js 22, Python 3.11).
2. Quais são os comandos de arranque? (O que você digita para iniciar o servidor ou o robô?).
3. Quais portas ele expõe? (Ex: 3001, 8080).

### Passo 2: O Isolamento das Variáveis

O contêiner não lê as variáveis do sistema operativo da VPS.

1. Crie o ficheiro `.env` com os dados reais (e coloque-o no `.gitignore`).
2. Crie o `.env.example` com chaves vazias ou falsas para ficar no GitHub.

### Passo 3: O Escudo de Lixo (.dockerignore)

Nunca deixe o Docker copiar pastas compiladas ou ambientes virtuais da sua máquina para a imagem. O ficheiro `.dockerignore` é obrigatório.

1. **Para Node.js:** Ignorar `node_modules`, `dist`, `npm-debug.log`.
2. **Para Python/RPA:** Ignorar `__pycache__`, `.venv`, `venv`, `*.pyc`.
3. **Geral:** Ignorar `.git`, `.env`, e ficheiros do VS Code.

### Passo 4: A Receita do Bolo (Dockerfile)

Escreva o script que constrói o ambiente perfeito.

1. Comece sempre com uma imagem oficial e leve (ex: `node:22-alpine` ou `python:3.11-slim`).
2. Defina a pasta de trabalho (`WORKDIR /app`).
3. Copie primeiro os gerenciadores de pacotes (`package.json` ou `requirements.txt`) e instale as dependências. Isso otimiza o cache do Docker.
4. Copie o resto do código (`COPY . .`).
5. Defina a porta (`EXPOSE`) e o comando final de arranque (`CMD`).

### Passo 5: A Orquestração (docker-compose)

Crie as "duas caras" do seu projeto:

- **`docker-compose.yml`:** A versão blindada de produção (usa a imagem compilada, sem volumes de código, com `restart: always`).
- **`docker-compose.dev.yml`:** A versão de desenvolvimento (mapeia a pasta local como volumes para que o hot-reload do Vite, Express ou nodemon funcione enquanto você digita no VS Code).

### Passo 6: Limpeza de Legado e Deploy

1. Apague os gerenciadores antigos (como o PM2 `ecosystem.config.js`).
2. Faça commit, puxe (pull) as alterações na VPS.
3. Execute `docker compose up -d --build`.

## PARTE 2: Projetos Novos (Nascendo Cloud-Native)

A grande vantagem de começar um projeto do zero hoje é que você nem precisa instalar o Node.js ou o Python na sua própria máquina local. Tudo acontece dentro do Docker desde o dia 1.

### Passo 1: Infraestrutura Primeiro, Código Depois

Abra uma pasta vazia no VS Code. Antes de escrever a primeira linha de lógica, crie imediatamente os ficheiros de base:

1. `Dockerfile` (mesmo que só com a imagem base e o `CMD`).
2. `.dockerignore`.
3. `docker-compose.dev.yml`.

### Passo 2: Inicializar via Contêiner

Precisa criar um projeto Vite novo ou iniciar um ambiente Python? Em vez de rodar o comando no seu terminal do Windows/WSL, faça o contêiner trabalhar por si.

Exemplo: Para criar um projeto Node do zero sem ter o Node instalado, você pode usar uma imagem descartável:

```bash
docker run --rm -v ${PWD}:/app -w /app node:22-alpine npm init -y
```

### Passo 3: O Fluxo de Desenvolvimento Fechado

Ligue o seu `docker-compose.dev.yml` (com o espelhamento de volumes ativado). A partir de agora, você escreve código no VS Code, mas quem executa, compila e exibe os erros no terminal é o contêiner rodando em segundo plano. O seu sistema operativo fica completamente limpo.

### Passo 4: O Design Orientado a Serviços (Microsserviços)

Como o projeto nasce no Docker, se amanhã você precisar de uma base de dados PostgreSQL, Redis, ou de um servidor Nginx secundário, não instala nada no computador. Basta adicionar um novo "serviço" no seu `docker-compose.yml` e eles comunicarão entre si através de uma rede isolada.
