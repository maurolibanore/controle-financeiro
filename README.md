# Prospera — Controle Financeiro Pessoal e Compartilhado

Aplicação web full-stack de controle financeiro pessoal e compartilhado. Permite ao usuário cadastrar receitas e despesas, organizar por categorias, visualizar resumos financeiros, gerenciar múltiplas carteiras, compartilhar carteiras com outros usuários definindo papéis de acesso, exportar relatórios em PDF e receber análises financeiras geradas por inteligência artificial.

## Links de produção

- **Frontend:** https://prospera-frontend-plum.vercel.app
- **Backend:** https://prospera-backend-vtca.onrender.com
- **Swagger (documentação da API):** https://prospera-backend-vtca.onrender.com/swagger-ui.html

> Observação: o backend está hospedado no plano gratuito do Render, que suspende o serviço após inatividade. A primeira requisição pode levar cerca de 50 segundos para subir o servidor.

## Tecnologias

**Backend:**
- Java 17
- Spring Boot 4.0
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8.4 (Aiven em produção, XAMPP em desenvolvimento)
- BCrypt (criptografia de senha)
- Spring Mail + Thymeleaf (templates de email)
- SpringDoc OpenAPI (Swagger)
- Bucket4j (rate limiting)
- iText 8 (geração de PDF)
- WebFlux (cliente HTTP para APIs externas)
- Lombok
- Bean Validation
- Docker (deploy)

**Frontend:**
- React 19 + Vite
- React Router DOM
- PrimeReact + PrimeIcons
- PrimeFlex
- Recharts (gráficos)
- Axios
- Context API
- Service Worker (PWA)

**Integrações externas:**
- Brevo (envio transacional de email via API HTTP)
- Google Gemini (análise financeira com IA)

**Infraestrutura:**
- Vercel (hospedagem do frontend)
- Render (hospedagem do backend via Docker)
- Aiven (banco MySQL gerenciado com SSL)

## Estrutura do projeto

```
prospera/
├── backend/        Aplicação Spring Boot
└── frontend/       Aplicação React
```

## Como executar localmente

### Pré-requisitos

- Java 17+
- Node.js 18+
- MySQL rodando (XAMPP ou instalação nativa)

### 1. Configurar banco de dados

Crie um banco chamado `prospera_dev` no MySQL. As tabelas são criadas automaticamente pelo Hibernate.

### 2. Configurar variáveis do backend

Crie o arquivo `backend/src/main/resources/application-secrets.properties` com base no `.example` presente no repositório:

```properties
spring.datasource.password=
spring.mail.password=SUA_SENHA_DE_APP_DO_GMAIL
jwt.secret=prospera-app-2026-chave-secreta-jwt-super-segura
jwt.expiration=86400000
brevo.api.key=SUA_CHAVE_DO_BREVO
gemini.api.key=SUA_CHAVE_DO_GEMINI
```

Esse arquivo fica fora do git. Para desenvolvimento local, as chaves externas (Brevo e Gemini) são opcionais: a aplicação funciona sem elas, apenas as features de email transacional e análise com IA ficam desabilitadas.

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
- Cadastro de usuário com criação automática de carteira "Pessoal"
- Login com JWT (token expira em 24h)
- **Autenticação em duas etapas (2FA)** com código de 6 dígitos enviado por email
- Recuperação de senha por email com token único de 1 hora
- Redefinição de senha via token
- Alteração de senha pelo usuário logado
- Rotas protegidas por autenticação

### Gestão financeira
- Dashboard com saldo, receitas, despesas e gráfico de categorias
- CRUD completo de transações (receitas e despesas)
- Filtros por tipo, categoria e data com paginação
- CRUD completo de categorias com cor personalizada
- CRUD completo de carteiras
- Seleção de carteira ativa com persistência

### Compartilhamento
- Adicionar membros à carteira por email
- Três papéis: DONO, EDITOR, VISUALIZADOR
- DONO gerencia tudo (transações, membros, edita/exclui carteira)
- EDITOR cria/edita/exclui transações
- VISUALIZADOR apenas visualiza
- Alterar papel de membros
- Remover membros

### Tempo real (SSE)
- Atualizações automáticas no dashboard quando outro membro da carteira cadastra, edita ou exclui uma transação
- Conexão Server-Sent Events autenticada por token na query string

### Relatórios em PDF
- Exportação de relatório financeiro completo em PDF a partir da página de Transações
- Respeita filtros ativos
- Inclui cabeçalho com identidade visual, dados do usuário e carteira, resumo financeiro, tabela de transações e resumo por categoria

### Análise com inteligência artificial
- Botão "Analisar meu mês" no Dashboard
- Modal para seleção de mês e ano
- Envia os dados do período para a API do Google Gemini e retorna uma análise personalizada
- Integração via API HTTP

### Perfil
- Visualizar e editar dados pessoais
- Alterar senha

## Segurança

- Senhas nunca armazenadas em texto puro (BCrypt)
- JWT assinado com chave secreta e expiração configurável
- Autenticação em duas etapas por email
- Autorização granular por papel nas carteiras compartilhadas
- Rate limiting em `/autenticacao/login` (5 tentativas por minuto, retorna 429)
- Headers de segurança OWASP (X-Content-Type-Options, X-Frame-Options, Cache-Control)
- Mensagem neutra na recuperação de senha (não revela se o email existe)
- Validações no backend com Bean Validation
- Filtro global de exceções com respostas padronizadas
- Tratamento silencioso de JWT expirado para evitar quebra de rotas públicas

## PWA (Progressive Web App)

- Manifest configurado
- Service Worker com estratégia cache-first para assets estáticos
- Instalável no desktop e mobile
- Rotas de API e eventos em tempo real são excluídas do cache

## Endpoints principais

Documentação completa e interativa disponível no Swagger. Principais rotas:

**Autenticação:**
- `POST /autenticacao/login` — login (retorna aviso de 2FA quando ativo)
- `POST /autenticacao/verificar-codigo` — valida código 2FA e retorna JWT
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

**Eventos em tempo real:**
- `GET /eventos/{carteiraId}?token=...` — stream SSE de atualizações da carteira

**Relatórios e IA:**
- `GET /carteira/{id}/relatorio/transacoes/pdf` — exporta PDF do período filtrado
- `GET /carteira/{id}/insights?mes=X&ano=Y` — análise financeira com IA do mês



## Autor

Mauro Libanore — IFPR 2026