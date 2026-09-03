# Prospera — Controle Financeiro Pessoal e Compartilhado

Aplicação web full-stack de controle financeiro pessoal e compartilhado. Permite ao usuário cadastrar receitas e despesas, organizar por categorias, visualizar resumos financeiros, gerenciar múltiplas carteiras e compartilhar carteiras com outros usuários definindo papéis de acesso.

## Tecnologias

**Backend:**
- Java 17
- Spring Boot 4.0
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL
- BCrypt (criptografia de senha)
- Spring Mail + Thymeleaf (emails)
- Lombok
- Bean Validation

**Frontend:**
- React 19 + Vite
- React Router DOM
- PrimeReact + PrimeIcons
- Recharts (gráficos)
- Axios
- Context API

## Estrutura do projeto

prospera/
├── backend/ Aplicação Spring Boot
└── frontend/ Aplicação React


## Como executar

### Pré-requisitos

- Java 17+
- Node.js 18+
- MySQL rodando (via XAMPP ou instalação nativa)

### 1. Configurar banco de dados

Crie um banco chamado `prospera` no MySQL. As tabelas são criadas automaticamente pelo Hibernate.

### 2. Configurar variáveis do backend

Crie o arquivo `backend/src/main/resources/application-secrets.properties`:

```properties
spring.datasource.password=
spring.mail.password=SUA_SENHA_DE_APP_DO_GMAIL
jwt.secret=prospera-app-2026-mauro-chave-secreta-jwt-super-segura
jwt.expiration=86400000
```

### 3. Rodar o backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend disponível em `http://localhost:8080`.

### 4. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`.

## Funcionalidades

### Autenticação
- Cadastro de usuário (com criação automática de carteira "Pessoal")
- Login com JWT (token expira em 24h)
- Recuperação de senha por email
- Redefinição de senha via token
- Alteração de senha (usuário logado)
- Rotas protegidas por autenticação

### Gestão financeira
- Dashboard com saldo, receitas, despesas e gráfico por categoria
- CRUD completo de transações (receitas e despesas)
- Filtros por tipo e paginação
- CRUD completo de categorias com cor personalizada
- CRUD completo de carteiras
- Seleção de carteira ativa

### Compartilhamento
- Adicionar membros à carteira por email
- 3 papéis: DONO, EDITOR, VISUALIZADOR
- DONO gerencia tudo (transações, membros, edita/exclui carteira)
- EDITOR cria/edita/exclui transações
- VISUALIZADOR só visualiza
- Alterar papel de membros
- Remover membros

### Perfil
- Visualizar e editar dados pessoais
- Alterar senha

## Segurança

- Senhas nunca armazenadas em texto puro (BCrypt)
- JWT assinado com chave secreta
- Rotas protegidas por autenticação em todas as camadas
- Autorização por papel nas carteiras compartilhadas
- Validações no backend (Bean Validation)
- Mensagem neutra na recuperação de senha (não revela se o email existe)
- Filtro global de exceções com respostas padronizadas

## Endpoints principais

**Autenticação:**
- `POST /autenticacao/login` — login
- `POST /autenticacao/esqueci-senha` — solicitar recuperação
- `POST /autenticacao/redefinir-senha` — redefinir com token

**Usuário:**
- `POST /usuario` — cadastro
- `GET /usuario/me` — dados do usuário logado
- `PUT /usuario/me` — atualizar nome
- `PUT /usuario/me/senha` — alterar senha

**Categoria:**
- `GET /categoria` — listar
- `POST /categoria` — criar
- `PUT /categoria/{id}` — editar
- `DELETE /categoria/{id}` — excluir

**Carteira:**
- `GET /carteira` — listar minhas carteiras
- `POST /carteira` — criar
- `PUT /carteira/{id}` — editar (só DONO)
- `DELETE /carteira/{id}` — excluir (só DONO)

**Membros da carteira:**
- `GET /carteira/{id}/membros` — listar
- `POST /carteira/{id}/membros` — adicionar (só DONO)
- `PATCH /carteira/{id}/membros/{usuarioId}` — alterar papel (só DONO)
- `DELETE /carteira/{id}/membros/{usuarioId}` — remover (só DONO)

**Transações:**
- `GET /carteira/{id}/transacao` — listar com filtros e paginação
- `POST /carteira/{id}/transacao` — criar (DONO ou EDITOR)
- `PUT /carteira/{id}/transacao/{tid}` — editar (DONO ou EDITOR)
- `DELETE /carteira/{id}/transacao/{tid}` — excluir (DONO ou EDITOR)
- `GET /carteira/{id}/transacao/resumo` — resumo financeiro

## Decisões de projeto

**Identidade visual:** paleta verde e branco em layout corporativo. Telas de autenticação com branding à esquerda e formulário à direita.

**Arquitetura em camadas:** Controller → Service → Repository. Comunicação via DTOs para não expor entidades diretamente.

**Autorização granular:** carteira compartilhada com papéis definidos por enum. Validações no service garantem que apenas quem tem permissão pode executar cada ação.

**Persistência de sessão:** usuário logado salvo no localStorage. Ao recarregar a página, o AuthContext restaura o estado automaticamente.

**Carteira ativa:** o CarteiraContext guarda qual carteira o usuário está usando no momento. Ao trocar, o dashboard e transações atualizam automaticamente. Ao fazer logout, é resetada.

**Carteira padrão automática:** ao cadastrar, o usuário já recebe uma carteira "Pessoal" para começar a usar sem configuração extra.

**Recuperação de senha por token:** token único com validade de 1 hora, marcado como utilizado após uso para evitar reutilização.

## Autor

Mauro Libanore — IFPR 2026