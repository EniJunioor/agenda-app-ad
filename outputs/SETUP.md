# Nossa Agenda — Guia de Configuração Completo

## Índice
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Banco de Dados](#banco-de-dados)
- [Email (Resend)](#email-resend)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executar em Desenvolvimento](#executar-em-desenvolvimento)
- [Deploy em Produção](#deploy-em-produção)
- [Comandos Úteis](#comandos-úteis)
- [Documentação da API](#documentação-da-api)

---

## Pré-requisitos

- **Node.js** >= 20.9.0
- **npm** >= 9 (ou pnpm)
- Conta no [Resend](https://resend.com) (opcional, para emails)

---

## Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd agenda-app

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de variáveis de ambiente
cp .env.example .env
```

---

## Banco de Dados

O sistema usa **SQLite** em desenvolvimento e **PostgreSQL** em produção via **Prisma ORM**.

### Desenvolvimento (SQLite)

```bash
# Configurar DATABASE_URL no .env:
DATABASE_URL="file:./prisma/dev.db"

# Criar o banco e aplicar migrations
npx prisma migrate dev --name init

# Gerar o Prisma Client
npx prisma generate

# (Opcional) Visualizar o banco no browser
npx prisma studio
```

### Produção (PostgreSQL)

Para usar PostgreSQL (Supabase, Neon, Railway, etc.):

**1. Atualizar `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**2. Configurar DATABASE_URL:**
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

**3. Aplicar migrations em produção:**
```bash
npx prisma migrate deploy
```

### Estrutura do Banco

```
User
├── id (cuid, PK)
├── email (unique)
├── passwordHash (bcrypt, 12 rounds)
├── name
├── coupleId (FK → Couple)
├── createdAt
└── updatedAt

Couple
├── id (cuid, PK)
├── name ("João & Maria")
├── partner1Id (FK → User, opcional)
├── partner2Id (FK → User, opcional)
├── startDate (string "YYYY-MM-DD")
├── createdAt
└── updatedAt

PartnerInvite
├── id (cuid, PK)
├── email (convidado)
├── token (64 chars hex, unique)
├── coupleId (FK → Couple)
├── expiresAt (now + 7 dias)
├── usedAt (null até usar)
└── createdAt
```

---

## Email (Resend)

### Configuração

1. Crie uma conta em [resend.com](https://resend.com)
2. Em **API Keys**, crie uma nova chave
3. Adicione ao `.env`:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Nossa Agenda <onboarding@resend.dev>"
```

### Domínio Personalizado (Produção)

1. Vá em **Domains** no Resend
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído
4. Após verificação, use:

```env
EMAIL_FROM="Nossa Agenda <convite@seudominio.com>"
```

### Funcionamento sem Resend

Sem a variável `RESEND_API_KEY`, o sistema **continua funcionando**:
- O endpoint `/api/auth/invite-partner` retorna o link de convite na resposta
- O parceiro pode acessar o link diretamente
- Ideal para desenvolvimento local

### Template do Email de Convite

```html
<p>Olá!</p>
<p><strong>{inviterName}</strong> criou a agenda do casal 
   <strong>{coupleName}</strong> e te convidou para fazer parte.</p>
<p>
  <a href="{inviteLink}">
    Aceitar convite e criar minha conta
  </a>
</p>
<p>Este link expira em 7 dias.</p>
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | ✅ Sim | URL de conexão com o banco |
| `JWT_SECRET` | ✅ Sim | Segredo para assinar tokens JWT |
| `RESEND_API_KEY` | ⚠️ Opcional | Chave API do Resend para emails |
| `EMAIL_FROM` | ⚠️ Opcional | Email remetente |
| `NEXT_PUBLIC_APP_URL` | ✅ Sim | URL base do app (para links nos emails) |

---

## Executar em Desenvolvimento

```bash
# Certificar que .env está configurado
cat .env

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em: http://localhost:3000
# Documentação da API: abra swagger-docs.html no browser
```

---

## Deploy em Produção

### Vercel (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente:
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
vercel env add NEXT_PUBLIC_APP_URL
```

> **Nota**: Para Vercel com SQLite, use um banco de dados externo (Neon, Supabase, PlanetScale) pois o filesystem é efêmero.

### Build Manual

```bash
# Gerar Prisma Client e build
npm run build

# Iniciar em produção
npm run start
```

---

## Comandos Úteis

```bash
# Banco de dados
npx prisma studio              # Interface visual do banco
npx prisma migrate dev         # Criar e aplicar nova migration
npx prisma migrate reset       # Resetar banco (APAGA TUDO)
npx prisma db push             # Sincronizar schema sem migration
npx prisma generate            # Gerar Prisma Client

# Desenvolvimento
npm run dev                    # Servidor de dev com hot-reload
npm run build                  # Build de produção
npm run lint                   # Linting

# Gerar JWT Secret
openssl rand -base64 32        # Gerar string segura para JWT_SECRET
```

---

## Documentação da API

Abra o arquivo `swagger-docs.html` no seu browser para a documentação interativa completa com:

- 📋 Descrição de todos os endpoints
- 🧪 Testador interativo (requer servidor rodando)
- 🗄️ Schema do banco de dados
- ⚙️ Guia de variáveis de ambiente
- 📧 Configuração de email

```bash
# macOS
open swagger-docs.html

# Linux
xdg-open swagger-docs.html

# Windows
start swagger-docs.html
```

---

## Fluxo de Autenticação

```
1. POST /api/auth/register
   → Cria User + Couple no banco
   → Define cookie agenda_session (JWT, 7 dias)
   → Redirect 302 para /agenda

2. GET /api/auth/me
   → Lê cookie agenda_session
   → Verifica JWT
   → Retorna dados do usuário + casal

3. POST /api/auth/invite-partner
   → Cria PartnerInvite com token único (32 bytes)
   → Envia email via Resend (se configurado)
   → Retorna link de convite

4. POST /api/auth/accept-invite
   → Valida token + cria User
   → Vincula como partner2 do Couple
   → Define cookie e redireciona

5. POST /api/auth/logout
   → Remove cookie agenda_session
```

---

## Segurança

- Senhas: **bcryptjs** com 12 salt rounds
- Tokens: **JWT HS256** com segredo de 256+ bits
- Cookies: **HTTP-only**, **Secure** em produção, **SameSite=Lax**
- Validação: **Zod** em todos os inputs
- SQL Injection: **Prisma ORM** usa prepared statements
