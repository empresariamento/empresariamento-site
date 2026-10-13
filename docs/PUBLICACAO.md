# Publicação futura — Renan aplica o DNS

**Nada está publicado.** Estas são instruções para executar depois da revisão e autorização. Não há acesso autorizado ao Registro.br; Renan faz as alterações.

## 1. Aprovar e preparar GitHub Pages

1. Revisar as duas páginas e autorizar explicitamente a publicação. Registrar a referência dessa autorização em `publication.json` e só então definir `approvedByRenan: true`.
2. O repositório é `empresariamento/empia-site`, privado. Se o plano não oferecer Pages em repositório privado, decidir entre um plano compatível ou tornar **somente este site** público; não mudar sem autorização. O site publicado por Pages será acessível publicamente mesmo que o código permaneça privado.
3. Na **conta empresariamento**, Settings → Pages → Add a domain, adicionar `empia.com.br` para verificar domínio. Esse passo é da conta, não das configurações do repositório. GitHub mostrará um TXT com um código próprio. Renan cria esse TXT no Registro.br e clica Verify no GitHub. Mantenha o TXT depois da confirmação.
4. Em `empia-site` → Settings → Pages, selecionar GitHub Actions como fonte. Definir Custom domain = `empia.com.br` e salvar **antes** de apontar os A/CNAME no Registro.br. Essa ordem ajuda a impedir que terceiros reivindiquem o domínio. `site/CNAME` não substitui a configuração: workflows Actions ignoram o arquivo para definir o domínio.
5. Só depois aplicar os registros abaixo. Quando propagarem, executar manualmente Actions → “Publicar Pages (manual, após aprovação)” → Run workflow na branch main. Não há publicação em push/PR. O workflow não habilita Pages automaticamente.
6. Conferir o certificado e marcar Enforce HTTPS em Settings → Pages quando disponível. Abrir `https://empia.com.br/` e `/privacidade/`; confirmar redirecionamento de www. DNS/certificado podem levar até 24 horas.

Se preferir executar as etapas de GitHub com Codex após a revisão, autorize-as explicitamente; nenhuma foi executada nesta preparação.

## 2. Registros do site no Registro.br

Domínio → DNS → configurar/editar zona DNS. Use a edição avançada se a interface simplificada não mostrar registros. Mantenha os servidores `a.auto.dns.br` e `b.auto.dns.br`.

Cada linha é um registro separado. A tabela usa **nome completo**, sem ambiguidade. Se o formulário já mostrar o sufixo `.empia.com.br`, deixe o prefixo vazio para o domínio principal e use apenas `www` para www; não duplique o sufixo. `@` é a notação de raiz em outros provedores, não um valor a inserir à força. Se TTL estiver disponível, usar 3600 segundos; caso seja fixo, manter o padrão do Registro.br.

| Tipo | Nome completo | Destino/valor |
|---|---|---|
| A | empia.com.br | 185.199.108.153 |
| A | empia.com.br | 185.199.109.153 |
| A | empia.com.br | 185.199.110.153 |
| A | empia.com.br | 185.199.111.153 |
| CNAME | www.empia.com.br | empresariamento.github.io. |

IPv6 é opcional; se desejar, criar também os quatro registros:

| Tipo | Nome completo | Destino/valor |
|---|---|---|
| AAAA | empia.com.br | 2606:50c0:8000::153 |
| AAAA | empia.com.br | 2606:50c0:8001::153 |
| AAAA | empia.com.br | 2606:50c0:8002::153 |
| AAAA | empia.com.br | 2606:50c0:8003::153 |

O CNAME termina em ponto para indicar nome absoluto; se o formulário normalizar esse ponto, o destino continua sendo `empresariamento.github.io`, **sem /empia-site, sem https://**. Não criar CNAME na raiz nem registro curinga `*`.

Preservar o MX `0 .`, o TXT `v=spf1 -all` e os TXT de verificação. Os novos registros do site não habilitam e-mail. Se algum A/AAAA/CNAME diferente tiver sido adicionado após a consulta, conferir a finalidade antes de substituí-lo.

Verificação do GitHub, separada da do Google:

| Tipo | Nome completo | Valor |
|---|---|---|
| TXT | _github-pages-challenge-empresariamento.empia.com.br | Código exato mostrado pelo GitHub |

Esse código é individual e ainda não foi gerado. Não use exemplo fictício; copie o nome e valor efetivamente apresentados pelo GitHub.

## 3. Confirmar posse no Google Search Console

1. Abrir [Google Search Console](https://search.google.com/search-console) na conta Google que será responsável pelo domínio. Escolher Adicionar propriedade → **Domínio**.
2. Digitar `empia.com.br` (sem https:// e sem caminho). Selecionar verificação por DNS/TXT, em vez de um fluxo que tente entrar automaticamente no registrador.
3. Google mostrará um código exclusivo começando com `google-site-verification=`. Copiar a linha completa. Não é chave de API ou senha; é um registro público de comprovação do domínio.
4. No Registro.br, adicionar **outro TXT no domínio principal**, sem remover ou substituir o SPF:

| Tipo | Nome completo | Valor |
|---|---|---|
| TXT | empia.com.br | google-site-verification=CODIGO_REAL_MOSTRADO_PELO_GOOGLE |

`CODIGO_REAL_MOSTRADO_PELO_GOOGLE` é uma indicação, não o valor para colar. Sem entrar na conta e gerar a propriedade, ninguém consegue antecipar esse código exato. Renan copia o valor real.

5. Salvar e voltar ao Search Console → Verificar. Se ainda não encontrar, aguardar propagação e tentar novamente. Mantenha o TXT depois de verificar. A propriedade Domínio cobre protocolos e subdomínios; pode ser verificada **antes da publicação do site**.
6. Depois de publicar e confirmar HTTPS, enviar `https://empia.com.br/sitemap.xml` em Sitemaps. Verificação de posse não garante indexação nem significa que o Google aprovou o app OAuth.

## 4. Endereços futuros do app

Após publicação e posse confirmada, os endereços previstos são:

- Início: `https://empia.com.br/`
- Política: `https://empia.com.br/privacidade/`
- Domínio autorizado do app: `empia.com.br`

Configurar Google Search Console não configura automaticamente a tela de consentimento OAuth. A marca Empia Bunker e seus URLs poderão ser preenchidos no projeto Google pertinente por etapa autorizada posterior. Nesta tarefa não houve login, alteração OAuth ou uso de Drive.

## Fontes oficiais consultadas em 13/10/2026

- [GitHub: registros e domínio personalizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: verificar domínio da conta](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GitHub: workflow Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Google: verificar propriedade no Search Console](https://support.google.com/webmasters/answer/9008080?hl=pt-BR)
- [Google: escopos Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Google: política de uso de dados](https://developers.google.com/terms/api-services-user-data-policy)
- [LGPD: texto legal](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
