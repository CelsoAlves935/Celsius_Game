# Especificação de Arquitetura: Game Tracker Web

Documento de especificação técnica e arquitetura de software para o desenvolvimento de uma aplicação web de catálogo e rastreamento de jogos pessoais ("Game Tracker"), com leitura pública e gerenciamento (CRUD) privado com login único.

---

## 1. Visão Geral do Projeto

* **Objetivo:** Disponibilizar uma página web pública com o catálogo de jogos que o proprietário está jogando, já jogou ou pretende jogar, permitindo acesso e atualização a partir de qualquer dispositivo.
* **Acesso Público:** Qualquer visitante pode visualizar a lista de jogos, filtrar por status/plataforma e ler avaliações/notas.
* **Acesso Administrativo:** Restrito ao proprietário por meio de login único com autenticação via token JWT, habilitando operações de criação, edição e exclusão (CRUD).
* **Custo Operacional:** R$ 0,00 (100% hospedado em camadas gratuitas).

---

## 2. Diagrama de Arquitetura

```text
[ Visitante (Leitura) ]          [ Proprietário (Admin / CRUD) ]
          │                                     │
          └──────────────────┬──────────────────┘
                             ▼
              ┌─────────────────────────────┐
              │  Frontend SPA (React/Vite)  │  ──> Hospedagem: Vercel / Cloudflare Pages
              └──────────────┬──────────────┘
                             │ Chamadas HTTP REST (JSON)
                             ▼
              ┌─────────────────────────────┐
              │  Backend API (Spring Boot)  │  ──> Hospedagem: Render / Koyeb
              │  - Spring Security + JWT    │
              │  - Spring Data JPA          │
              └──────────────┬──────────────┘
                             │ Conexão JDBC / SSL
                             ▼
              ┌─────────────────────────────┐
              │  PostgreSQL Gerenciado      │  ──> Provedor: Supabase / Neon
              └─────────────────────────────┘
```

---

## 3. Frontend (Web SPA)

* **Tecnologia:** React (com Vite) + JavaScript ou TypeScript.
* **Justificativa:** Aproveita a curva de aprendizado de React Native (gerenciamento de estados com `useState`, `useEffect`, componentes funcionais e consumo via `fetch`/`axios`), substituindo tags nativas por HTML semântico.

### Estrutura de Interface e UX
* **Visão Pública (Catálogo):**
  * Grid responsivo de cards com capa, título, plataforma, status, nota pessoal e horas jogadas.
  * Barra de filtros rápidos por Status (`Jogando`, `Zerado`, `Pausado`, `Na Fila`) e Plataforma (`PC`, `PlayStation`, `Switch`, etc.).
  * Modal ou gaveta de detalhes para leitura da análise/anotações do jogo.
* **Visão Administrativa (Logado):**
  * Modal discreto de Login (usuário e senha).
  * Ao autenticar, o token JWT é persistido (ex.: `localStorage`).
  * Cards ganham ações contextuais: botão de editar e excluir.
  * Exibição de botão flutuante de ação rápida: `+ Adicionar Jogo`.
  * Botão de `Logout` no cabeçalho/menu.

---

## 4. Backend & Regras de Negócio (Spring Boot)

* **Tecnologia:** Java 17 ou 21 + Spring Boot 3.x.
* **Módulos Principais:**
  * `Spring Web`: Criação dos controladores REST.
  * `Spring Data JPA`: Abstração de persistência e repositórios.
  * `Spring Security`: Gestão de rotas e filtros de requisição.
  * `java-jwt` ou `jjwt`: Emissão e validação de tokens JWT.
  * `Validation`: Validação de DTOs (`@NotNull`, `@NotBlank`, `@Min`, `@Max`).

### Estratégia de Usuário Único (Admin)
* Como o sistema é exclusivo para o autor, não há necessidade de tela aberta para criação de contas.
* A conta do administrador deve ser inserida via carga inicial (script SQL/Flyway/Data.sql) com senha criptografada via **BCrypt**.

---

## 5. Modelagem de Dados

### 5.1. Entidade `Game`

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `UUID` / `Long` | Identificador único (chave primária) |
| `title` | `VARCHAR(150)` | Nome do jogo (obrigatório) |
| `platform` | `VARCHAR(50)` | Enum: `PC`, `PLAYSTATION`, `XBOX`, `NINTENDO_SWITCH`, `RETRO`, etc. |
| `status` | `VARCHAR(30)` | Enum: `PLAYING`, `COMPLETED`, `BACKLOG`, `DROPPED`, `PAUSED` |
| `rating` | `NUMERIC(3,1)` | Nota pessoal de 0.0 a 10.0 (opcional) |
| `hours_played` | `INTEGER` | Total de horas registradas |
| `cover_url` | `VARCHAR(500)` | Link externo da imagem da capa |
| `review` | `TEXT` | Texto com considerações, opiniões ou anotações |
| `created_at` | `TIMESTAMP` | Data de cadastro |
| `updated_at` | `TIMESTAMP` | Data da última alteração |

### 5.2. Gestão de Imagens de Capa
* Para não onerar a cota de armazenamento do banco de dados gratuito, não serão armazenados binários (`bytea`/BLOB).
* Apenas URLs serão persistidas (links diretos de imagens, URLs de CDN como Cloudinary/Imgur, ou metadados de APIs públicas de jogos como RAWG).

---

## 6. Contratos de API REST

### Rotas Públicas (Sem necessidade de Token)
* `GET /api/games` — Retorna lista paginada ou completa dos jogos cadastrados.
* `GET /api/games/{id}` — Retorna os detalhes de um jogo específico.
* `POST /api/auth/login` — Recebe credenciais (`username` e `password`), valida hash e retorna token JWT.

### Rotas Privadas (Header: `Authorization: Bearer <token>`)
* `POST /api/games` — Cadastra um novo jogo.
* `PUT /api/games/{id}` — Atualiza os dados de um jogo existente.
* `DELETE /api/games/{id}` — Remove um jogo do catálogo.

---

## 7. Estratégia de Deploy e Hospedagem Gratuita

| Camada | Provedor | Função | Limites & Observações |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** ou **Cloudflare Pages** | Servir os arquivos estáticos compilados do React. | Tráfego ilimitado para projetos pessoais, build contínuo via GitHub, SSL automático. |
| **Backend** | **Render** ou **Koyeb** | Execução da aplicação Spring Boot via Docker ou build nativo. | 512 MB de RAM. Aplicação entra em suspensão (*cold sleep*) após 15 minutos de inatividade no Render. |
| **Banco de Dados** | **Neon** ou **Supabase** | PostgreSQL Serverless gerenciado. | Limite de ~500 MB (suficiente para milhares de registros textuais). |

---

## 8. Recomendações e Boas Práticas para o Free Tier

1. **Ajuste de Memória da JVM:**
   Para garantir estabilidade com 512 MB de RAM, configure a variável de ambiente `JAVA_TOOL_OPTIONS` no provedor de backend:
   ```bash
   -XX:+UseSerialGC -Xss512k -XX:MaxRAMPercentage=75
   ```
2. **Tratamento do Cold Start no Frontend:**
   Como a API gratuita entra em hibernação, o primeiro acesso após inatividade pode levar entre 30 e 50 segundos. O frontend deve apresentar um estado visual de carregamento amigável (ex.: *"Iniciando servidor gratuito, aguarde alguns instantes..."*).
3. **CORS (Cross-Origin Resource Sharing):**
   Configurar o Spring Security para permitir requisições exclusivamente da URL do frontend hospedado na Vercel/Cloudflare.