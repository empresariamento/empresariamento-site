# Publicação futura — Empresariamento

**Não publicar antes de Renan revisar o texto das duas páginas e autorizar.** O domínio alvo é `empresariamento.com.br`; o aplicativo é Empresariamento Bunker. O DNS público apresenta SERVFAIL e não permitiu inventariar site/e-mail/MX. Consulte DNS-ANTES.md.

## Antes de qualquer mudança DNS

Renan deve conferir a zona e os servidores atuais no Registro.br. O registro público declara `a.sec.dns.br` e `c.sec.dns.br`; esses servidores recusaram as consultas realizadas. A origem da falha precisa ser confirmada no painel ou com o suporte do provedor. Não se propõe mudar servidores ou restaurar uma zona vazia. Preservar MX, SPF, DKIM, DMARC, validações e destinos de serviços que estiverem configurados. Não há acesso autorizado do agente ao painel.

## Após revisão e autorização

1. Registrar aprovação em `publication.json` com referência à versão revisada. O valor permanece false nesta preparação.
2. A conta empresariamento não habilita Pages no repo privado com seu plano atual: o painel exige upgrade ou repo público. Renan autorizou tornar **somente o repositório deste site** público quando for publicar; essa autorização ainda não permite publicar as páginas sem revisão. Não houve mudança de visibilidade.
3. Verificar domínio na conta GitHub → Settings → Pages → Add a domain. GitHub gera TXT com nome `_github-pages-challenge-empresariamento.empresariamento.com.br` e valor exclusivo. Renan insere o nome/valor efetivamente apresentados na zona ativa, verifica e mantém o TXT.
4. No repositório → Settings → Pages, selecionar GitHub Actions, configurar Custom domain = `empresariamento.com.br` antes de apontar o DNS para Pages. O arquivo CNAME é referência; Actions exige também a configuração em Settings.
5. Somente após inventário da zona e confirmação de que o destino do site pode mudar, preparar o plano de alteração com Renan. Os valores de Pages abaixo são referência, não instrução para substituir registros existentes agora.

| Tipo | Nome completo | Destino |
|---|---|---|
| A | empresariamento.com.br | 185.199.108.153 |
| A | empresariamento.com.br | 185.199.109.153 |
| A | empresariamento.com.br | 185.199.110.153 |
| A | empresariamento.com.br | 185.199.111.153 |
| CNAME | www.empresariamento.com.br | empresariamento.github.io. |

IPv6 opcional: quatro AAAA na raiz, `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`. Não usar CNAME na raiz ou curinga; não modificar registros de e-mail para publicar um site. Campo de nome deve seguir a interface da zona ativa, sem duplicar sufixo. TTL 3600 se configurável, senão padrão do provedor.

6. Executar workflow Pages manual na main somente após aprovação e configuração concluídas. Nenhum deploy acontece em push. Conferir HTTPS, início, privacidade e redirecionamento www; ativar Enforce HTTPS quando disponível.

## Search Console — Renan faz a verificação

Adicionar propriedade **Domínio** = `empresariamento.com.br` em https://search.google.com/search-console. Google gera `google-site-verification=...`. Criar TXT adicional na raiz com o código real, preservando os demais TXT, e clicar Verificar após propagação. Não é possível antecipar esse código. Com a falha DNS atual, a verificação pode não funcionar até a zona ser corrigida/confirmada. Não houve login ou alteração no Search Console.

Endereços futuros: `https://empresariamento.com.br/`, `https://empresariamento.com.br/privacidade/` e `https://empresariamento.com.br/sitemap.xml`. Confirmar posse não publica o site nem configura/valida automaticamente o app OAuth.

## Referências oficiais

- [GitHub: domínio e DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: verificar domínio](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Google: propriedade Search Console](https://support.google.com/webmasters/answer/9008080?hl=pt-BR)
- [Google: drive.file](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
