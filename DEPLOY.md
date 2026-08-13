# DEPLOY — jmattosdev.tech (SFTP + Nginx + deploy automático)

Guia passo a passo para publicar o JMATTOS.DEV (landing page **estática**) no seu domínio usando a **extensão SFTP do VSCode**.

**Arquitetura:**

```
Usuário → DNS (jmattosdev.tech → IP da VPS) → Nginx → /home/deploy/jmattosdev.tech (conteúdo de dist/)
```

**Fluxo de trabalho:**

```
Código local (src/) → npm run build -- --watch → dist/ → SFTP (upload automático ao salvar) → VPS → Nginx serve a versão mais recente
```

> **Hot-reload no servidor:** o projeto usa Vite. Rodando `npm run build -- --watch` + `uploadOnSave`/watcher do SFTP, **cada alteração salva no código local é enviada automaticamente para a VPS** e o Nginx passa a servir a nova versão imediatamente — sem precisar subir nada manualmente (basta atualizar a página no navegador com F5).

---

## 1. Pré-requisitos

Antes de começar, confirme que você tem:

- **VPS (Ubuntu/Debian)** com **Nginx instalado e rodando** (`systemctl status nginx`).
- **Extensão SFTP instalada no VSCode** — a oficial do mercado: *SFTP* de **Natizyskunk** (ID: `Natizyskunk.sftp`). É ela que gerencia o upload e o deploy automático.
- **Acesso SSH/SFTP** à VPS com o usuário **`deploy`** (host: `jmattosinfo`), autenticando por **chave SSH** (recomendado) ou senha.
- **Domínio próprio** já registrado (ex.: `jmattosdev.tech`) e com **registro A no DNS apontando para o IP da VPS**.
- **Projeto versionado no GitHub** (branch `main`) — o repositório é a fonte de verdade do código; o deploy apenas publica o build.
- **Node.js + npm** instalados localmente (para gerar o build com `npm run build`).

---

## 2. Configuração do SFTP no VSCode

### 2.1. Criar o arquivo `sftp.json`

Com o projeto aberto no VSCode, abra a paleta de comandos (`Ctrl+Shift+P`) e execute **`SFTP: Config`**. Isso cria o arquivo [`.vscode/sftp.json`](.vscode/sftp.json) na raiz do projeto.

### 2.2. Conteúdo recomendado

```json
{
    "name": "jmattosdev-vps",
    "host": "jmattosinfo",
    "protocol": "sftp",
    "port": 22,
    "username": "deploy",
    "privateKeyPath": "~/.ssh/id_rsa",
    "remotePath": "/home/deploy/jmattosdev.tech",
    "context": "dist",
    "uploadOnSave": true,
    "ignore": [
        "**/.git/**",
        "**/.vscode/**",
        "**/node_modules/**",
        "**/*.map"
    ],
    "watcher": {
        "files": "**/*",
        "autoUpload": true,
        "autoDelete": true
    }
}
```

**Explicação dos campos principais:**

| Campo | Valor | O que faz |
| --- | --- | --- |
| `host` | `jmattosinfo` | Endereço (hostname ou IP) da VPS. |
| `username` | `deploy` | Usuário de acesso à VPS. |
| `privateKeyPath` | `~/.ssh/id_rsa` | Caminho da chave privada SSH. **Alternativa:** use `"password": "SUA_SENHA"` (menos seguro). |
| `remotePath` | `/home/deploy/jmattosdev.tech` | **Pasta de destino na VPS** — é o `root` que o Nginx vai servir. |
| `context` | `dist` | Pasta **local** cujo conteúdo será enviado. Como o site é servido a partir do build, o SFTP envia o conteúdo de `dist/` direto para `remotePath`. |
| `uploadOnSave` | `true` | Envia o arquivo para a VPS **toda vez que ele for salvo** (essencial para o hot-reload). |
| `ignore` | `...` | Exclui pastas/arquivos desnecessários do upload (git, node_modules, maps). |
| `watcher` | `autoUpload` | Observa a pasta `dist/` e faz **upload automático** quando o build regenera os arquivos. |

### 2.3. Primeiro upload (envio inicial)

Após configurar o arquivo, faça o upload inicial de todo o `dist/`:

1. `Ctrl+Shift+P` → **`SFTP: Sync Local -> Remote`** (ou `SFTP: Upload Folder`).
2. Aguarde a barra de progresso no canto inferior direito.
3. Confirme no servidor:
   ```bash
   ssh deploy@jmattosinfo
   ls -la ~/jmattosdev.tech   # deve listar index.html e a pasta assets/
   ```

---

## 3. Estrutura de diretórios na VPS e permissões

O site fica no diretório **`/home/deploy/jmattosdev.tech`** (o `remotePath` do SFTP). A estrutura final:

```
/home/deploy/jmattosdev.tech/
├── index.html
└── assets/
    ├── index-*.js
    └── index-*.css
```

> O Nginx roda com o usuário `www-data`, então ele precisa de **permissão de leitura** (e de *atravessar* os diretórios) até o conteúdo. Ajuste as permissões no servidor:

```bash
# Garante que o home do usuário permita atravessar até o site
chmod o+x /home/deploy

# Dono: deploy (para o SFTP continuar escrevendo normalmente)
sudo chown -R deploy:deploy /home/deploy/jmattosdev.tech

# Permissões: 755 em diretórios e 644 em arquivos (leitura para o Nginx/www-data)
find /home/deploy/jmattosdev.tech -type d -exec chmod 755 {} \;
find /home/deploy/jmattosdev.tech -type f -exec chmod 644 {} \;
```

> **Dica:** rode os `chmod` acima novamente após cada deploy se você notar erros de permissão (`403 Forbidden`).

---

## 4. Configuração do Nginx (bloco do servidor)

Crie um arquivo de configuração para o site em `/etc/nginx/sites-available/`:

```bash
sudo nano /etc/nginx/sites-available/jmattosdev
```

Conteúdo:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jmattosdev.tech www.jmattosdev.tech;

    root /home/deploy/jmattosdev.tech;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache de assets com hash (imutáveis) — melhora performance
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cabeçalhos de segurança básicos
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

**O que cada bloco faz:**

- `listen 80` → escuta na porta HTTP.
- `server_name` → responde **apenas** para `jmattosdev.tech` e `www.jmattosdev.tech`.
- `root` → **pasta de deploy** (o `remotePath` do SFTP).
- `index index.html index.htm` → arquivo padrão servido na raiz.
- `location /` com `try_files $uri $uri/ =404` → serve o arquivo pedido ou retorna 404 (site estático, sem rotas SPA).
- `location /assets/` → cache longo para os arquivos gerados pelo build (nomes com hash).
- `add_header ...` → cabeçalhos de segurança básicos.

> **HTTPS (opcional):** depois que o DNS apontar para a VPS, você pode emitir certificado grátis com o Certbot:
> ```bash
> sudo apt install -y certbot python3-certbot-nginx
> sudo certbot --nginx -d jmattosdev.tech -d www.jmattosdev.tech
> ```

---

## 5. Ativação do site no Nginx

Ative o site criando um **link simbólico** de `sites-available/` para `sites-enabled/`, teste a sintaxe e recarregue:

```bash
# Ativa o site (link simbólico)
sudo ln -s /etc/nginx/sites-available/jmattosdev /etc/nginx/sites-enabled/

# Testa a configuração — valida a sintaxe SEM aplicar nada ainda (seguro)
sudo nginx -t

# Aplica a nova configuração sem derrubar conexões ativas
sudo systemctl reload nginx
# ou
sudo service nginx reload
```

> **Esperado no `nginx -t`:** `syntax is ok` e `test is successful`. Se houver erro, corrija o arquivo e repita o `nginx -t` antes de recarregar.

---

## 6. Publicação no domínio

### 6.1. Validar o DNS

Confirme que o domínio já resolve para o IP da VPS:

```bash
dig jmattosdev.tech +short
nslookup jmattosdev.tech
# Se aparecer o IP da sua VPS, o DNS está apontando corretamente.
```

**Se o DNS ainda não resolver:** acesse o painel do registrador e crie/ajuste os registros **A**:

| Tipo | Nome/Host | Valor |
| --- | --- | --- |
| A | `@` (ou `jmattosdev.tech`) | IP da VPS |
| A | `www` | IP da VPS |

> A propagação pode levar de minutos a algumas horas.

### 6.2. Testar localmente na VPS (antes do navegador)

```bash
# Dentro da VPS: deve retornar o HTML do seu site
curl -I http://localhost
# Esperado: HTTP/1.1 200 OK
```

### 6.3. Acessar pelo navegador

Abra **`http://jmattosdev.tech`** (e também `http://www.jmattosdev.tech`). Confirme:

- A página carrega (hero, sobre, stack, projetos, serviços, contato).
- Imagens e screenshots aparecem corretamente.
- O menu mobile funciona.

**Site no ar 🎉**

---

## 7. Atualizações futuras (deploy automático / hot-reload)

### 7.1. Deploy automático ao salvar (recomendado)

O objetivo é que **cada alteração local** já vá para o servidor sem esforço manual:

1. **Deixe o build em modo watch rodando** em um terminal (gera o `dist/` atualizado a cada salvamento no `src/`):
   ```bash
   npm run build -- --watch
   ```
2. **Salve o código no VSCode** — o Vite recompila o `dist/` e a extensão SFTP (via `watcher` + `uploadOnSave`) **envia os arquivos alterados para a VPS automaticamente**.
3. **Recarregue a página** no navegador (F5) para ver a mudança publicada.

> Como o Nginx serve os arquivos da pasta `~/jmattosdev.tech` diretamente, **não é preciso reiniciar nem recarregar o Nginx** em atualizações de conteúdo (HTML/CSS/JS). Basta o upload ter sido feito.

### 7.2. Atualização manual com a extensão SFTP

Se preferir um controle manual:

1. Altere o código e publique no GitHub como de costume:
   ```bash
   git add . && git commit -m "descrição da mudança" && git push
   ```
2. Gere o build:
   ```bash
   npm run build
   ```
3. `Ctrl+Shift+P` → **`SFTP: Sync Local -> Remote`** para enviar o novo `dist/` à VPS.
4. Pronto — o site já está atualizado.

### 7.3. Alternativa: `git pull` no servidor

Se preferir versionar o deploy pelo servidor (requer Node.js/npm na VPS):

```bash
cd /home/deploy/jmattosdev
git pull
npm ci && npm run build
rsync -avz --delete dist/ /home/deploy/jmattosdev.tech/
```

> **Atenção com `--delete`:** apaga no destino o que não existe mais na origem — use sempre apontando para a pasta **exata** do site.

> **Dica:** o fluxo 7.1 (SFTP + build em watch) é o que entrega o "hot-reload" contínuo pedido, sem depender de Node.js na VPS.

---

## 8. Solução de problemas (troubleshooting)

Verificações rápidas na ordem:

| Sintoma | Verificação |
| --- | --- |
| Site fora do ar | `systemctl status nginx` na VPS — confira se o serviço está `active (running)`. |
| Config do Nginx com erro | `sudo nginx -t` — corrija a sintaxe e rode `sudo systemctl reload nginx`. |
| `403 Forbidden` | Permissões dos arquivos: rode os `chmod` da [seção 3](#3-estrutura-de-diretórios-na-vps-e-permissões). |
| Página antiga / mudança não aparece | Confirme que o upload foi feito (`ls -la ~/jmattosdev.tech` e veja a data dos arquivos) e force o refresh (`Ctrl+Shift+R`). |
| Domínio não abre, mas IP abre | DNS não apontou ainda: `dig jmattosdev.tech +short` — se vazio, aguarde a propagação ou ajuste o registro A. |
| Upload SFTP não acontece | Confira o [`.vscode/sftp.json`](.vscode/sftp.json): host, username, `privateKeyPath`/`password`, `remotePath` e se `uploadOnSave`/`watcher` estão ativos. |
| Nginx não responde na VPS | `curl -I http://localhost` — se retornar HTML do seu site, o problema é DNS/firewall; se não, revise `nginx -t` e o `server_name`. |
| Portas 80/443 bloqueadas | No Ubuntu, confira o firewall: `sudo ufw status` → `Nginx Full` deve estar `ALLOW`. |

**Comando de diagnóstico rápido (roda tudo em sequência):**

```bash
sudo systemctl status nginx && sudo nginx -t && ls -la /home/deploy/jmattosdev.tech && curl -I http://localhost
```

---

© JMATTOS.DEV — Julio Mattos
