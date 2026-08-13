# DEPLOY — jmattosdev.tech (VPS + Nginx + dist/)

Guia passo a passo para publicar o JMATTOS.DEV (landing page **estática**) na sua VPS.

**Arquitetura:**

```
Usuário → DNS (jmattosdev.tech → IP da VPS) → Nginx → /var/www/jmattosdev.tech (dist/)
```

> **Segurança:** antes de qualquer comando que altere Nginx ou firewall, leia a explicação.
> Nenhum comando aqui é destrutivo por si só; os com `--delete` e `ufw` são destacados.

---

## Pré-requisitos

- Domínio `jmattosdev.tech` registrado e com acesso ao painel DNS.
- VPS (Ubuntu/Debian) com acesso SSH e usuário com `sudo`.
- Build local gerado: `npm run build` → pasta [`dist/`](dist).

---

## Etapa 1 — DNS (feito no painel do registrador, NÃO no servidor)

Crie dois registros **A**:

| Tipo | Nome/Host | Valor |
| --- | --- | --- |
| A | `@` (ou `jmattosdev.tech`) | IP da VPS |
| A | `www` | IP da VPS |

- Verifique a propagação (pode levar minutos/horas):
  ```bash
  dig jmattosdev.tech +short
  nslookup jmattosdev.tech
  ```
- ⚠️ O **Certbot (HTTPS)** só funciona depois que o domínio apontar para a VPS. As etapas 2–7 podem ser feitas antes da propagação.

---

## Etapa 2 — Conectar à VPS

```bash
ssh SEU_USUARIO@SEU_IP
```

---

## Etapa 3 — Atualizar sistema e instalar o Nginx

**Explicação:** `apt update` baixa a lista atual de pacotes; `apt upgrade` aplica atualizações de segurança; `apt install nginx` instala o servidor web.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx
```

---

## Etapa 4 — Firewall (UFW no Ubuntu)

**Explicação ANTES de executar:**
- `ufw` (Uncomplicated Firewall) gerencia as regras de rede.
- **Liberar SSH (porta 22) é OBRIGATÓRIO primeiro** — se você ativar o firewall sem liberar SSH, **perde o acesso ao servidor**.
- `Nginx Full` libera as portas **80 (HTTP)** e **443 (HTTPS)**, necessárias para o site.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

> **Atenção:** se a VPS usa outro firewall (painel do provedor/security group, ou `firewalld`), ajuste por lá. Verifique o painel do seu provedor para liberar 80/443 também.

---

## Etapa 5 — Confirmar o Nginx

```bash
sudo systemctl status nginx
curl http://SEU_IP   # deve retornar a página padrão do Nginx
```

---

## Etapa 6 — Criar diretório e enviar o build

**No servidor** (cria a pasta do site e dá permissão ao seu usuário):

```bash
sudo mkdir -p /var/www/jmattosdev.tech
sudo chown -R $USER:$USER /var/www/jmattosdev.tech
```

**Na sua máquina local** (outro terminal, dentro da pasta do projeto `jmattosdev/`):

```bash
rsync -avz --delete dist/ SEU_USUARIO@SEU_IP:/var/www/jmattosdev.tech/
```

- `-a` preserva arquivos/permissões · `-z` comprime · `-v` mostra o progresso.
- ⚠️ **`--delete`**: apaga no destino o que não existe mais na origem. Só usar apontando para a pasta **exata** do site (evita apagar arquivos de outros sites na mesma máquina).
- Alternativa sem `rsync` (não remove arquivos obsoletos):
  ```bash
  scp -r dist/* SEU_USUARIO@SEU_IP:/var/www/jmattosdev.tech/
  ```

---

## Etapa 7 — Configurar o Nginx (bloco do site)

**Explicação do que faz:** cria um arquivo de configuração que diz ao Nginx "para os domínios `jmattosdev.tech`/`www`, sirva os arquivos de `/var/www/jmattosdev.tech` na porta 80".

Crie o arquivo:

```bash
sudo nano /etc/nginx/sites-available/jmattosdev
```

Conteúdo:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jmattosdev.tech www.jmattosdev.tech;

    root /var/www/jmattosdev.tech;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

- `listen 80` → escuta HTTP.
- `server_name` → responde apenas para esses domínios.
- `root` → pasta com o site.
- `try_files ... =404` → busca o arquivo pedido; se não existir, retorna 404 (landing page estática, sem rotas SPA).

**Ativar e testar (sem derrubar o servidor):**

```bash
sudo ln -s /etc/nginx/sites-available/jmattosdev /etc/nginx/sites-enabled/
sudo nginx -t          # valida a sintaxe — NÃO aplica nada ainda (seguro)
sudo systemctl reload nginx   # recarrega sem interromper conexões ativas
```

---

## Etapa 8 — HTTPS com Let's Encrypt (Certbot)

**Explicação:** o Certbot emite o certificado SSL gratuito (90 dias), configura o Nginx para HTTPS e cria o redirect automático de HTTP → HTTPS. **Requer o DNS já apontando para a VPS (Etapa 1).**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jmattosdev.tech -d www.jmattosdev.tech
```

Durante a execução, ele pergunta: e-mail para avisos, aceitar os termos e se deseja redirecionar HTTP → HTTPS (responda **sim**).

**Renovação automática (testar):**

```bash
sudo certbot renew --dry-run
```

---

## Etapa 9 — Validar a publicação

```bash
# Página principal
curl -I https://jmattosdev.tech          # esperado: HTTP/2 200
# Redirect HTTP → HTTPS
curl -I http://jmattosdev.tech           # esperado: 301 (Location: https://...)
```

Abra `https://jmattosdev.tech` no navegador (cadeado 🔒) e confira as seções, imagens e o menu mobile.

---

## 🔄 Como atualizar o site no futuro (GitHub → deploy)

O fluxo depende de como o código chega ao servidor:

### Opção A — Deploy manual (recomendado agora, sem clonar repo na VPS)

1. Altere o código localmente e publique no GitHub:
   ```bash
   git add . && git commit -m "descrição da mudança" && git push
   ```
2. Gere o build localmente:
   ```bash
   npm run build
   ```
3. Envie para a VPS (repetir a Etapa 6):
   ```bash
   rsync -avz --delete dist/ SEU_USUARIO@SEU_IP:/var/www/jmattosdev.tech/
   ```
4. Pronto — o site já está atualizado (o Nginx serve os novos arquivos imediatamente).

### Opção B — Deploy no servidor (clonar o repositório na VPS)

1. Clone o repositório uma vez na VPS (ex.: `/home/SEU_USUARIO/jmattosdev`).
2. A cada atualização, no servidor:
   ```bash
   cd /caminho/jmattosdev
   git pull
   npm ci          # instala as dependências exatas do package-lock.json
   npm run build
   rsync -avz --delete dist/ /var/www/jmattosdev.tech/
   ```
3. **Automatizar (opcional):** criar um script `deploy.sh` com os passos acima e dispará-lo por **GitHub Actions / webhook** ao fazer `git push`. Posso ajudar a montar isso.

> **Dica:** só use `sudo systemctl reload nginx` quando alterar a configuração do Nginx (Etapa 7/8) — para mudanças apenas de conteúdo (HTML/CSS/JS), basta atualizar a pasta `dist/`.

---

© JMATTOS.DEV — Julio Mattos
