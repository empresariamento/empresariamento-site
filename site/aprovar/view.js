// Plain-Portuguese rendering of one Meta Ads package (DEC-26). Pure functions, no DOM.

export const OPERATIONS = {
  criar_campanha_pausada: 'Criar campanha completa (campanha, conjuntos e anúncios)',
  alterar_campanha: 'Ajustar campanha existente',
  ativar_campanha: 'ATIVAR veiculação',
  pausar_campanha: 'Pausar veiculação',
  arquivar_campanha: 'Arquivar',
  alterar_orcamento: 'Mudar orçamento',
  alterar_publico: 'Mudar público',
  alterar_periodo: 'Mudar período',
  alterar_criativo: 'Trocar criativo',
};

const GENDERS = { 1: 'homens', 2: 'mulheres' };
const BUDGET_KEYS = { daily_budget: 'por dia', lifetime_budget: 'no total', bid_amount: 'lance' };

export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function money(cents, currency = 'BRL') {
  if (!Number.isInteger(cents)) return 'valor inválido';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(cents / 100);
}

export function dateTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });
}

function names(list) {
  return (Array.isArray(list) ? list : []).map(item => (item && (item.name || item.key || item.id)) || String(item)).join(', ');
}

export function targetingText(targeting) {
  if (!targeting || typeof targeting !== 'object') return ['sem público definido'];
  const lines = [];
  const geo = targeting.geo_locations || {};
  const places = [
    (geo.countries || []).join(', '),
    names(geo.regions),
    names(geo.cities),
    names(geo.zips),
  ].filter(Boolean).join('; ');
  if (places) lines.push(`Onde: ${places}`);
  if (targeting.age_min || targeting.age_max) lines.push(`Idade: ${targeting.age_min || 18} a ${targeting.age_max || '65+'} anos`);
  if (Array.isArray(targeting.genders) && targeting.genders.length) {
    lines.push(`Gênero: ${targeting.genders.map(g => GENDERS[g] || g).join(' e ')}`);
  } else {
    lines.push('Gênero: todos');
  }
  const interests = [names(targeting.interests), ...(targeting.flexible_spec || []).map(spec => names(spec.interests))].filter(Boolean);
  if (interests.length) lines.push(`Interesses: ${interests.join('; ')}`);
  if (targeting.custom_audiences) lines.push(`Públicos personalizados: ${names(targeting.custom_audiences)}`);
  if (targeting.excluded_custom_audiences) lines.push(`Excluídos: ${names(targeting.excluded_custom_audiences)}`);
  if (targeting.publisher_platforms) lines.push(`Plataformas: ${targeting.publisher_platforms.join(', ')}`);
  return lines;
}

export function creativeText(creative) {
  if (!creative || typeof creative !== 'object') return ['sem criativo'];
  if (creative.creative_id) return [`Criativo já existente na conta (ID ${creative.creative_id})`];
  const lines = [];
  if (creative.name) lines.push(`Nome: ${creative.name}`);
  const story = creative.object_story_spec || {};
  if (story.page_id) lines.push(`Página: ${story.page_id}`);
  if (story.instagram_user_id || story.instagram_actor_id) lines.push(`Instagram: ${story.instagram_user_id || story.instagram_actor_id}`);
  const link = story.link_data;
  if (link) {
    if (link.message) lines.push(`Texto: ${link.message}`);
    if (link.name) lines.push(`Título: ${link.name}`);
    if (link.description) lines.push(`Descrição: ${link.description}`);
    if (link.link) lines.push(`Leva para: ${link.link}`);
    if (link.call_to_action?.type) lines.push(`Botão: ${link.call_to_action.type}`);
    if (link.image_hash || link.picture) lines.push(`Imagem: ${link.image_hash || link.picture}`);
  }
  const video = story.video_data;
  if (video) {
    if (video.message) lines.push(`Texto: ${video.message}`);
    if (video.title) lines.push(`Título: ${video.title}`);
    if (video.video_id) lines.push(`Vídeo: ${video.video_id}`);
    if (video.call_to_action?.value?.link) lines.push(`Leva para: ${video.call_to_action.value.link}`);
  }
  if (creative.asset_feed_spec) lines.push('Criativo dinâmico: várias combinações (detalhe técnico abaixo)');
  if (creative.url_tags) lines.push(`Rastreamento: ${creative.url_tags}`);
  return lines.length ? lines : ['criativo sem descrição legível (detalhe técnico abaixo)'];
}

function budgetLines(obj, currency, prefix = '') {
  return Object.entries(BUDGET_KEYS)
    .filter(([key]) => obj && key in obj)
    .map(([key, label]) => `${prefix}${money(obj[key], currency)} ${label}`);
}

function periodLines(obj, prefix = '') {
  if (!obj) return [];
  const start = dateTime(obj.start_time);
  const end = dateTime(obj.end_time || obj.stop_time);
  if (!start && !end) return [];
  return [`${prefix}${start ? `de ${start}` : 'a partir de já'} ${end ? `até ${end}` : 'sem data de término'}`];
}

export function statusText(desired) {
  if (desired === 'PAUSED') return 'Sim — fica PAUSADA, não veicula nem gasta';
  if (desired === 'ACTIVE') return 'NÃO — passa a VEICULAR e GASTAR';
  if (desired === 'ARCHIVED') return 'Arquivada — deixa de veicular';
  return 'Estado não muda';
}

/** Sections, in order, for the approval screen. Every value is plain text. */
export function describePackage(pkg, { accountName = '', aloName = '' } = {}) {
  const meta = pkg.meta || {};
  const currency = pkg.currency || 'BRL';
  const sections = [];
  sections.push({ title: 'O que será feito', lines: [OPERATIONS[pkg.operation] || `Operação desconhecida: ${pkg.operation}`] });
  sections.push({ title: 'Conta de anúncios', lines: [`${accountName ? `${accountName} — ` : ''}${pkg.ad_account_id}`, `ALO: ${aloName || pkg.alo_slug}`] });
  if (pkg.target) sections.push({ title: 'Objeto alterado', lines: [`ID ${pkg.target} (campanha, conjunto ou anúncio)`] });
  sections.push({ title: 'Nasce/fica pausada?', lines: [statusText(pkg.desired_status)] });

  const campaign = meta.campaign;
  const adsets = meta.adsets || meta.add_adsets || [];
  const ads = meta.ads || meta.add_ads || [];
  const changes = meta.changes || {};
  if (campaign) {
    sections.push({ title: 'Campanha', lines: [`Nome: ${campaign.name}`, `Objetivo: ${campaign.objective}`,
      ...(campaign.special_ad_categories?.length ? [`Categoria especial: ${campaign.special_ad_categories.join(', ')}`] : [])] });
  }
  const budget = [...budgetLines(campaign, currency, 'Campanha: '), ...budgetLines(changes, currency, 'Novo valor: ')];
  for (const adset of adsets) budget.push(...budgetLines(adset, currency, `${adset.name}: `));
  sections.push({ title: 'Orçamento', lines: budget.length ? budget : ['não muda'] });

  const period = [...periodLines(campaign, 'Campanha: '), ...periodLines(changes, 'Novo período: ')];
  for (const adset of adsets) period.push(...periodLines(adset, `${adset.name}: `));
  sections.push({ title: 'Período', lines: period.length ? period : ['sem datas definidas (começa ao ativar, sem término)'] });

  const audience = [];
  for (const adset of adsets) audience.push(`${adset.name}:`, ...targetingText(adset.targeting).map(l => `  ${l}`));
  if (changes.targeting) audience.push(...targetingText(changes.targeting));
  sections.push({ title: 'Público', lines: audience.length ? audience : ['não muda'] });

  const creatives = [];
  for (const ad of ads) creatives.push(`Anúncio “${ad.name}”:`, ...creativeText(ad.creative).map(l => `  ${l}`));
  if (meta.creative) creatives.push(...creativeText(meta.creative));
  sections.push({ title: 'Criativos', lines: creatives.length ? creatives : ['não muda'] });

  const other = Object.keys(changes).filter(k => !(k in BUDGET_KEYS) && !['targeting', 'start_time', 'end_time', 'stop_time'].includes(k));
  if (other.length) sections.push({ title: 'Outras mudanças', lines: other.map(k => `${k}: ${JSON.stringify(changes[k])}`) });
  return sections;
}

/** Validates a stored row before showing approval buttons. */
export async function checkRow(row) {
  const problems = [];
  let pkg = null;
  try {
    pkg = JSON.parse(row.conteudo);
  } catch {
    problems.push('o conteúdo do pacote não é legível');
  }
  const hash = await sha256Hex(row.conteudo || '');
  if (hash !== row.conteudo_sha256) problems.push('o hash não confere com o conteúdo');
  if (pkg && pkg.schema !== 'empia.meta_ads.action.v1') problems.push('formato de pacote desconhecido');
  if (pkg && row.destino !== `meta_ads:${pkg.ad_account_id}`) problems.push('a conta do pacote não confere com o destino');
  if (new Date(row.expira_em).getTime() <= Date.now()) problems.push('o pacote expirou');
  if (pkg && !(pkg.operation in OPERATIONS)) problems.push('operação não permitida');
  return { pkg, hash, problems };
}
