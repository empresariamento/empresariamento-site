import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
const site = resolve('site');
const policy = JSON.parse(readFileSync('publication.json', 'utf8'));
const files = ['index.html', 'privacidade/index.html'];
for (const file of files) {
  const html = readFileSync(resolve(site, file), 'utf8');
  for (const required of ['lang="pt-BR"', 'name="viewport"', '<title>', '<h1', '</html>', policy.controller, policy.cnpj, policy.privacyEmail]) {
    if (!html.includes(required)) throw new Error(`${file}: ausente ${required}`);
  }
  if (/<script|<iframe|<form|https:\/\/fonts\./i.test(html)) throw new Error(`${file}: recurso externo/coleta fora do escopo`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`${file}: IDs duplicados`);
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https:|mailto:)/.test(target)) continue;
    const [path, anchor] = target.split('#');
    let dest = resolve(dirname(resolve(site, file)), path || '');
    if (!path) dest = resolve(site, file);
    else if (target.endsWith('/') || path.endsWith('/')) dest = resolve(dest, 'index.html');
    if (!dest.startsWith(site) || !existsSync(dest)) throw new Error(`${file}: link local inexistente ${target}`);
    if (anchor && !readFileSync(dest, 'utf8').includes(`id="${anchor}"`)) throw new Error(`${file}: âncora inexistente ${target}`);
  }
}
const privacy = readFileSync(resolve(site, 'privacidade/index.html'), 'utf8');
for (const required of ['Empresariamento Bunker', 'https://www.googleapis.com/auth/drive.file', 'criados por ele', 'Limited Use', 'Lei nº 13.709/2018', 'Aplicativo EMPIA e Meta Ads', 'ads_management', 'business_management', 'Exclusão de dados — EMPIA']) {
  if (!privacy.includes(required)) throw new Error(`Política sem ${required}`);
}
if (readFileSync(resolve(site, 'CNAME'), 'utf8').trim() !== policy.domain) throw new Error('CNAME divergente');
if (process.argv.includes('--publication')) {
  if (policy.approvedByRenan !== true || !policy.approvalReference) throw new Error('PUBLICAÇÃO BLOQUEADA: falta aprovação explícita de Renan após revisão.');
}
// DE approval page (DEC-26): only local, pinned, integrity-checked code; no external script.
const approval = readFileSync(resolve(site, 'aprovar/index.html'), 'utf8');
for (const required of ['lang="pt-BR"', 'name="viewport"', '<title>', 'Content-Security-Policy', "script-src 'self'", 'noindex', 'manifest.webmanifest']) {
  if (!approval.includes(required)) throw new Error(`aprovar/index.html: ausente ${required}`);
}
const assets = [...approval.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g)];
for (const [tag, target] of assets) {
  if (/^(https?:)?\/\//.test(target)) throw new Error(`aprovar/index.html: recurso externo ${target}`);
  const file = resolve(site, 'aprovar', target);
  if (!file.startsWith(site) || !existsSync(file)) throw new Error(`aprovar/index.html: arquivo inexistente ${target}`);
  if (/<script|rel="stylesheet"/.test(tag)) {
    const integrity = (tag.match(/integrity="([^"]+)"/) || [])[1];
    const expected = 'sha384-' + createHash('sha384').update(readFileSync(file)).digest('base64');
    if (integrity !== expected) throw new Error(`aprovar/index.html: integridade divergente em ${target}`);
  }
}
if (/<script(?![^>]*\bsrc=)/.test(approval)) throw new Error('aprovar/index.html: script embutido não permitido');
const vendor = JSON.parse(readFileSync(resolve(site, 'aprovar/vendor/VENDOR.json'), 'utf8'));
const vendored = readFileSync(resolve(site, 'aprovar/vendor', vendor.file));
if (createHash('sha256').update(vendored).digest('hex') !== vendor.sha256) throw new Error('biblioteca Supabase alterada');
if (!approval.includes(`vendor/${vendor.file}" integrity="${vendor.sri}"`)) throw new Error('aprovar: biblioteca sem a versão fixa registrada');
for (const name of readdirSync(resolve(site, 'aprovar'))) {
  if (name.endsWith('.js') && /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(/.test(readFileSync(resolve(site, 'aprovar', name), 'utf8'))) {
    throw new Error(`aprovar/${name}: renderização insegura`);
  }
}
const app = readFileSync(resolve(site, 'aprovar/app.js'), 'utf8');
if (/aprovar todos|approve_all|Promise\.all\([^)]*approve/i.test(app)) throw new Error('aprovar: aprovação em lote não permitida');
if (!app.includes('shouldCreateUser: false')) throw new Error('aprovar: login não pode criar usuário');
const config = readFileSync(resolve(site, 'aprovar/config.js'), 'utf8');
if (/service_role|sb_secret_/i.test(config)) throw new Error('aprovar/config.js: chave secreta não pode ir ao site');
if (process.argv.includes('--publication') && /supabaseUrl: ''|anonKey: ''/.test(config)) {
  throw new Error('PUBLICAÇÃO BLOQUEADA: página /aprovar sem configuração do Supabase.');
}

console.log('Três páginas verificadas. ' + (policy.approvedByRenan ? 'Aprovação registrada.' : 'Publicação ainda não autorizada.'));
