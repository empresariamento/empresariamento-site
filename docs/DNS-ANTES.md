# empia.com.br — consulta pública antes de qualquer mudança

13/10/2026. Consultas somente leitura, feitas antes da preparação do site. Não houve acesso ao painel Registro.br, VPS ou Supabase. O resultado foi informado a Renan antes da proposta de hospedagem.

| Nome | Tipo | Resultado |
|---|---|---|
| empia.com.br | NS | a.auto.dns.br e b.auto.dns.br |
| empia.com.br | A | Sem resposta A; domínio existe, retorna SOA |
| empia.com.br | AAAA | Sem resposta AAAA; domínio existe, retorna SOA |
| empia.com.br | CNAME | Sem resposta CNAME |
| empia.com.br | MX | 0 . (Null MX) |
| empia.com.br | TXT | v=spf1 -all |
| empia.com.br | CAA | Sem resposta CAA, consultado no Google Public DNS |
| www.empia.com.br | A/AAAA/CNAME | NXDOMAIN |

Cloudflare 1.1.1.1: consulta por Resolve-DnsName. Google Public DNS: DNS over HTTPS `https://dns.google/resolve?name=empia.com.br&type=A`, repetido para AAAA/CNAME/MX/TXT/CAA e www. Google retornou Status 0 sem Answer para A/AAAA/CNAME/CAA e Status 3 para www. SOA: a.auto.dns.br, hostmaster.registro.br, serial 2026286640.

HTTP e HTTPS (`curl -I`): erro 6, Could not resolve host. A ferramenta web também não abriu página. Não foi possível obter conteúdo ou resposta HTTP de um site. Não há endereço de hospedagem no domínio principal ou em www nos resolvers consultados. Não se conclui que nenhum outro subdomínio/serviço exista: não foi feita varredura exaustiva.

Null MX indica que o domínio não aceita e-mail; o SPF -all não autoriza remetentes. Esses registros devem ser preservados ao configurar o site; Pages não precisa alterá-los. O e-mail de contato confirmado é empresariamento@gmail.com, em outro domínio.

Resultados DNS podem mudar. Antes de aplicar, Renan deve conferir novamente a zona no Registro.br e preservar registros de outros serviços. Nenhuma alteração é proposta para os servidores NS.
