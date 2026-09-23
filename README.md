# Vitrine Local

Aplicação em Next.js para pequenos negócios criarem uma página pública personalizada. Inclui autenticação, painel, upload de imagens, página por endereço único e assinatura mensal via Mercado Pago.

## O que já está implementado

- cadastro, login, confirmação de e-mail e recuperação de senha pelo Supabase;
- painel privado para uma empresa por usuário, com prévia em tempo real;
- nome, categoria, descrição, logo, seis fotos, cor, localização e contatos;
- validação no navegador, no servidor e no banco; slugs únicos e rotas reservadas;
- publicação condicionada a uma assinatura ativa e dentro da validade;
- página pública responsiva com telefone, Instagram e link direto do WhatsApp;
- checkout de assinatura recorrente e webhook autenticado e idempotente;
- retirada automática da página quando a assinatura é cancelada ou suspensa;
- RLS para isolamento dos usuários e pasta de imagens vinculada ao UID.

## Rodar localmente

Requisitos: Node.js 20 ou superior, npm e um projeto Supabase.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Acesse `http://localhost:3000`. Os comandos de qualidade são:

```bash
npm test
npm run lint
npm run build
```

## 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor**, copie todo o arquivo `supabase/migrations/202609230001_initial.sql` e execute uma vez. Ele cria tabelas, índices, bucket, limites e políticas RLS.
3. Em **Project Settings > API**, copie a URL, a chave `anon` e a chave `service_role` para `.env.local`. A `service_role` é segredo e nunca pode usar o prefixo `NEXT_PUBLIC_`.
4. Em **Authentication > URL Configuration**, defina `Site URL` como `http://localhost:3000` no desenvolvimento e adicione `http://localhost:3000/auth/callback` aos Redirect URLs. Depois adicione também `https://SEU-DOMINIO/auth/callback`.
5. Em **Authentication > Providers > Email**, mantenha e-mail/senha habilitado. Configure SMTP próprio antes da produção para entrega confiável.

O bucket é público somente para leitura das imagens. Upload, alteração e exclusão exigem usuário autenticado e só são permitidos na pasta cujo nome começa pelo UID dele. Os dados empresariais publicados só são liberados anonimamente quando existe uma assinatura ativa ainda válida.

## 2. Configurar o Mercado Pago

1. Crie uma aplicação em **Mercado Pago Developers > Suas integrações** e obtenha o **Access Token de produção**. Grave-o em `MERCADO_PAGO_ACCESS_TOKEN` somente no servidor.
2. Crie um plano mensal do tipo `preapproval_plan` pela API do Mercado Pago e copie seu `id` para `MERCADO_PAGO_PLAN_ID`. Defina valor, moeda BRL e frequência mensal no plano.
3. Na aplicação do Mercado Pago, abra **Webhooks**, cadastre o evento de **Assinaturas/Preapproval** e use a URL `https://SEU-DOMINIO/api/webhooks/mercado-pago`.
4. Copie a assinatura secreta exibida nessa configuração para `MERCADO_PAGO_WEBHOOK_SECRET`.
5. Use credenciais de teste apenas no ambiente Preview/local e faça uma assinatura de teste. Confirme no Supabase se `subscriptions.status` passou a `active`.

O retorno do checkout leva apenas ao painel: ele **não ativa** a página. O webhook valida `x-signature`, registra o evento uma única vez, consulta a assinatura diretamente na API do Mercado Pago e só então atualiza o banco. Notificações repetidas são ignoradas; cancelamento e suspensão retiram a página do ar.

## 3. Publicar na Vercel

1. Envie este repositório ao GitHub/GitLab/Bitbucket e importe-o em [vercel.com/new](https://vercel.com/new).
2. Em **Settings > Environment Variables**, cadastre todas as variáveis de `.env.example`, usando os valores de produção. Use `NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO`.
3. Faça o deploy. Em **Settings > Domains**, adicione o domínio e crie no provedor de DNS os registros que a Vercel indicar.
4. Atualize no Supabase a Site URL e os Redirect URLs com o domínio definitivo.
5. Cadastre/atualize no Mercado Pago a URL de webhook com o domínio definitivo e coloque na Vercel o segredo correspondente.
6. Faça um cadastro real, confirme o e-mail, preencha a página, assine e valide o status no painel antes de divulgar.

## Variáveis de ambiente

| Variável | Visibilidade | Finalidade |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | navegador | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | navegador | chave pública protegida por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor | processamento confiável do webhook |
| `NEXT_PUBLIC_SITE_URL` | navegador/servidor | retornos e links absolutos |
| `MERCADO_PAGO_ACCESS_TOKEN` | servidor | chamadas autenticadas ao Mercado Pago |
| `MERCADO_PAGO_PLAN_ID` | servidor | plano recorrente mensal |
| `MERCADO_PAGO_WEBHOOK_SECRET` | servidor | validação das notificações |

## Estrutura

- `app/`: páginas e rotas de servidor (App Router);
- `components/`: formulário, autenticação e modelo visual reutilizável;
- `lib/`: validação, tipos e clientes Supabase;
- `supabase/migrations/`: banco, storage e segurança versionados.

## Limitações conscientes da primeira versão

Há um modelo visual e uma página empresarial por conta. A gestão feita pelo botão do painel abre a central de assinaturas do Mercado Pago. Um produto posterior pode incluir múltiplos modelos, domínio próprio por cliente, exclusão de imagens antigas e um portal de cobrança interno mais detalhado.
