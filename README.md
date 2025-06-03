# Barber App 💈✂️

Bem-vindo ao Barber App! Uma aplicação web moderna para agendamento de serviços em barbearias, construída com as tecnologias mais recentes para uma experiência de usuário fluida e eficiente.

## 🚀 Sobre o Projeto

O Barber App permite que usuários encontrem barbearias, visualizem os serviços oferecidos e agendem horários de forma conveniente. Para as barbearias, oferece uma plataforma para gerenciar seus agendamentos e serviços.

## ✨ Funcionalidades Principais

* **Autenticação de Usuários**: Login seguro com provedores OAuth (ex: Google) usando NextAuth.
* **Listagem de Barbearias**: Navegue e descubra barbearias próximas ou preferidas.
* **Visualização de Serviços**: Detalhes sobre serviços oferecidos, incluindo nome, descrição e preço.
* **Sistema de Agendamento**:
    * Seleção de data e horário em um calendário interativo.
    * Verificação de horários disponíveis em tempo real.
    * Confirmação de agendamento.
* **Gerenciamento de Agendamentos**: Usuários podem visualizar e cancelar seus agendamentos. (Implementado com `deleteBooking`)
* **Design Responsivo**: Interface amigável para desktops e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

* **Frontend**:
    * [Next.js](https://nextjs.org/) (v14.x - App Router)
    * [React](https://reactjs.org/) (v18)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/) para estilização.
    * [shadcn/ui](https://ui.shadcn.com/) para componentes de UI (construído sobre Radix UI).
    * [Lucide React](https://lucide.dev/) para ícones.
    * [date-fns](https://date-fns.org/) para manipulação de datas.
    * [Sonner](https://sonner.emilkowal.ski/) para notificações (toasts).
    * [React Hook Form](https://react-hook-form.com/) para gerenciamento de formulários.
    * [Zod](https://zod.dev/) para validação de esquemas.
    * Fontes: Geist Sans e Geist Mono.
* **Backend**:
    * [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) (ou Server Actions)
    * [Prisma](https://www.prisma.io/) como ORM.
    * [PostgreSQL](https://www.postgresql.org/) como banco de dados.
* **Autenticação**:
    * [NextAuth.js](https://next-auth.js.org/) (v4.x) com `@auth/prisma-adapter`.
* **Ferramentas de Desenvolvimento**:
    * ESLint e Prettier para linting e formatação de código.
    * Husky e lint-staged para ganchos de Git.
    * `ts-node` para executar scripts TypeScript (como o seed do Prisma).

## 🏁 Começando (Rodando Localmente)

Siga estas instruções para ter uma cópia do projeto rodando na sua máquina local para desenvolvimento e testes.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão LTS recomendada, ex: 20.x ou 22.x - use o `nvm` para gerenciar versões).
* [npm](https://www.npmjs.com/) (geralmente vem com o Node.js).
* Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando.
* Credenciais OAuth do Google (Client ID e Client Secret) configuradas no [Google Cloud Console](https://console.cloud.google.com/).

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/maia2a/barber-app.git](https://github.com/maia2a/barber-app.git)
    cd barber-app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Copie o conteúdo de um arquivo `.env.example` (se existir) ou adicione as seguintes variáveis, substituindo pelos seus valores:

      ```env
      DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:SUA_PORTA/NOME_DO_BANCO"

      GOOGLE_CLIENT_ID="SEU_GOOGLE_CLIENT_ID"
      GOOGLE_CLIENT_SECRET="SEU_GOOGLE_CLIENT_SECRET"

      NEXTAUTH_URL="http://localhost:3000" # Para desenvolvimento local
      NEXTAUTH_SECRET="GERAR_UM_SECRET_FORTE_AQUI" # Gere um com: openssl rand -base64 32
      ```
    * **Importante**: Para `NEXTAUTH_URL`, em produção, use a URL do seu site na Vercel. Para `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`, certifique-se de que os URIs de redirecionamento autorizados no Google Cloud Console incluem `http://localhost:3000/api/auth/callback/google` para desenvolvimento.

4.  **Execute as Migrações do Prisma:**
    Isso criará as tabelas no seu banco de dados com base no seu `schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **Gere o Prisma Client:**
    (O `migrate dev` geralmente já faz isso, mas para garantir ou após alterações no schema):
    ```bash
    npx prisma generate
    ```

6.  **(Opcional) Execute o Script de Seed (Popular o Banco):**
    Seu `package.json` tem um script de seed. Para populá-lo com dados iniciais:
    ```bash
    npm run prisma:seed
    # Ou diretamente: npx ts-node prisma/seed.ts
    ```
    (Certifique-se que `ts-node` está instalado globalmente ou como devDependency e que o caminho do script está correto no `package.json` na seção `prisma.seed`).

7.  **Rode o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 🚀 Deploy

A aplicação está configurada para deploy na [Vercel](https://vercel.com/). Lembre-se de:
* Configurar as mesmas variáveis de ambiente no painel do seu projeto na Vercel.
* Garantir que o script de build no `package.json` inclua `prisma generate` antes do `next build`:
    ```json
    "scripts": {
      "build": "prisma generate && next build"
    }
    ```

## 🤝 Contribuindo

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request
