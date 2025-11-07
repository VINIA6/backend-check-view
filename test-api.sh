#!/bin/bash

# 🎥 Video Annotation Platform - Backend API Tests
# Este script contém exemplos de requisições para testar a API

BASE_URL="http://localhost:3333/api"

echo "════════════════════════════════════════════════════"
echo "🎥 VIDEO ANNOTATION PLATFORM - API TESTS"
echo "════════════════════════════════════════════════════"
echo ""

# ================================================
# 1. HEALTH CHECK
# ================================================
echo "📊 1. Health Check"
echo "----------------------------------------"
curl -X GET "$BASE_URL/health" | jq
echo -e "\n"

# ================================================
# 2. REGISTRO DE USUÁRIO
# ================================================
echo "👤 2. Registrando novo usuário..."
echo "----------------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }')

echo "$REGISTER_RESPONSE" | jq
echo -e "\n"

# ================================================
# 3. LOGIN
# ================================================
echo "🔐 3. Fazendo login..."
echo "----------------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }')

echo "$LOGIN_RESPONSE" | jq

# Extrair o token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""
echo "🎟️  Token JWT: $TOKEN"
echo -e "\n"

# ================================================
# 4. CRIAR PROJETO
# ================================================
echo "📁 4. Criando novo projeto..."
echo "----------------------------------------"
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Meu Primeiro Projeto",
    "description": "Projeto de teste criado via API",
    "color": "#FF5733"
  }')

echo "$PROJECT_RESPONSE" | jq
PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.id')
echo -e "\n"

# ================================================
# 5. CRIAR MAIS UM PROJETO
# ================================================
echo "📁 5. Criando segundo projeto..."
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Projeto Marketing",
    "description": "Vídeos de campanhas de marketing",
    "color": "#3498DB"
  }' | jq
echo -e "\n"

# ================================================
# 6. LISTAR PROJETOS DO USUÁRIO
# ================================================
echo "📋 6. Listando todos os projetos do usuário..."
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN" | jq
echo -e "\n"

# ================================================
# 7. TESTE SEM AUTENTICAÇÃO (deve falhar)
# ================================================
echo "⛔ 7. Tentando acessar sem token (deve falhar)..."
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/projects" | jq
echo -e "\n"

echo "════════════════════════════════════════════════════"
echo "✅ TESTES CONCLUÍDOS!"
echo "════════════════════════════════════════════════════"

