#!/bin/bash

BASE_URL="http://localhost:3333/api"

echo "════════════════════════════════════════════════════"
echo "🎥 TESTANDO GET DE TODOS OS VÍDEOS"
echo "════════════════════════════════════════════════════"
echo ""

# 1. Login
echo "🔐 1. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "123456"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Erro: Usuário não existe ou senha incorreta"
  exit 1
fi

echo "✅ Token obtido!"
echo ""

# 2. Listar TODOS os vídeos do usuário (de todos os projetos)
echo "📋 2. Listando TODOS os vídeos do usuário..."
ALL_VIDEOS=$(curl -s -X GET "$BASE_URL/videos" \
  -H "Authorization: Bearer $TOKEN")

echo "$ALL_VIDEOS" | jq

# Contar vídeos
VIDEO_COUNT=$(echo "$ALL_VIDEOS" | jq '. | length')
echo ""
echo "📊 Total de vídeos encontrados: $VIDEO_COUNT"
echo ""

# 3. Agrupar por projeto
echo "📁 Vídeos por projeto:"
echo "$ALL_VIDEOS" | jq -r 'group_by(.project.name) | .[] | "\(.length) vídeos em \(.[0].project.name)"'

echo ""
echo "════════════════════════════════════════════════════"
echo "✅ TESTE CONCLUÍDO!"
echo "════════════════════════════════════════════════════"
