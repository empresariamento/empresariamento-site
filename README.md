# Site Empresariamento

Site estático da HUB EMPRESARIAMENTO LTDA, CNPJ 63.804.274/0001-53; contato empresariamento@gmail.com. Domínio alvo: empresariamento.com.br. Nome do app: Empresariamento Bunker.

Página inicial mínima: marca/frase, bloco do backup, link da Política de Privacidade e rodapé legal. Política mantém seu conteúdo anterior, alterando apenas identidade, domínio e referências de navegação correspondentes. Sem dependências, JavaScript de navegador, formulários, analytics ou conexão com infraestrutura. Este repositório não implementa nem audita o app de backup.

**Textos aprovados por Renan em 13/10/2026.** Repositório público e GitHub Pages autorizados para empresariamento.com.br. Referência da aprovação em `publication.json`; deploy continua manual e push só verifica arquivos. Repositório de destino: empresariamento/empresariamento-site.

## Finalidade e preservação do app OAuth

O domínio **empresariamento.com.br** e a **Política de Privacidade** deste site servem ao app OAuth **Empresariamento Bunker**, fornecendo sua identificação pública e informações sobre o tratamento de dados. O site existe para essa finalidade; não há trabalho de SEO nem envio de sitemap ao Search Console.

**Não remover o domínio, a configuração do GitHub Pages ou a Política de Privacidade.** Manter disponíveis por HTTPS a página inicial em https://empresariamento.com.br/ e a política em https://empresariamento.com.br/privacidade/. Qualquer remoção ou alteração desses endereços exige autorização explícita de Renan e avaliação do impacto no app OAuth.

HTTPS confirmado nas duas páginas em 14/10/2026: certificado válido e respostas HTTP 200. O domínio separado empresariamento.com e seu e-mail na HostGator permanecem fora do escopo.

## Revisar localmente

```sh
npm run check
python -m http.server 8787 --bind 127.0.0.1 --directory site
```

Início: http://127.0.0.1:8787/ ; política: http://127.0.0.1:8787/privacidade/ . Textos completos para copiar/revisar: docs/TEXTOS-FINAIS.md.

`npm run check:publication` valida a aprovação expressa de Renan. Alterações futuras de texto exigem nova revisão; não devem reutilizar a aprovação desta versão. O workflow Pages é manual; configuração de domínio não é ativada só pelo CNAME.

Renan confirmou que empresariamento.com.br não tem site nem e-mail em uso. O domínio empresariamento.com, com e-mail na HostGator, não deve ser tocado. O primeiro passo humano é mostrar a tela DNS atual do .com.br no Registro.br, antes de receber instruções de alteração. Evidências públicas: docs/DNS-ANTES.md. Guia: docs/PUBLICACAO.md. Estado: docs/STATUS.md.
