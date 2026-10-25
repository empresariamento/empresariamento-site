import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { checkRow, describePackage, money, statusText } from '../site/aprovar/view.js';

const pkg = {
  schema: 'empia.meta_ads.action.v1', alo_slug: 'alo-renan-previdelo', ad_account_id: 'act_111',
  operation: 'criar_campanha_pausada', idempotency_key: 'criar-campanha-0001', target: null,
  currency: 'BRL', desired_status: 'PAUSED',
  meta: {
    campaign: { name: 'Black Friday', objective: 'OUTCOME_LEADS', special_ad_categories: [] },
    adsets: [{ ref: 'a', name: 'Mulheres 30-45', daily_budget: 5000, billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION', start_time: '2026-11-20T09:00:00-03:00', end_time: '2026-11-30T23:59:00-03:00',
      targeting: { geo_locations: { countries: ['BR'] }, age_min: 30, age_max: 45, genders: [2], interests: [{ id: '1', name: 'Empreendedorismo' }] } }],
    ads: [{ name: 'Vídeo 1', adset_ref: 'a', creative: { name: 'Criativo 1', object_story_spec: {
      page_id: '555', link_data: { link: 'https://exemplo.com.br/bf', message: 'Oi <script>alert(1)</script>' } } } }],
  },
};
const content = JSON.stringify(pkg);
const row = (overrides = {}) => ({
  id: '30000000-0000-4000-8000-000000000001', conteudo: content,
  conteudo_sha256: createHash('sha256').update(content, 'utf8').digest('hex'),
  destino: 'meta_ads:act_111', expira_em: new Date(Date.now() + 3600e3).toISOString(), ...overrides,
});

const section = (sections, title) => sections.find(s => s.title === title).lines.join('\n');

test('shows account, campaign, budget, period, audience, creatives and paused state in Portuguese', () => {
  const sections = describePackage(pkg, { accountName: 'Conta Renan', aloName: 'ALO Renan Previdelo' });
  assert.match(section(sections, 'Conta de anúncios'), /Conta Renan — act_111/);
  assert.match(section(sections, 'Campanha'), /Black Friday/);
  assert.match(section(sections, 'Orçamento'), /Mulheres 30-45: R\$\s?50,00 por dia/);
  assert.match(section(sections, 'Período'), /de 20\/11\/2026, 09:00 até 30\/11\/2026, 23:59/);
  assert.match(section(sections, 'Público'), /Idade: 30 a 45 anos/);
  assert.match(section(sections, 'Público'), /Gênero: mulheres/);
  assert.match(section(sections, 'Criativos'), /Leva para: https:\/\/exemplo.com.br\/bf/);
  assert.match(section(sections, 'Nasce/fica pausada?'), /PAUSADA/);
});

test('activation is flagged as spending', () => {
  assert.match(statusText('ACTIVE'), /GASTAR/);
  const sections = describePackage({ ...pkg, operation: 'ativar_campanha', target: '777', desired_status: 'ACTIVE', meta: {} });
  assert.match(section(sections, 'O que será feito'), /ATIVAR/);
  assert.match(section(sections, 'Objeto alterado'), /777/);
});

test('money is formatted from integer cents', () => {
  assert.match(money(123456, 'BRL'), /1\.234,56/);
  assert.equal(money(12.5), 'valor inválido');
});

test('a row is approvable only with matching hash, destination and validity', async () => {
  assert.deepEqual((await checkRow(row())).problems, []);
  assert.ok((await checkRow(row({ conteudo_sha256: 'e'.repeat(64) }))).problems.some(p => p.includes('hash')));
  assert.ok((await checkRow(row({ destino: 'meta_ads:act_222' }))).problems.some(p => p.includes('conta')));
  assert.ok((await checkRow(row({ expira_em: new Date(Date.now() - 1000).toISOString() }))).problems.some(p => p.includes('expirou')));
  const bad = JSON.stringify({ ...pkg, operation: 'excluir_campanha' });
  const badRow = row({ conteudo: bad, conteudo_sha256: createHash('sha256').update(bad).digest('hex') });
  assert.ok((await checkRow(badRow)).problems.some(p => p.includes('operação')));
});
