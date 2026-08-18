# 🏖️ Tô Querendo

> Plataforma digital para integração entre comerciantes e consumidores em ambientes praianos.

## 📌 Sobre o projeto

O **Tô Querendo** é uma plataforma digital desenvolvida com o objetivo de aproximar comerciantes e consumidores em ambientes praianos, oferecendo uma experiência simples para descoberta de produtos, realização de pedidos, pagamentos e acompanhamento das entregas.

A proposta busca **digitalizar e profissionalizar o comércio informal de praia**, disponibilizando aos comerciantes ferramentas que normalmente não estão presentes em sua rotina, como controle de vendas, acompanhamento de ganhos, relatórios e divulgação de produtos.

A plataforma foi concebida como um **marketplace responsivo**, permitindo que os consumidores encontrem comerciantes próximos, visualizem seus produtos e realizem pedidos diretamente pela plataforma.

## 🎯 Objetivos

### Objetivo geral

Desenvolver uma plataforma digital capaz de integrar comerciantes e consumidores em ambientes praianos, facilitando a comercialização de produtos e oferecendo ferramentas de gestão para os vendedores.

### Objetivos específicos

- 📍 Facilitar a localização de comerciantes próximos ao consumidor.
- 🛒 Permitir a consulta de produtos e realização de pedidos.
- 💳 Disponibilizar suporte a pagamentos digitais.
- 🛵 Permitir que o próprio comerciante realize a entrega.
- 📊 Auxiliar no controle de vendas, ganhos e desempenho.
- 📈 Disponibilizar relatórios para apoiar a tomada de decisões.
- 📢 Oferecer recursos de divulgação dos produtos e do comércio.
- 📱 Garantir uma experiência responsiva em diferentes dispositivos.
- 🤝 Promover a integração entre consumidores e comerciantes.

## 🧩 Funcionalidades

### 👤 Consumidor

- Cadastro e autenticação.
- Exploração de comerciantes próximos.
- Visualização de produtos.
- Busca e filtragem de produtos.
- Carrinho de compras.
- Criação de pedidos.
- Pagamento digital.
- Acompanhamento do pedido.
- Visualização do histórico de pedidos.
- Avaliação da experiência de compra.

### 🏖️ Comerciante

- Cadastro e gerenciamento do estabelecimento.
- Gerenciamento de produtos.
- Controle de preços e disponibilidade.
- Recebimento e gerenciamento de pedidos.
- Atualização do status dos pedidos.
- Controle de vendas e ganhos.
- Relatórios de desempenho.
- Divulgação de produtos.
- Definição da área de atendimento/entrega.

### ⚙️ Plataforma

- Autenticação e autorização.
- Gerenciamento de usuários.
- Geolocalização.
- Gerenciamento de pedidos.
- Integração com pagamentos.
- Controle de estoque/disponibilidade.
- Sistema de notificações.
- Dashboard administrativo.
- API REST para comunicação entre frontend e backend.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em **frontend + API backend + banco de dados**, mantendo as responsabilidades separadas entre as camadas da aplicação.

```text
┌──────────────────────────────────────────────┐
│                 TÔ QUERENDO                  │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Frontend - React                │
│       TypeScript + Tailwind CSS              │
└──────────────────────────────────────────────┘
                       │
                  HTTP / REST
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Backend - Java                  │
│                Spring Boot                   │
│                                              │
│  Controllers → Services → Repositories      │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                PostgreSQL                    │
│             Banco de dados                  │
└──────────────────────────────────────────────┘
```

## 🛠️ Tecnologias

### Frontend

- **React** — construção da interface.
- **TypeScript** — tipagem estática e maior segurança no desenvolvimento.
- **Tailwind CSS** — estilização e desenvolvimento da interface responsiva.

### Backend

- **Java** — linguagem principal do backend.
- **Spring Boot** — desenvolvimento da API e regras de negócio.
- **Spring Web** — criação dos endpoints REST.
- **Spring Data JPA** — persistência e comunicação com o banco de dados.
- **Spring Security** — autenticação e autorização.

### Banco de dados

- **PostgreSQL** — armazenamento dos dados da aplicação.

## 📁 Estrutura do projeto

Uma possível organização do repositório:

```text
to-querendo/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── .../
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── ...
│
└── README.md
```

> A estrutura pode ser adaptada conforme a evolução do projeto.

## 🔄 Fluxo básico de um pedido

```text
Consumidor
    │
    ▼
Acessa a plataforma
    │
    ▼
Encontra um comerciante
    │
    ▼
Visualiza os produtos
    │
    ▼
Adiciona produtos ao carrinho
    │
    ▼
Realiza o pedido
    │
    ▼
Efetua o pagamento
    │
    ▼
Comerciante recebe o pedido
    │
    ▼
Comerciante prepara o pedido
    │
    ▼
Comerciante realiza a entrega
    │
    ▼
Consumidor recebe o pedido
```

## 🗄️ Principais entidades

A modelagem do banco de dados deverá contemplar entidades relacionadas à operação da plataforma, como:

- **Usuário**
- **Comerciante**
- **Consumidor**
- **Estabelecimento**
- **Produto**
- **Categoria**
- **Pedido**
- **Item do Pedido**
- **Pagamento**
- **Endereço/Localização**
- **Avaliação**
- **Notificação**

A estrutura definitiva das entidades e seus relacionamentos será definida durante a etapa de modelagem do sistema.

## 🔐 Segurança

O backend deverá utilizar mecanismos de segurança para proteger os recursos da aplicação, incluindo:

- Autenticação de usuários.
- Autorização baseada em perfil.
- Senhas armazenadas de forma segura.
- Proteção dos endpoints da API.
- Validação dos dados recebidos.
- Controle de acesso às informações de comerciantes e consumidores.
- Proteção contra operações não autorizadas.

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

- Java JDK instalado.
- Maven instalado ou Maven Wrapper disponível.
- Node.js e npm/pnpm instalados.
- PostgreSQL instalado e em execução.
- Git instalado.

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd to-querendo
```

### 2. Configure o banco de dados

Crie um banco PostgreSQL para o projeto:

```sql
CREATE DATABASE to_querendo;
```

Configure as credenciais do banco no arquivo de configuração do Spring Boot:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/to_querendo
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
```

### 3. Execute o backend

Entre na pasta do backend:

```bash
cd backend
```

Execute:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

A API estará disponível, por padrão, em:

```text
http://localhost:8080
```

### 4. Execute o frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

ou:

```bash
pnpm install
```

Execute o projeto:

```bash
npm run dev
```

ou:

```bash
pnpm dev
```

O frontend será disponibilizado pelo servidor de desenvolvimento do React/Vite.

## 🔌 Comunicação entre frontend e backend

O frontend se comunica com o backend por meio de uma **API REST**.

Exemplo:

```text
React + TypeScript
       │
       │ HTTP
       ▼
Spring Boot REST API
       │
       │ JPA
       ▼
PostgreSQL
```

Exemplo de endpoint:

```http
GET /api/products
```

Resposta:

```json
[
  {
    "id": 1,
    "name": "Água de coco",
    "price": 10.00
  }
]
```

## 🌱 Objetivos de Desenvolvimento Sustentável

O projeto está relacionado principalmente aos seguintes **Objetivos de Desenvolvimento Sustentável (ODS)**:

### ODS 8 — Trabalho Decente e Crescimento Econômico

Busca contribuir para a melhoria das condições de trabalho e para o crescimento econômico dos comerciantes, oferecendo ferramentas digitais para organização, gestão e comercialização.

### ODS 9 — Indústria, Inovação e Infraestrutura

Relaciona-se ao desenvolvimento de uma solução tecnológica voltada à inovação e à digitalização de uma atividade comercial tradicional.

### ODS 17 — Parcerias e Meios de Implementação

A plataforma busca criar uma rede de interação entre comerciantes, consumidores e outros possíveis parceiros, fortalecendo relações e oportunidades dentro do ecossistema local.

## 🎨 Identidade

O **Tô Querendo** possui uma identidade visual informal e praiana, buscando transmitir:

- 🌊 Movimento e fluidez.
- ☀️ Clima de praia.
- 🟡 Energia e descontração.
- 🔵 Conexão com o mar.
- 🏄‍♂️ Proximidade com o público.
- 🛍️ Facilidade e praticidade.

A identidade utiliza principalmente tons de **amarelo/laranja e azul**, com elementos inspirados em ondas e no ambiente praiano.

## 📚 Contexto acadêmico

O projeto é desenvolvido como parte do **Trabalho de Conclusão de Curso (TCC)** em Engenharia da Computação, tendo como foco a aplicação de conhecimentos de engenharia de software, desenvolvimento web, banco de dados, APIs, arquitetura de sistemas e experiência do usuário na resolução de um problema do mundo real.

## 🗺️ Roadmap

- [ ] Levantamento e validação de requisitos
- [ ] Pesquisa de campo com comerciantes
- [ ] Definição da arquitetura
- [ ] Modelagem do banco de dados
- [ ] Definição da identidade visual
- [ ] Prototipação das interfaces
- [ ] Desenvolvimento da API
- [ ] Desenvolvimento do frontend
- [ ] Implementação da autenticação
- [ ] Implementação do marketplace
- [ ] Implementação de pedidos
- [ ] Implementação de pagamentos
- [ ] Implementação da geolocalização
- [ ] Dashboard do comerciante
- [ ] Relatórios
- [ ] Testes
- [ ] Estudo de campo
- [ ] Correções e melhorias
- [ ] Deploy
- [ ] Documentação final

## 👨‍💻 Desenvolvimento

Projeto acadêmico desenvolvido por **Caio Ventura**.

---

> **Tô Querendo** — conectando quem quer vender com quem tá querendo comprar. 🏖️


----------------------------------------------------------------------------------------------------------------------------

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
