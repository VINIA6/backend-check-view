# 📁 GET /api/projects - Documentação Completa

## 🎯 Funcionalidades Implementadas

✅ **Busca por título** - Query param `search` (case-insensitive)
✅ **Agrupamento por data** - Projetos organizados pela data de criação
✅ **Contagem automática** - Quantidade de projetos por data
✅ **Autenticação JWT** - Somente projetos do usuário autenticado

---

## 📡 Endpoint

```
GET /api/projects?search={termo_busca}
```

### Headers
```
Authorization: Bearer {jwt_token}
```

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `search` | string | ❌ Não | Busca por nome do projeto (case-insensitive) |

---

## 📤 Resposta de Sucesso (200)

### Estrutura

```typescript
interface ProjectsByDate {
  date: string;           // Data no formato YYYY-MM-DD
  count: number;          // Quantidade de projetos nessa data
  projects: Project[];    // Array de projetos
}

interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  videoCount: number;        // Quantidade de vídeos
  annotationCount: number;   // Quantidade total de anotações
  createdAt: Date;
  updatedAt: Date;
}
```

### Exemplo de Resposta

```json
[
  {
    "date": "2025-10-31",
    "count": 3,
    "projects": [
      {
        "id": "proj-001",
        "name": "Projeto Marketing Digital",
        "description": "Campanhas de marketing 2025",
        "color": "#FF5733",
        "userId": "user-123",
        "videoCount": 8,
        "annotationCount": 45,
        "createdAt": "2025-10-31T15:30:00.000Z",
        "updatedAt": "2025-10-31T15:30:00.000Z"
      },
      {
        "id": "proj-002",
        "name": "Projeto Vendas Q1",
        "description": "Análise de vendas do primeiro trimestre",
        "color": "#3498DB",
        "userId": "user-123",
        "videoCount": 3,
        "annotationCount": 12,
        "createdAt": "2025-10-31T10:15:00.000Z",
        "updatedAt": "2025-10-31T10:15:00.000Z"
      },
      {
        "id": "proj-003",
        "name": "Projeto Treinamento",
        "description": null,
        "color": "#2ECC71",
        "userId": "user-123",
        "videoCount": 1,
        "annotationCount": 5,
        "createdAt": "2025-10-31T08:00:00.000Z",
        "updatedAt": "2025-10-31T08:00:00.000Z"
      }
    ]
  },
  {
    "date": "2025-10-30",
    "count": 1,
    "projects": [
      {
        "id": "proj-004",
        "name": "Projeto Onboarding",
        "description": "Vídeos de integração de novos colaboradores",
        "color": "#9B59B6",
        "userId": "user-123",
        "videoCount": 0,
        "annotationCount": 0,
        "createdAt": "2025-10-30T18:45:00.000Z",
        "updatedAt": "2025-10-30T18:45:00.000Z"
      }
    ]
  }
]
```

---

## 🔍 Exemplos de Uso

### 1. Listar Todos os Projetos

```bash
curl -X GET "http://localhost:3333/api/projects" \
  -H "Authorization: Bearer eyJhbGci..."
```

**Retorna:** Todos os projetos do usuário, agrupados por data

---

### 2. Buscar Projetos por Nome

```bash
curl -X GET "http://localhost:3333/api/projects?search=Marketing" \
  -H "Authorization: Bearer eyJhbGci..."
```

**Retorna:** Apenas projetos que contenham "Marketing" no nome (case-insensitive)

---

### 3. Busca com Espaços

```bash
curl -X GET "http://localhost:3333/api/projects?search=Projeto%20Digital" \
  -H "Authorization: Bearer eyJhbGci..."
```

**Retorna:** Projetos que contenham "Projeto Digital" no nome

---

## ⚠️ Respostas de Erro

### 401 - Não Autenticado

```json
{
  "message": "User not authenticated"
}
```

**Causa:** Token JWT ausente ou inválido

---

### 400 - Requisição Inválida

```json
{
  "message": "User ID is required"
}
```

**Causa:** Token JWT não contém o ID do usuário

---

## 🎨 Características da Resposta

### ✅ Ordenação

- **Por data:** Mais recente primeiro (desc)
- **Dentro da data:** Mais recente primeiro (desc)

### ✅ Agrupamento

Os projetos são automaticamente agrupados pela **data de criação** (não pela data de atualização).

### ✅ Contagem

Cada grupo de data inclui um campo `count` com o número exato de projetos.

### ✅ Busca Inteligente

- **Case-insensitive:** "marketing" encontra "Marketing Digital"
- **Parcial:** "Mark" encontra "Marketing Digital"
- **UTF-8:** Suporta acentuação e caracteres especiais

### ✅ Contadores Automáticos

Cada projeto inclui:
- **videoCount:** Número de vídeos cadastrados no projeto
- **annotationCount:** Soma de todas as anotações de todos os vídeos do projeto

**Exemplo:**
```
Projeto A:
  - Vídeo 1: 10 anotações
  - Vídeo 2: 5 anotações
  - Vídeo 3: 8 anotações
  → videoCount: 3
  → annotationCount: 23
```

---

## 🧪 Testando

### Com o script automatizado:

```bash
cd backend
./test-projects-simple.sh
```

### Manualmente:

```bash
# 1. Fazer login
TOKEN=$(curl -s -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}' \
  | jq -r '.token')

# 2. Listar projetos
curl -X GET "http://localhost:3333/api/projects" \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Buscar projetos
curl -X GET "http://localhost:3333/api/projects?search=Marketing" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 💡 Uso no Frontend

### JavaScript/TypeScript

```typescript
interface ProjectsByDate {
  date: string;
  count: number;
  projects: Project[];
}

async function getProjects(search?: string): Promise<ProjectsByDate[]> {
  const token = localStorage.getItem('token');
  const url = search 
    ? `/api/projects?search=${encodeURIComponent(search)}`
    : '/api/projects';
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
}

// Uso
const allProjects = await getProjects();
const searchResults = await getProjects('Marketing');

// Exibir no componente
allProjects.forEach(group => {
  console.log(`📅 ${group.date} - ${group.count} projeto(s)`);
  group.projects.forEach(project => {
    console.log(`  📁 ${project.name}`);
    console.log(`     🎥 ${project.videoCount} vídeos | 📝 ${project.annotationCount} anotações`);
  });
});
```

---

## 🎯 Casos de Uso

### 1. Dashboard Principal
Exibir todos os projetos agrupados por data com contadores

### 2. Barra de Busca
Filtrar projetos em tempo real conforme o usuário digita

### 3. Estatísticas
Usar o campo `count` para mostrar quantos projetos foram criados em cada dia

### 4. Timeline
Organizar projetos em uma linha do tempo visual usando as datas

---

## ✅ Checklist de Implementação

- [x] Busca por título (case-insensitive)
- [x] Agrupamento por data
- [x] Contagem de projetos por grupo
- [x] Autenticação JWT
- [x] Ordenação por data (desc)
- [x] Query param opcional `search`
- [x] Documentação completa
- [x] Exemplos de uso

---

**🎉 Endpoint completo e pronto para uso!**
