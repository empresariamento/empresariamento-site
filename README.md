# empia-site

Site estático em português para a EMPIA, separado do EMPIA Core e da Fundação. Duas páginas: início e Política de Privacidade, com Empia Bunker/Google Drive/drive.file para backup apenas dos arquivos criados pelo próprio app.

Controlador e contato fornecidos por Renan: HUB EMPRESARIAMENTO LTDA, CNPJ 63.804.274/0001-53, empresariamento@gmail.com. Não há app de backup implementado neste repositório, credenciais, dados de clientes, conexão com VPS ou Supabase. O site descreve a finalidade e as regras do app; esta entrega não audita nem ativa o Empia Bunker.

**Estado: privado e não publicado.** GitHub Pages não foi habilitado, nenhum domínio foi vinculado no GitHub e nenhum DNS foi alterado. `publication.json` mantém `approvedByRenan: false`. O workflow de publicação é exclusivamente manual e falha antes de enviar o artefato enquanto não houver aprovação registrada. Push só verifica o código, não publica.

## Revisão local

Abra `site/index.html` e `site/privacidade/index.html` no navegador, ou:

```sh
npm run check
python -m http.server 8787 --bind 127.0.0.1 --directory site
```

Acesse `http://127.0.0.1:8787`. Não há dependências npm, scripts no navegador, analytics, cookies de aplicação, formulários ou fontes externas. Site responsivo com links relativos, navegação por teclado e contraste legível.

`npm run check:publication` deve falhar nesta versão: isso confirma o bloqueio de publicação. `approvedByRenan` é uma trava operacional local, não autenticação humana nem um serviço de aprovação; somente uma autorização explícita posterior do usuário permite alterar esse estado. Antes de cada nova versão publicada, obter revisão e renovar a referência de aprovação.

## Publicar posteriormente

Siga [docs/PUBLICACAO.md](docs/PUBLICACAO.md) somente após revisão e autorização de Renan. Contém a ordem de ativação do GitHub Pages, os registros exatos para o Registro.br e a verificação no Search Console. O arquivo `site/CNAME` documenta o domínio, mas **em Actions o domínio precisa ser configurado também em Settings → Pages; CNAME sozinho não ativa o domínio**.

O repositório fica privado durante a revisão. Pages em repositório privado depende do plano GitHub; se não estiver disponível, a alternativa é tornar público este repositório de site, mas somente após autorização explícita. Não houve contratação de plano ou alteração de visibilidade.

Evidências anteriores à proposta de mudança: [docs/DNS-ANTES.md](docs/DNS-ANTES.md). Resultado das verificações: [docs/STATUS.md](docs/STATUS.md).
