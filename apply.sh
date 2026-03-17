#!/usr/bin/env bash
# =============================================================
#  Nossa Agenda — Script de Aplicação + Git Push
#  
#  USO:
#    1. Coloque este script na RAIZ do seu projeto
#    2. Coloque a pasta "outputs/" (baixada da conversa) também na raiz
#    3. chmod +x apply.sh
#    4. ./apply.sh
#
#  O script vai:
#    - Copiar todos os arquivos gerados para os lugares certos
#    - Fazer git add, commit e push automaticamente
# =============================================================

set -e  # para se der erro em qualquer comando

# ── Cores ──────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── Helpers ────────────────────────────────────────────────
ok()   { echo -e "${GREEN}✅  $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️   $1${NC}"; }
info() { echo -e "${BLUE}ℹ️   $1${NC}"; }
err()  { echo -e "${RED}❌  $1${NC}"; exit 1; }
step() { echo -e "\n${BOLD}── $1${NC}"; }

# ── Cabeçalho ──────────────────────────────────────────────
echo ""
echo -e "${BOLD}💑  Nossa Agenda — Apply & Push${NC}"
echo "────────────────────────────────────────"
echo ""

# ── Verificações iniciais ──────────────────────────────────
step "Verificando ambiente"

# Está na raiz do projeto?
if [ ! -f "package.json" ]; then
  err "Execute este script na RAIZ do projeto (onde está o package.json)"
fi
ok "package.json encontrado"

# Pasta outputs existe?
OUTPUTS="./outputs"
if [ ! -d "$OUTPUTS" ]; then
  err "Pasta 'outputs/' não encontrada. Baixe os arquivos da conversa e coloque em outputs/"
fi
ok "Pasta outputs/ encontrada"

# Git inicializado?
if [ ! -d ".git" ]; then
  warn "Repositório git não inicializado. Inicializando..."
  git init
  ok "Git inicializado"
else
  ok "Repositório git existente"
fi

# ── Criar estrutura de pastas ──────────────────────────────
step "Criando estrutura de pastas"

mkdir -p app/\(app\)/agenda/\[eventId\]
mkdir -p app/\(app\)/historico
mkdir -p app/\(app\)/sugestoes
mkdir -p app/\(app\)/casal
mkdir -p app/\(app\)/configuracoes
mkdir -p components/agenda
mkdir -p lib
mkdir -p prisma

ok "Pastas criadas"

# ── Copiar arquivos ────────────────────────────────────────
step "Copiando arquivos"

copy_file() {
  local src="$1"
  local dst="$2"
  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo -e "  ${GREEN}→${NC} $dst"
  else
    warn "Arquivo não encontrado: $src (pulando)"
  fi
}

# Raiz
copy_file "$OUTPUTS/README.md"        "./README.md"
copy_file "$OUTPUTS/.gitignore"       "./.gitignore"
copy_file "$OUTPUTS/.env.example"     "./.env.example"
copy_file "$OUTPUTS/next.config.mjs"  "./next.config.mjs"
copy_file "$OUTPUTS/SETUP.md"         "./SETUP.md"
copy_file "$OUTPUTS/swagger-docs.html" "./swagger-docs.html"

# App
copy_file "$OUTPUTS/app/globals.css"  "./app/globals.css"
copy_file "$OUTPUTS/app/page.tsx"     "./app/page.tsx"

# App (app) — rotas protegidas
copy_file "$OUTPUTS/app/agenda/page.tsx"          "./app/(app)/agenda/page.tsx"
copy_file "$OUTPUTS/app/agenda/eventId/page.tsx"  "./app/(app)/agenda/[eventId]/page.tsx"
copy_file "$OUTPUTS/app/historico/page.tsx"       "./app/(app)/historico/page.tsx"
copy_file "$OUTPUTS/app/sugestoes/page.tsx"       "./app/(app)/sugestoes/page.tsx"
copy_file "$OUTPUTS/app/casal/page.tsx"           "./app/(app)/casal/page.tsx"
copy_file "$OUTPUTS/app/configuracoes/page.tsx"   "./app/(app)/configuracoes/page.tsx"

# Components
copy_file "$OUTPUTS/components/app-sidebar.tsx"   "./components/agenda/app-sidebar.tsx"
copy_file "$OUTPUTS/components/mobile-nav.tsx"    "./components/agenda/mobile-nav.tsx"

# Lib
copy_file "$OUTPUTS/lib-jwt-secret.ts"  "./lib/jwt-secret.ts"

# Prisma
copy_file "$OUTPUTS/schema.prisma"  "./prisma/schema.prisma"

ok "Todos os arquivos copiados"

# ── Verificar .env ─────────────────────────────────────────
step "Verificando configuração do ambiente"

if [ ! -f ".env" ]; then
  warn ".env não encontrado. Criando a partir do .env.example..."
  cp .env.example .env
  echo ""
  echo -e "${YELLOW}  📝 IMPORTANTE: Edite o arquivo .env antes de fazer deploy!${NC}"
  echo -e "${YELLOW}     Preencha: DATABASE_URL e JWT_SECRET no mínimo.${NC}"
  echo ""
else
  ok ".env já existe (não foi sobrescrito)"
fi

# ── Verificar .env no .gitignore ───────────────────────────
if grep -q "^\.env$" .gitignore 2>/dev/null; then
  ok ".env está no .gitignore (seguro)"
else
  warn ".env não está no .gitignore! Adicionando..."
  echo ".env" >> .gitignore
  ok ".env adicionado ao .gitignore"
fi

# ── Git status ─────────────────────────────────────────────
step "Preparando commit"

echo ""
info "Arquivos modificados:"
git status --short 2>/dev/null | head -30
echo ""

# Confirmar antes de commitar
echo -e "${BOLD}Deseja fazer git add + commit + push agora? [s/N]${NC} "
read -r CONFIRM

if [[ "$CONFIRM" =~ ^[Ss]$ ]]; then

  # ── Git add ──────────────────────────────────────────────
  git add .
  ok "git add . executado"

  # ── Git commit ───────────────────────────────────────────
  COMMIT_MSG="feat: redesign completo UI, swagger docs, fixes segurança Vercel

- Redesign de todas as páginas (login, agenda, histórico, sugestões, casal, configurações, evento)
- Nova sidebar com indicador ativo animado (Framer Motion layoutId)
- Mobile nav redesenhado com animação suave entre tabs
- globals.css atualizado com tokens de design consistentes
- JWT secret: removido fallback hardcoded, exige env var em produção
- next.config.mjs: removido ignoreBuildErrors, adicionado serverExternalPackages
- Documentação API interativa (swagger-docs.html)
- README.md completo com guia de deploy Vercel + Neon
- .env.example documentado com todas as variáveis
- SETUP.md com guia passo a passo"

  git commit -m "$COMMIT_MSG"
  ok "Commit criado"

  # ── Git push ─────────────────────────────────────────────
  step "Fazendo push"

  # Verificar se tem remote configurado
  if git remote get-url origin &>/dev/null; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
    info "Fazendo push para origin/$BRANCH..."
    git push origin "$BRANCH"
    ok "Push concluído com sucesso! 🎉"
  else
    warn "Nenhum remote 'origin' configurado."
    echo ""
    echo -e "${YELLOW}  Para adicionar e fazer push, execute:${NC}"
    echo -e "${BLUE}    git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git${NC}"
    echo -e "${BLUE}    git push -u origin main${NC}"
    echo ""
  fi

else
  echo ""
  info "Push cancelado. Arquivos já foram copiados."
  info "Para fazer o push manualmente:"
  echo -e "${BLUE}    git add .${NC}"
  echo -e "${BLUE}    git commit -m \"feat: redesign completo\"${NC}"
  echo -e "${BLUE}    git push${NC}"
fi

# ── Resumo final ───────────────────────────────────────────
echo ""
echo "────────────────────────────────────────"
echo -e "${BOLD}🎉  Concluído!${NC}"
echo ""
echo -e "${BOLD}Próximos passos para deploy na Vercel:${NC}"
echo ""
echo -e "  ${YELLOW}1.${NC} Crie um banco PostgreSQL gratuito em ${BLUE}neon.tech${NC}"
echo -e "  ${YELLOW}2.${NC} Altere prisma/schema.prisma: ${BLUE}provider = \"postgresql\"${NC}"
echo -e "  ${YELLOW}3.${NC} Configure as env vars na Vercel:"
echo -e "       ${BLUE}DATABASE_URL${NC}          (connection string do Neon)"
echo -e "       ${BLUE}JWT_SECRET${NC}            (openssl rand -base64 32)"
echo -e "       ${BLUE}NEXT_PUBLIC_APP_URL${NC}   (https://seu-app.vercel.app)"
echo -e "       ${BLUE}RESEND_API_KEY${NC}        (opcional, para emails)"
echo -e "  ${YELLOW}4.${NC} ${BLUE}vercel${NC} ou conecte o repo no painel da Vercel"
echo ""
echo -e "  📖 Documentação completa: ${BLUE}./SETUP.md${NC}"
echo -e "  📡 Documentação da API:   ${BLUE}./swagger-docs.html${NC}"
echo ""
