# 🎥 Video Annotation Platform - Backend

Backend da plataforma de anotações de vídeo construído com **Clean Architecture (Hexagonal)**.

## 🏗️ Arquitetura

```
src/
├── domain/              # Camada de Domínio (Entidades + Interfaces)
│   ├── entities/        # Entidades de negócio
│   └── repositories/    # Interfaces dos repositórios
├── application/         # Camada de Aplicação (Casos de Uso)
│   ├── use-cases/       # Regras de negócio
│   └── factories/       # Factory pattern
├── infrastructure/      # Camada de Infraestrutura
│   ├── database/        # Prisma Client
│   └── repositories/    # Implementações dos repositórios
└── presentation/        # Camada de Apresentação (Controllers + Routes)
    ├── controllers/     # Controllers HTTP
    ├── routes/          # Rotas Express
    └── middlewares/     # Middlewares (Auth, Error handling)
```

## 🚀 Fluxo de Requisição

```
HTTP Request → Route → Controller → Factory → Use Case → Repository → Database
```

## 🛠️ Tecnologias

- **Node.js 20** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de dados

## 📦 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env` já criado e ajuste se necessário:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/video_annotation?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Iniciar Docker (PostgreSQL)

```bash
docker-compose up -d
```

### 4. Rodar migrations

```bash
npx prisma migrate dev --name init
```

### 5. Gerar Prisma Client

```bash
npx prisma generate
```

### 6. Iniciar servidor

```bash
npm run dev
```

Servidor rodando em: `http://localhost:3333`

## 📡 Endpoints

### Health Check

```http
GET /api/health
```

### Autenticação

#### Registro de Usuário

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "ADMIN" // opcional: ADMIN | VIEWER
}
```

**Resposta (201):**

```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "ADMIN",
    "avatar": null,
    "createdAt": "2025-10-31T...",
    "updatedAt": "2025-10-31T..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta (200):**

```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "ADMIN",
    "avatar": null,
    "createdAt": "2025-10-31T...",
    "updatedAt": "2025-10-31T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Projetos (Rotas Protegidas)

Todas as rotas de projetos requerem autenticação. Adicione o header:

```http
Authorization: Bearer {token}
```

#### Criar Projeto

```http
POST /api/projects
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Meu Projeto",
  "description": "Descrição do projeto (opcional)",
  "color": "#FF5733" // opcional - cor da pasta
}
```

**Resposta (201):**

```json
{
  "id": "uuid",
  "name": "Meu Projeto",
  "description": "Descrição do projeto",
  "color": "#FF5733",
  "userId": "uuid",
  "createdAt": "2025-10-31T...",
  "updatedAt": "2025-10-31T..."
}
```

#### Listar Meus Projetos

```http
GET /api/projects?search=Marketing
Authorization: Bearer {token}
```

**Query Params:**
- `search` (opcional) - Busca por nome do projeto (case-insensitive)

**Resposta (200):**

```json
[
  {
    "date": "2025-10-31",
    "count": 2,
    "projects": [
      {
        "id": "uuid",
        "name": "Meu Projeto",
        "description": "Descrição do projeto",
        "color": "#FF5733",
        "userId": "uuid",
        "videoCount": 5,
        "annotationCount": 23,
        "createdAt": "2025-10-31T14:30:00.000Z",
        "updatedAt": "2025-10-31T14:30:00.000Z"
      },
      {
        "id": "uuid-2",
        "name": "Outro Projeto",
        "description": null,
        "color": "#3498DB",
        "userId": "uuid",
        "videoCount": 2,
        "annotationCount": 8,
        "createdAt": "2025-10-31T10:15:00.000Z",
        "updatedAt": "2025-10-31T10:15:00.000Z"
      }
    ]
  },
  {
    "date": "2025-10-30",
    "count": 1,
    "projects": [
      {
        "id": "uuid-3",
        "name": "Projeto Antigo",
        "description": "Projeto criado ontem",
        "color": "#2ECC71",
        "userId": "uuid",
        "videoCount": 0,
        "annotationCount": 0,
        "createdAt": "2025-10-30T18:00:00.000Z",
        "updatedAt": "2025-10-30T18:00:00.000Z"
      }
    ]
  }
]
```

**Estrutura da Resposta:**
- **date** - Data de criação dos projetos (YYYY-MM-DD)
- **count** - Quantidade de projetos nessa data
- **projects** - Array de projetos criados nessa data (ordenados por mais recente)
  - **videoCount** - Quantidade de vídeos no projeto
  - **annotationCount** - Quantidade total de anotações em todos os vídeos do projeto

---

### Vídeos (Rotas Protegidas)

Todas as rotas de vídeos requerem autenticação. Adicione o header:

```http
Authorization: Bearer {token}
```

#### Listar Todos os Vídeos

```http
GET /api/videos
Authorization: Bearer {token}
```

**Resposta (200):**

```json
[
  {
    "id": "uuid",
    "name": "Vídeo Apresentação",
    "url": "https://example.com/video.mp4",
    "filePath": "/uploads/video.mp4",
    "duration": 180.5,
    "thumbnail": "https://example.com/thumb.jpg",
    "projectId": "uuid",
    "project": {
      "id": "uuid",
      "name": "Meu Projeto",
      "color": "#FF5733"
    },
    "annotationCount": 15,
    "uploadedAt": "2025-10-31T...",
    "updatedAt": "2025-10-31T..."
  }
]
```

#### Criar Vídeo

```http
POST /api/videos
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Vídeo Apresentação",
  "url": "https://example.com/video.mp4",  // opcional
  "filePath": "/uploads/video.mp4",        // opcional
  "duration": 180.5,                       // opcional (em segundos)
  "thumbnail": "https://example.com/thumb.jpg", // opcional
  "projectId": "uuid"                      // obrigatório
}
```

**Resposta (201):**

```json
{
  "id": "uuid",
  "name": "Vídeo Apresentação",
  "url": "https://example.com/video.mp4",
  "filePath": "/uploads/video.mp4",
  "duration": 180.5,
  "thumbnail": "https://example.com/thumb.jpg",
  "projectId": "uuid",
  "uploadedAt": "2025-10-31T...",
  "updatedAt": "2025-10-31T..."
}
```

#### Listar Vídeos de um Projeto Específico

```http
GET /api/videos/project/:projectId
Authorization: Bearer {token}
```

**Resposta (200):**

```json
[
  {
    "id": "uuid",
    "name": "Vídeo Apresentação",
    "url": "https://example.com/video.mp4",
    "filePath": "/uploads/video.mp4",
    "duration": 180.5,
    "thumbnail": "https://example.com/thumb.jpg",
    "projectId": "uuid",
    "annotationCount": 15,
    "uploadedAt": "2025-10-31T...",
    "updatedAt": "2025-10-31T..."
  }
]
```

#### Deletar Vídeo

```http
DELETE /api/videos/:videoId
Authorization: Bearer {token}
```

**Resposta (200):**

```json
{
  "message": "Video deleted successfully"
}
```

---

## 🗄️ Banco de Dados

### Prisma Studio

Para visualizar/editar dados no banco:

```bash
npx prisma studio
```

Abre em: `http://localhost:5555`

### Schema

- **User** - Usuários (auth)
- **Project** - Projetos
- **Video** - Vídeos
- **Annotation** - Anotações/Marcações
- **ShareToken** - Tokens de compartilhamento
- **GuestSession** - Sessões de visitantes

## 🐳 Docker

### Subir containers

```bash
docker-compose up -d
```

### Parar containers

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f
```

## 📝 Scripts Disponíveis

- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Iniciar em produção
- `npm run prisma:generate` - Gerar Prisma Client
- `npm run prisma:migrate` - Rodar migrations
- `npm run prisma:studio` - Abrir Prisma Studio

## 🧪 Testando

### Com cURL

**Registro:**

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

## 📚 Próximos Passos

- [x] ✅ Implementar rotas de Projects (GET e POST)
- [x] ✅ Implementar rotas de Videos (GET, POST, DELETE)
- [ ] Implementar rotas de Annotations
- [ ] Implementar rotas de Share Tokens
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração
- [ ] Documentação com Swagger
- [ ] Rate limiting
- [ ] Upload de arquivos (Multer/S3)

## 👨‍💻 Desenvolvido com

- Clean Architecture (Hexagonal)
- SOLID Principles
- Dependency Injection
- Repository Pattern
- Factory Pattern

---

**Status:** ✅ Sistema de autenticação completo e funcional!

