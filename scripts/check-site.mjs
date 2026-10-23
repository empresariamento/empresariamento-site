import { readFileSync, existsSync } from 'node:fs';
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
console.log('Duas páginas verificadas. ' + (policy.approvedByRenan ? 'Aprovação registrada.' : 'Publicação ainda não autorizada.'));
