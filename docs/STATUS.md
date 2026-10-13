# Site EMPIA — preparado, não publicado

13/10/2026.

- Consulta pública DNS e HTTP/HTTPS realizada e informada antes da proposta. Sem A/AAAA/CNAME no principal, www NXDOMAIN; MX Null e SPF -all preservados. Evidência em DNS-ANTES.md.
- Repositório independente empia-site. Nenhum acesso à VPS, Supabase ou arquivos/branch da Fundação durante esta tarefa. Não houve acesso ao painel Registro.br, mudança DNS ou conta Search Console.
- Duas páginas estáticas em português, dados do controlador confirmados por Renan, escopo drive.file limitado por regra do app a backups criados por ele.
- `npm run check` passou: páginas, idioma, metadados, identificadores legais, links/âncoras e ausência de formulário/script/recurso externo.
- `npm run check:publication` falhou **como esperado** porque publicação ainda não autorizada; o upload/deploy está bloqueado.
- Revisão independente estática sem achados importantes. DOM e renderização no Chrome revisados; política verificada em 375px e 320px, sem conteúdo fora da largura. Capturas locais em .preview/ (ignoradas pelo Git).
- Pages preparado com workflow somente manual, domínio alvo e sitemap. GitHub Pages não habilitado; certificado/DNS/produção não testados. Não há site público no endereço alvo como resultado deste trabalho.
- Não há código de backup aqui: política descreve propósito e obrigações de operação, sem certificar segurança ou implementação do app.

Pendências para publicação: revisão e autorização de Renan; verificar domínio no GitHub e definir Pages/domínio; Renan criar registros DNS e TXT Google/GitHub gerados nas próprias contas; confirmar HTTPS e páginas após deploy. Permanecer privado durante revisão; Pages em repo privado depende do plano, sem alteração automática de visibilidade.
