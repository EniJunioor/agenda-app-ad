# 💑 Nossa Agenda

> Agenda compartilhada para casais — organize momentos, guarde memórias e nunca esqueça uma data especial.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 📅 **Calendário compartilhado** | Visualize e crie eventos em um calendário mensal interativo |
| 👥 **Convidar parceiro(a)** | Sistema de convite por email com token de 7 dias |
| 💡 **Sugestões diárias** | Ideias de programas geradas automaticamente |
| 🏆 **Marcos do casal** | Acompanhe 100 dias, 1 ano, 2 anos juntos |
| 📊 **Histórico** | Timeline de todos os eventos com filtros |
| ❤️ **Reações** | Adicione emojis e comentários nos eventos |
| 🌙 **Tema claro/escuro** | Interface adaptável com next-themes |
| 📱 **Mobile first** | Navegação por bottom nav no celular |

---

## 🛠 Stack Técnica

```
Frontend    Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
UI          shadcn/ui + Radix UI + Framer Motion
Backend     Next.js Route Handlers (API Routes)
Banco       Prisma ORM + SQLite (dev) / PostgreSQL (produção)
Auth        JWT (jose) + Cookie HTTP-only + bcryptjs
Email       Resend SDK
Validação   Zod
```

---

## 🚀 Rodando localmente

### Pré-requisitos
- Node.js >= 20.9.0
- npm >= 9

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/nossa-agenda.git
cd nossa-agenda
npm install
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
# Banco de dados (SQLite para dev)
DATABASE_URL="file:./prisma/dev.db"

# JWT — gere com: openssl rand -base64 32
JWT_SECRET="seu-segredo-super-secreto"

# Email (opcional — sem isso, o link de convite vem na resposta da API)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Nossa Agenda <onboarding@resend.dev>"

# URL base do app
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configure o banco

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## ⚠️ Status atual e o que funciona

### ✅ Funciona 100%

| Área | Status |
|---|---|
| Registro e Login | ✅ Completo com cookie JWT |
| Logout | ✅ Remove cookie |
| Sessão `/api/auth/me` | ✅ Retorna dados do casal e parceiros |
| Convite de parceiro | ✅ Cria token + envia email (se Resend configurado) |
| Aceitar convite | ✅ Cria conta e vincula ao casal |
| UI — Login/Cadastro | ✅ Redesenhado com animações |
| UI — Agenda | ✅ Redesenhada com calendário interativo |
| UI — Histórico | ✅ Timeline com filtros |
| UI — Sugestões | ✅ Cards com like e animações |
| UI — Perfil do casal | ✅ Marcos e estatísticas |
| UI — Configurações | ✅ Tema, convite, perfil |
| UI — Detalhe do evento | ✅ Reações, edição, exclusão |
| Dark mode | ✅ Funciona em todas as páginas |
| Mobile nav | ✅ Bottom nav com animação |
| Sidebar desktop | ✅ Com indicador ativo animado |
| Documentação API | ✅ `swagger-docs.html` interativo |

### ⚠️ Limitação conhecida

**Eventos ficam em memória (React state)** — os eventos criados são perdidos ao recarregar a página. O backend de autenticação usa banco de dados (Prisma), mas os eventos ainda são gerenciados via `useState` no contexto React.

Para persistir eventos no banco seria necessário criar as tabelas `Event` e `Reaction` no Prisma e as rotas `/api/events`. Isso pode ser implementado como próxima fase.

---

## 🌐 Deploy na Vercel

### ⚠️ Leia antes de fazer deploy

**SQLite NÃO funciona na Vercel.** O filesystem da Vercel é efêmero — o arquivo `.db` é destruído a cada deploy. Você precisa de um banco PostgreSQL externo.

### Passo 1 — Criar banco PostgreSQL gratuito (Neon)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto (ex: `nossa-agenda`)
3. Copie a **Connection string** no formato:
   ```
   postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

### Passo 2 — Atualizar o schema Prisma para PostgreSQL

Edite `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // ← mude de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

### Passo 3 — Gerar migration para PostgreSQL

```bash
# Com a DATABASE_URL do Neon no .env:
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Passo 4 — Deploy na Vercel

```bash
npm i -g vercel
vercel
```

### Passo 5 — Configurar variáveis de ambiente na Vercel

No painel da Vercel → Settings → Environment Variables, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://...` (Neon connection string) |
| `JWT_SECRET` | String aleatória segura (`openssl rand -base64 32`) |
| `RESEND_API_KEY` | Sua chave do Resend (opcional) |
| `EMAIL_FROM` | `Nossa Agenda <convite@seudominio.com>` |
| `NEXT_PUBLIC_APP_URL` | `https://seu-app.vercel.app` |

### Passo 6 — Aplicar migrations no banco de produção

```bash
# Com DATABASE_URL do Neon:
npx prisma migrate deploy
```

---

## 📁 Estrutura do Projeto

```
nossa-agenda/
├── app/
│   ├── (app)/                    # Rotas protegidas (requer auth)
│   │   ├── layout.tsx            # Verifica sessão, redireciona se não logado
│   │   ├── agenda/               # Calendário principal
│   │   │   ├── page.tsx
│   │   │   └── [eventId]/page.tsx
│   │   ├── historico/page.tsx    # Timeline de eventos
│   │   ├── sugestoes/page.tsx    # Sugestões diárias
│   │   ├── casal/page.tsx        # Perfil do casal
│   │   └── configuracoes/page.tsx
│   ├── aceitar-convite/page.tsx  # Fluxo de aceite de convite
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       ├── me/route.ts
│   │       ├── register/route.ts
│   │       ├── invite-partner/route.ts
│   │       └── accept-invite/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Login / Landing
├── components/
│   ├── agenda/
│   │   ├── app-sidebar.tsx
│   │   ├── calendar-grid.tsx
│   │   ├── category-badge.tsx
│   │   ├── category-filter.tsx
│   │   ├── couple-header.tsx
│   │   ├── event-card.tsx
│   │   ├── event-modal.tsx
│   │   └── mobile-nav.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ui/                       # shadcn/ui components
├── context/
│   └── agenda-context.tsx        # Estado global (eventos em memória)
├── data/
│   └── events.ts                 # Tipos e categorias
├── lib/
│   ├── auth.ts                   # JWT, cookies, bcrypt
│   ├── db.ts                     # Prisma client singleton
│   ├── email.ts                  # Resend integration
│   ├── jwt-secret.ts             # Leitura segura do secret
│   └── validations/auth.ts       # Schemas Zod
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── middleware.ts
├── next.config.mjs
├── package.json
├── swagger-docs.html             # Documentação interativa da API
└── .env.example
```

---

## 🔒 Segurança

- **Senhas**: bcryptjs com 12 salt rounds
- **Tokens JWT**: HS256, expiração em 7 dias
- **Cookies**: `HttpOnly`, `Secure` (produção), `SameSite=Lax`
- **Validação**: Zod em todos os inputs das API routes
- **SQL Injection**: Prisma usa prepared statements
- **Secrets**: JWT_SECRET via variável de ambiente obrigatória em produção

---

## 📧 Configuração de Email (Resend)

1. Crie conta em [resend.com](https://resend.com)
2. Gere uma API Key em **API Keys**
3. Para produção: verifique seu domínio em **Domains**
4. Configure no `.env`:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Nossa Agenda <convite@seudominio.com>"
```

**Sem `RESEND_API_KEY`:** o endpoint `/api/auth/invite-partner` retorna o link diretamente na resposta JSON — funciona perfeitamente para desenvolvimento e pode ser enviado manualmente.

---

## 📖 Documentação da API

Abra `swagger-docs.html` no browser com o servidor rodando para testar todos os endpoints interativamente.

Endpoints disponíveis:

```
POST /api/auth/register         Criar conta + casal
POST /api/auth/login            Autenticar usuário
POST /api/auth/logout           Encerrar sessão
GET  /api/auth/me               Dados da sessão atual
POST /api/auth/invite-partner   Convidar parceiro(a)
GET  /api/auth/accept-invite    Validar token de convite
POST /api/auth/accept-invite    Aceitar convite e criar conta
```

---

## 🛠 Comandos úteis

```bash
# Desenvolvimento
npm run dev                    # Servidor local com hot-reload

# Banco de dados
npx prisma studio              # Interface visual do banco
npx prisma migrate dev         # Nova migration
npx prisma migrate reset       # Resetar banco (apaga tudo)
npx prisma generate            # Regenerar Prisma Client

# Produção
npm run build                  # Build + prisma generate
npm run start                  # Iniciar servidor de produção

# Utilitários
openssl rand -base64 32        # Gerar JWT_SECRET seguro
```

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: adicionar funcionalidade X'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

MIT © 2025 — Feito com ❤️ para casais

---

<div align="center">
  <strong>Nossa Agenda</strong> — porque os melhores momentos merecem ser lembrados 💑
</div>
