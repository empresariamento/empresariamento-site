# Site Empresariamento

Site estático da HUB EMPRESARIAMENTO LTDA, CNPJ 63.804.274/0001-53; contato empresariamento@gmail.com. Domínio alvo: empresariamento.com.br. Nome do app: Empresariamento Bunker.

Página inicial mínima: marca/frase, bloco do backup, link da Política de Privacidade e rodapé legal. Política mantém seu conteúdo anterior, alterando apenas identidade, domínio e referências de navegação correspondentes. Sem dependências, JavaScript de navegador, formulários, analytics ou conexão com infraestrutura. Este repositório não implementa nem audita o app de backup.

**Privado e não publicado.** Renan autorizou tornar o repositório público quando for publicar, mas ainda vai revisar os textos. `publication.json` continua bloqueando deploy; Pages não está habilitado. Push só valida arquivos. Nome técnico do repositório não foi alterado.

## Revisar localmente

```sh
npm run check
python -m http.server 8787 --bind 127.0.0.1 --directory site
```

Início: http://127.0.0.1:8787/ ; política: http://127.0.0.1:8787/privacidade/ . Textos completos para copiar/revisar: docs/TEXTOS-FINAIS.md.

`npm run check:publication` deve falhar até autorização expressa de Renan. O workflow Pages é manual; configuração de domínio não é ativada só pelo CNAME.

O domínio novo apresenta falha DNS pública: não foi possível inventariar MX ou provar ausência de serviços. Antes de alterar DNS, Renan verifica a zona existente. Evidências: docs/DNS-ANTES.md. Preparação futura, sem aplicação: docs/PUBLICACAO.md. Estado: docs/STATUS.md.
