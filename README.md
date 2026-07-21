# Fluxo — gestão de demandas em formato de calendário

SaaS de gestão de tarefas por empresa, organizado em formato de **calendário** (não Kanban):
cada empresa tem seus próprios meses lado a lado, e cada dia mostra as tarefas daquela
data com status "em andamento", "em atraso" (calculado automaticamente pela data) e
"concluída".

## Stack

- Next.js 14 (App Router) + TypeScript
- MUI (Material UI) com tema centralizado
- NextAuth (Credentials) para login/cadastro
- Prisma + Postgres (gratuito via Neon ou Supabase — veja o guia de deploy abaixo)

## Funcionalidades do MVP

1. **Login e cadastro** (`/login`, `/signup`) com conta de demonstração pré-preenchida.
2. **Calendário por empresa**: abas no topo alternam entre empresas (ex: Empresa X, Empresa Y),
   cada uma exibindo o mês atual + próximos meses lado a lado (botão "mostrar mais meses").
3. **Painel do dia**: clicar em qualquer dia abre um painel lateral com as tarefas daquela
   data, permitindo criar novas tarefas, mudar o status (clicando no chip) e excluir.
4. **Resumo de status**: cards com contagem de tarefas em andamento, em atraso, concluídas
   e a fazer — atualizados em tempo real conforme você mexe nas tarefas.

O status "em atraso" é **calculado automaticamente**: qualquer tarefa cuja data já passou
e que não esteja marcada como concluída aparece como atrasada, sem precisar de nenhuma
ação manual.

## Como rodar localmente

1. Crie um banco Postgres gratuito em [neon.com](https://neon.com) (leva ~2 minutos, não
   pede cartão) e copie a "connection string".
2. Rode:

```bash
npm install
cp .env.example .env
# cole a connection string do Neon na variável DATABASE_URL do .env
npm run db:push     # cria as tabelas no banco a partir do schema
npm run db:seed      # popula com usuário e tarefas de demonstração
npm run dev
```

Acesse `http://localhost:3000` — você será redirecionado para `/login`.

**Login de demonstração** (criado pelo seed):
- E-mail: `demo@fluxo.app`
- Senha: `demo1234`

## Como colocar no ar de graça (Vercel + Neon)

Essa combinação hospeda o site e o banco de dados sem custo, enquanto o uso for
pessoal/baixo tráfego (a Vercel Hobby é gratuita para uso não comercial).

**1. Banco de dados (Neon — gratuito, sem cartão)**
   - Crie uma conta em [neon.com](https://neon.com) e um novo projeto.
   - Copie a "connection string" (algo como
     `postgresql://usuario:senha@host.neon.tech/nomedobanco?sslmode=require`).

**2. Suba o código para o GitHub**
   - Crie um repositório novo (pode ser privado) e envie os arquivos deste projeto para lá.

**3. Deploy na Vercel (gratuito — plano Hobby)**
   - Crie uma conta em [vercel.com](https://vercel.com) com o GitHub.
   - Clique em "Add New Project" e selecione o repositório.
   - Em "Environment Variables", adicione:
     - `DATABASE_URL` → a connection string do Neon
     - `NEXTAUTH_SECRET` → um valor aleatório (gere com `openssl rand -base64 32`)
     - `NEXTAUTH_URL` → a URL que a Vercel vai te dar (ex: `https://seu-projeto.vercel.app`;
       dá pra ajustar essa variável depois do primeiro deploy, quando a URL final existir)
   - Clique em "Deploy".

**4. Crie as tabelas no banco de produção**
   - Ainda na sua máquina, com o `.env` local apontando para a MESMA connection string do
     Neon usada na Vercel, rode `npm run db:push` (e `npm run db:seed` se quiser os dados
     de demonstração). Isso cria as tabelas no banco que o site publicado vai usar.

Pronto — o link da Vercel já estará no ar, funcionando com login, calendário e banco de
dados reais.

> **Sobre o plano gratuito da Vercel:** é destinado a uso pessoal/não comercial. Se este
> projeto virar um produto vendido para clientes, o certo é migrar para o plano Pro
> (a partir de US$ 20/mês) — mas para colocar no ar, testar e usar você mesmo, o Hobby
> gratuito é suficiente.

## Alternativa: deploy no Netlify (permite uso comercial no plano grátis)

O Netlify também hospeda Next.js de graça (App Router, rotas de API e NextAuth funcionam
normalmente) e, ao contrário do plano Hobby da Vercel, o plano grátis do Netlify permite
uso comercial — vale considerar se este projeto virar um produto real.

1. Crie o banco no Neon (mesmo passo 1 do guia acima).
2. Suba o código para o GitHub.
3. Em [netlify.com](https://netlify.com), "Add new site" → "Import an existing project" →
   selecione o repositório (o Netlify detecta o Next.js e configura o build sozinho).
4. Em "Site settings → Environment variables", adicione `DATABASE_URL`, `NEXTAUTH_SECRET`
   e `NEXTAUTH_URL` (com a URL `https://seu-site.netlify.app` gerada pelo Netlify).
5. Deploy. Depois, rode `npm run db:push` localmente apontando para a mesma `DATABASE_URL`
   para criar as tabelas no banco de produção.

Atenção: rotas de API no Netlify rodam como funções serverless com limite de 10s de
execução no plano grátis — as rotas deste projeto (consultas simples ao banco) ficam bem
dentro desse limite.

## Próximos passos sugeridos

- Adicionar cobrança (Stripe) quando fizer sentido para o modelo de negócio — não incluído
  neste MVP por padrão.
- Domínio próprio: a Vercel permite conectar um domínio personalizado gratuitamente no
  plano Hobby (você paga só pelo registro do domínio em si, em um serviço como Registro.br
  ou Namecheap).
