# Orkut Clone

Uma recriação fiel do Orkut, a rede social que marcou a internet brasileira. Este é o **frontend** do projeto, construído com Next.js 16 e React 19, replicando a interface clássica com fontes pixeladas, layout de 3 colunas e a paleta azul icônica.

O backend (API REST) está disponível em [api-orkut-clone](https://github.com/ofelipegoulart/api-orkut-clone).

## Tech Stack

### Frontend (este repositório)

- **Next.js 16** com App Router e React 19
- **TypeScript** com strict mode
- **Tailwind CSS v4** + CSS customizado (tema Orkut)
- **NextAuth v4** (autenticação JWT via Credentials Provider)

### Backend ([api-orkut-clone](https://github.com/ofelipegoulart/api-orkut-clone))

- **Java 21** com **Spring Boot 3.4**
- **Spring Security** + JWT (JJWT)
- **PostgreSQL** + Spring Data JPA
- **Swagger/OpenAPI** (springdoc)

## Funcionalidades

- Login e cadastro com autenticação JWT
- Fluxo de onboarding (perfil inicial após registro)
- Visualização de perfil com indicadores de Confiável, Legal e Sexy
- Edição de perfil com 5 abas (Geral, Social, Contato, Profissional, Pessoal)
- Níveis de privacidade por campo (Só eu, Amigos, Amigos de amigos, Todos)
- Upload de avatar
- Lista de amigos e comunidades
- Recados (scraps)
- Sorte do dia

## Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** (para o backend)
- **Java 21** e **Maven** (para o backend)

## Configuração

### 1. Backend (API)

```bash
git clone https://github.com/ofelipegoulart/api-orkut-clone.git
cd api-orkut-clone
```

Crie as variáveis de ambiente ou use os valores padrão:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_USERNAME` | Usuário do PostgreSQL | `postgres` |
| `DB_PASSWORD` | Senha do PostgreSQL | `postgres` |
| `JWT_SECRET` | Chave secreta para tokens JWT | *(obrigatório)* |

O banco `orkut_clone` precisa existir no PostgreSQL. O schema é gerado automaticamente (ddl-auto: update).

```bash
mvn spring-boot:run
```

A API roda em `http://localhost:8080`. A documentação Swagger fica disponível em `http://localhost:8080/swagger-ui.html`.

### 2. Frontend (este repositório)

```bash
git clone https://github.com/ofelipegoulart/orkut-clone.git
cd orkut-clone
npm install
```

Crie um arquivo `.env.local` na raiz:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui
API_URL=http://localhost:8080
```

| Variável | Descrição |
|----------|-----------|
| `NEXTAUTH_URL` | URL onde o frontend roda |
| `NEXTAUTH_SECRET` | Chave para assinar sessões (troque em produção) |
| `API_URL` | URL base da API backend |

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/          # Rotas de autenticação (login, cadastro, onboarding)
│   ├── (main)/          # Rotas protegidas (perfil, amigos, recados, etc.)
│   └── api/             # Route handlers (proxy para o backend)
├── proxy.ts             # Middleware de redirecionamento de auth
└── types/               # Tipos customizados (NextAuth)

components/
├── Header/              # Barra de navegação superior
├── LeftSideBar/         # Sidebar com avatar e menu
├── ProfilePage/         # Exibição de perfil
├── EditProfile/         # Editor de perfil (multi-abas)
├── Social/              # Widgets de amigos e comunidades
└── Providers/           # Context providers (Session)

data/                    # Dados mock e constantes de formulários
lib/                     # Configuração do NextAuth
utils/                   # Componentes de indicadores (Cool, Sexy, Confiável)
public/fonts/            # Fontes retrô (W95FA, Tahoma 8px)
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Roda o build de produção |
| `npm run lint` | Executa o ESLint |

## Licença

Este projeto é um clone não-oficial feito para fins educacionais. Orkut foi uma rede social do Google encerrada em 2014.
