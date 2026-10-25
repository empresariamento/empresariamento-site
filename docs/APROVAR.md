# Página /aprovar — porteiro do DE (DEC-26)

Página estática em `site/aprovar/` para o DE aprovar ou recusar pacotes Meta Ads do Max, um por vez. O banco (`empia-ace`, migração `202610240002_meta_ads_de_gate.sql`) é quem decide: só a identidade DE aprova, com o SHA-256 recalculado, validade de até 24 horas e uso único.

## Como funciona

- Login só do DE (`empresariamento@gmail.com`) pelo Supabase Auth: link ou código de uso único enviado ao e-mail (`shouldCreateUser: false`). No atalho da tela inicial do celular, usar o código.
- A sessão fica salva no aparelho. Antes de cada decisão a página confere a sessão no servidor (`getUser`); sessão expirada ou inválida volta para o login, sem aprovar nada.
- Lista os pacotes `pendente` e não vencidos. Antes dos botões, mostra o pacote inteiro em português: o que será feito, conta, objeto alterado, se nasce/fica pausada, campanha, orçamento, período, público, criativos e o hash. A página recalcula o hash; se não conferir, não mostra os botões.
- Aprovo/Recusar pedem confirmação e chamam `approve_meta_ads_package`/`reject_meta_ads_package` para aquele pacote. Não existe aprovação em lote.
- Todo o conteúdo é escrito com `textContent`; não há HTML vindo do pacote.

## Código fixo

- `vendor/supabase-js-2.45.4.umd.js`: biblioteca embutida, extraída do pacote npm `@supabase/supabase-js@2.45.4` com integridade do registro conferida; procedência e hashes em `vendor/VENDOR.json`.
- Todos os scripts e o CSS são locais e têm `integrity` (SRI); CSP `script-src 'self'`; nenhum script externo. `npm run check` recalcula e recusa qualquer divergência.

## Instalação (com o DE presente, depois do merge)

1. Banco e Supabase Auth conforme `infra/vps/MAX-META-ADS.md` do `empia-ace` (cadastro público desligado, retorno só em `https://empresariamento.com.br/aprovar/`, usuário DE).
2. Preencher `site/aprovar/config.js` com a URL do projeto e a chave **anon** (pública). Nunca `service_role`. Restringir a CSP `connect-src` à URL exata do projeto. Atualizar as integridades (`npm run check` aponta as divergências) e abrir PR.
3. Publicar pelo workflow manual do site. `npm run check:publication` bloqueia a publicação com a configuração vazia.
4. Testar no celular: login pelo código, pacote de teste, recusa, sessão expirada.
