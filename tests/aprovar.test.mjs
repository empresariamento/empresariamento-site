import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { checkRow, describePackage, money, safeImage, statusText, technicalView } from '../site/aprovar/view.js';

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

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const withPreview = (preview) => ({ ...pkg, operation: 'alterar_campanha', target: '777', desired_status: null,
  meta: { add_ads: [{ name: 'Anúncio 2', adset_id: '888', creative: { creative_id: '999' } }] }, creative_preview: preview });
const previews = (p) => describePackage(p).find(s => s.title === 'Criativos').previews;

test('creative preview shows the image and the text, not only the creative id', () => {
  const [p] = previews(withPreview([{ anuncio: 'Anúncio 2', creative_id: '999', nome: 'Fertilidade',
    texto: '1 mês para melhorar', titulo: 'Inscreva-se', link: 'https://exemplo.com.br/', botao: 'LEARN_MORE', imagem: PNG, aviso: null }]));
  assert.equal(p.image, PNG);
  assert.match(p.label, /Anúncio “Anúncio 2” · criativo 999 · Fertilidade/);
  assert.match(p.lines.join('\n'), /Texto: 1 mês para melhorar/);
  assert.match(p.lines.join('\n'), /Leva para: https:\/\/exemplo.com.br\//);
  assert.equal(p.warning, '');
});

test('only embedded raster images are shown; anything else becomes a warning', () => {
  for (const imagem of ['https://scontent.xx.fbcdn.net/t.jpg', 'data:image/svg+xml;base64,PHN2Zz4=', 'javascript:alert(1)',
    'data:image/png;base64,abc"onerror="x', 'data:image/png;base64,' + 'A'.repeat(800000), null]) {
    const [p] = previews(withPreview([{ anuncio: 'A', imagem }]));
    assert.equal(p.image, null, String(imagem).slice(0, 40));
    assert.match(p.warning, /Gerenciador/);
  }
  assert.equal(safeImage(PNG), PNG);
});

test('a preview warning from Max is shown and old packages without preview still render', () => {
  const [p] = previews(withPreview([{ anuncio: 'A', aviso: 'Não consegui ler este criativo na Meta; confira no Gerenciador antes de aprovar.' }]));
  assert.match(p.warning, /Não consegui ler/);
  assert.deepEqual(previews(pkg), []);
});

test('technical view shortens embedded images but keeps everything else', () => {
  const view = technicalView(withPreview([{ anuncio: 'A', imagem: PNG }]));
  assert.match(view.creative_preview[0].imagem, /imagem mostrada acima/);
  assert.equal(view.meta.add_ads[0].creative.creative_id, '999');
  assert.equal(technicalView(pkg), pkg);
});
