# empresariamento.com.br — consulta pública antes de mudanças

13/10/2026. Consultas somente leitura, informadas a Renan antes da preparação da nova identidade. Nenhum acesso ao painel Registro.br, VPS ou Supabase.

| Consulta | Resultado |
|---|---|
| Registro público RDAP do Registro.br | Domínio ativo; registro 05/08/2020; expiração indicada 05/08/2028 |
| Servidores declarados no RDAP | a.sec.dns.br e c.sec.dns.br |
| A, AAAA, CNAME, NS, MX, TXT e CAA no Google Public DNS | Status 2: SERVFAIL; nenhum conjunto de registros obtido |
| A e CNAME de www.empresariamento.com.br no Google | SERVFAIL |
| A, NS, MX e TXT no Cloudflare | SERVFAIL, No Reachable Authority; autoridade retornou REFUSED |
| Google com validação DNSSEC desativada na consulta | Continua SERVFAIL; mensagem Name servers refused query (lame delegation?) |
| HTTP e HTTPS | curl erro 6, Could not resolve host; ferramenta web não conseguiu abrir página |

Fontes de evidência: `https://rdap.registro.br/domain/empresariamento.com.br`, `https://dns.google/resolve?name=empresariamento.com.br&type=MX`, `https://cloudflare-dns.com/dns-query?name=empresariamento.com.br&type=MX` (Accept: application/dns-json). Cloudflare citou 200.160.0.11:53 recusando consultas; Google citou 200.160.0.11 e 200.189.40.11.

**Conclusão limitada:** há um domínio registrado, mas a resolução pública está falhando. Site não abriu nas consultas realizadas. Não foi possível listar MX/TXT: isso não significa que estejam vazios ou que e-mail não exista. Não houve teste de envio/recebimento de e-mail, SMTP ou varredura de outros subdomínios.

Não trocar NS, substituir zona ou criar/remover A/MX/TXT sem conferir a configuração atual. Renan deve consultar os registros existentes e a configuração dos servidores no painel Registro.br, preservando serviços de site, e-mail e validações. O resultado público não autoriza apagar configurações. Nesta entrega nenhuma alteração DNS ou proposta de migração imediata foi aplicada.
