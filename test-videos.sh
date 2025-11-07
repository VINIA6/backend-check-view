#!/bin/bash

BASE_URL="http://localhost:3333/api"

echo "════════════════════════════════════════════════════"
echo "🎥 TESTANDO ENDPOINTS DE VÍDEOS"
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

# 2. Criar projeto primeiro (se não existir)
echo "📁 2. Criando projeto de teste..."
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Projeto para Testes de Vídeos",
    "description": "Projeto criado para testar endpoints de vídeos",
    "color": "#FF5733"
  }')

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.id')
echo "✅ Projeto criado: $PROJECT_ID"
echo ""

# 3. Criar vídeo
echo "🎬 3. Criando vídeo..."
VIDEO_RESPONSE=$(curl -s -X POST "$BASE_URL/videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Vídeo Tutorial\",
    \"url\": \"https://example.com/video1.mp4\",
    \"duration\": 180.5,
    \"thumbnail\": \"https://example.com/thumb1.jpg\",
    \"projectId\": \"$PROJECT_ID\"
  }")

echo "$VIDEO_RESPONSE" | jq
VIDEO_ID=$(echo "$VIDEO_RESPONSE" | jq -r '.id')
echo ""

# 4. Criar mais um vídeo
echo "�� 4. Criando segundo vídeo..."
curl -s -X POST "$BASE_URL/videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Vídeo Demonstração\",
    \"filePath\": \"/uploads/demo.mp4\",
    \"duration\": 250.0,
    \"projectId\": \"$PROJECT_ID\"
  }" | jq
echo ""

# 5. Listar vídeos do projeto
echo "📋 5. Listando todos os vídeos do projeto..."
curl -s -X GET "$BASE_URL/videos/project/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 6. Deletar primeiro vídeo
echo "🗑️  6. Deletando primeiro vídeo..."
curl -s -X DELETE "$BASE_URL/videos/$VIDEO_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 7. Listar vídeos novamente
echo "📋 7. Listando vídeos após deletar..."
curl -s -X GET "$BASE_URL/videos/project/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "════════════════════════════════════════════════════"
echo "✅ TESTES DE VÍDEOS CONCLUÍDOS!"
echo "════════════════════════════════════════════════════"
