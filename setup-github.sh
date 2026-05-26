#!/bin/bash
# Script para sincronizar com GitHub após extração

echo "🏆 Arena dos Mestres da Lógica — Setup GitHub"
echo ""

if [ -z "$1" ]; then
  echo "Uso: bash setup-github.sh https://github.com/rafaelbernini/arena-dos-mestres.git"
  exit 1
fi

REMOTE_URL=$1

echo "📦 Inicializando repositório Git..."
git init
git add .
git commit -m "feat: projeto inicial — Arena dos Mestres da Lógica SESI"
git branch -M main

echo "🔗 Conectando ao repositório remoto: $REMOTE_URL"
git remote add origin "$REMOTE_URL"

echo "⬆️  Fazendo push para o GitHub..."
git push -u origin main

echo ""
echo "✅ Pronto! Repositório sincronizado com sucesso."
echo "   Acesse: $REMOTE_URL"
