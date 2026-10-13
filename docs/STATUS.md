# Empresariamento — GitHub Pages publicado; DNS pendente

13/10/2026. Identidade e domínio alterados por instrução de Renan. Consulta pública realizada e informada antes das alterações locais.

## Autorização posterior do DE

Renan aprovou os textos da versão df04a57 e autorizou tornar o site público, renomear o repositório e ativar GitHub Pages no domínio empresariamento.com.br. Confirmou que o .com.br não tem site/e-mail em uso. empresariamento.com (HostGator) permanece fora do escopo. DNS será aplicado por Renan, um passo por vez; o primeiro é mostrar a configuração atual no Registro.br. Os itens abaixo registram a preparação anterior à autorização.

## Publicação autorizada realizada

- Repositório renomeado: https://github.com/empresariamento/empresariamento-site; visibilidade pública confirmada pela API.
- Aprovação dos textos df04a57 registrada; check:publication passou. Nenhuma mudança de conteúdo aprovada foi introduzida nesta publicação.
- Pages habilitado em modo workflow; domínio configurado como empresariamento.com.br.
- Deploy manual concluído com success: https://github.com/empresariamento/empresariamento-site/actions/runs/38452221786.
- URL padrão do GitHub retorna 301 para http://empresariamento.com.br/, confirmando a configuração do domínio.
- DNS ainda não aplicado pelo usuário. Certificado ausente e https_enforced=false no momento da publicação; emissão/Enforce HTTPS será concluída após DNS correto. Não declarar domínio/HTTPS funcionando antes dessa verificação.
- Nenhuma consulta de configuração ou mudança no domínio empresariamento.com, HostGator, Registro.br, VPS ou Supabase.
- Próximo passo humano único: Renan mostrar a tela DNS atual de empresariamento.com.br no Registro.br. Nenhum registro deve ser alterado antes dessa leitura.

- empresariamento.com.br registrado/ativo no RDAP; NS declarados a.sec.dns.br e c.sec.dns.br. Google/Cloudflare retornam SERVFAIL e recusa da autoridade. HTTP/HTTPS não abriram. MX/TXT não puderam ser obtidos, não considerados inexistentes.
- Nenhuma alteração de DNS/NS/MX, acesso ao Registro.br, VPS, Supabase ou Fundação. Nenhuma mensagem de teste enviada por e-mail.
- Início reduzido à marca/frase, bloco curto do Empresariamento Bunker, política e empresa/CNPJ/e-mail. Removidas seções, cargos e demais conteúdos antigos.
- Texto da Política de Privacidade preservado com substituição de nomes; domínio, âncora e identificação visual acompanham nova marca. Comparação literal automatizada confirmou ausência de alteração adicional no texto.
- CNAME, canonical, sitemap e robots atualizados para novo domínio. Aprovação de publicação permanece false. Repositório privado, Pages desativado; permissão de tornar público se aplica somente na publicação posterior.
- Checagem local de HTML/links passou; nenhuma referência à marca anterior no diretório publicado site/. Prévia Chrome e largura de 320px conferidas nas duas páginas, sem rolagem horizontal. Trava de publicação recusou o comando como esperado. Texto completo das duas páginas em docs/TEXTOS-FINAIS.md para revisão de Renan.

Pendências: revisão e autorização dos textos; confirmar a zona real e serviços existentes antes de qualquer alteração DNS. Falha de DNS atual não é justificativa para apagar registros ou trocar NS às cegas. Este trabalho não homologa nem instala o backup.
