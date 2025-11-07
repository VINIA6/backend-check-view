#!/bin/bash

BASE_URL="http://localhost:3333/api"

echo "🔐 1. Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "123456"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Erro: Usuário não existe. Registrando..."
  
  REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"name": "João Silva", "email": "joao@email.com", "password": "123456"}')
  
  echo "✅ Usuário registrado!"
  echo "$REGISTER" | jq
  
  # Login novamente
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "joao@email.com", "password": "123456"}')
  
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
fi

echo "✅ Token: ${TOKEN:0:50}..."
echo ""

echo "📁 2. Criando projeto..."
PROJECT=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Meu Primeiro Projeto",
    "description": "Projeto de teste",
    "color": "#FF5733"
  }')

echo "$PROJECT" | jq
echo ""

echo "📋 3. Listando todos os projetos..."
curl -s -X GET "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "🔍 4. Buscando projetos com 'Primeiro'..."
curl -s -X GET "$BASE_URL/projects?search=Primeiro" \
  -H "Authorization: Bearer $TOKEN" | jq

