// DE approval page for Meta Ads packages (DEC-26). Renders with textContent only.
import { OPERATIONS, checkRow, dateTime, describePackage, technicalView } from './view.js';

const DE_EMAIL = 'empresariamento@gmail.com';
const REDIRECT = 'https://empresariamento.com.br/aprovar/';
const config = window.EMPIA_APROVAR || {};
const app = document.getElementById('app');
const statusBar = document.getElementById('status');
let sb = null;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'onclick') node.addEventListener('click', value);
    else if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function show(...nodes) {
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

function notice(text, kind = 'info') {
  statusBar.className = `status ${kind}`;
  statusBar.textContent = text || '';
}

async function validUser() {
  // Server-checked: an expired or revoked session never reaches the buttons.
  const { data, error } = await sb.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

async function route(message) {
  notice(message || '');
  const { data } = await sb.auth.getSession();
  if (!data?.session) return showLogin();
  const user = await validUser();
  if (!user) {
    await sb.auth.signOut({ scope: 'local' });
    return showLogin('Sua sessão expirou. Entre de novo.');
  }
  if (user.app_metadata?.empia_role !== 'DE') {
    await sb.auth.signOut({ scope: 'local' });
    return showLogin('Este acesso não é o do DE.');
  }
  return showList();
}

function showLogin(message) {
  notice(message || '', message ? 'warn' : 'info');
  const code = el('input', { id: 'code', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '10', placeholder: 'Código do e-mail' });
  const send = el('button', { className: 'primary', onclick: async () => {
    send.disabled = true;
    const { error } = await sb.auth.signInWithOtp({ email: DE_EMAIL, options: { shouldCreateUser: false, emailRedirectTo: REDIRECT } });
    send.disabled = false;
    notice(error ? 'Não foi possível enviar o acesso. Tente de novo em alguns minutos.' : `Enviamos um link e um código para ${DE_EMAIL}.`, error ? 'error' : 'info');
  } }, 'Enviar acesso para o meu e-mail');
  const verify = el('button', { onclick: async () => {
    const token = code.value.replace(/\s/g, '');
    if (!/^\d{6,10}$/.test(token)) return notice('Digite o código numérico do e-mail.', 'warn');
    const { error } = await sb.auth.verifyOtp({ email: DE_EMAIL, token, type: 'email' });
    if (error) return notice('Código inválido ou vencido. Peça um novo acesso.', 'error');
    return route();
  } }, 'Entrar com o código');
  show(el('section', { className: 'card' },
    el('h2', {}, 'Entrar'),
    el('p', {}, `Só o DE (${DE_EMAIL}) entra nesta página. Abra o link do e-mail neste aparelho ou digite o código abaixo — no atalho da tela inicial, use o código.`),
    send, el('label', { for: 'code' }, 'Código recebido'), code, verify));
}

async function loadPending() {
  const now = new Date().toISOString();
  const [rows, accounts, alos] = await Promise.all([
    sb.from('aprovacoes').select('id,alo_id,conteudo,conteudo_sha256,destino,status,criada_em,expira_em')
      .eq('status', 'pendente').like('destino', 'meta_ads:%').gt('expira_em', now).order('criada_em'),
    sb.from('meta_ads_accounts').select('alo_id,ad_account_id,nome_referencia'),
    sb.from('alos').select('id,slug,nome'),
  ]);
  const failed = [rows, accounts, alos].find(result => result.error);
  if (failed) throw failed.error;
  const accountNames = new Map(accounts.data.map(a => [a.ad_account_id, a.nome_referencia]));
  const aloNames = new Map(alos.data.map(a => [a.id, a.nome]));
  return rows.data.map(row => ({ row, accountName: accountNames.get(row.destino.slice('meta_ads:'.length)) || '', aloName: aloNames.get(row.alo_id) || '' }));
}

async function showList(message) {
  notice(message || 'Carregando pacotes…', message ? 'ok' : 'info');
  let items;
  try {
    items = await loadPending();
  } catch {
    return route('Não foi possível ler os pacotes. Entre de novo.');
  }
  if (!message) notice('');
  const list = items.map(item => {
    let label = 'pacote';
    try { label = OPERATIONS[JSON.parse(item.row.conteudo).operation] || label; } catch { /* shown as invalid on open */ }
    return el('li', {}, el('button', { className: 'item', onclick: () => showDetail(item) },
      el('strong', {}, label),
      el('span', {}, `${item.accountName || item.row.destino.slice('meta_ads:'.length)} · enviado ${dateTime(item.row.criada_em)} · vence ${dateTime(item.row.expira_em)}`)));
  });
  show(el('section', {},
    el('div', { className: 'bar' }, el('h2', {}, 'Pacotes pendentes'),
      el('button', { onclick: () => showList() }, 'Atualizar'),
      el('button', { onclick: async () => { await sb.auth.signOut({ scope: 'local' }); route('Você saiu.'); } }, 'Sair')),
    list.length ? el('ul', { className: 'list' }, list) : el('p', { className: 'empty' }, 'Nenhum pacote aguardando sua decisão.')));
}

async function showDetail(item) {
  const { row } = item;
  const { pkg, hash, problems } = await checkRow(row);
  const sections = pkg ? describePackage(pkg, item) : [];
  const body = [el('button', { onclick: () => showList() }, '← Voltar à lista')];
  for (const section of sections) {
    body.push(el('section', { className: 'card' }, el('h3', {}, section.title),
      el('ul', { className: 'lines' }, section.lines.map(line => el('li', {}, line))),
      (section.previews || []).map(p => el('figure', { className: 'preview' },
        el('figcaption', {}, p.label),
        p.image ? el('img', { src: p.image, alt: `Imagem do ${p.label}` }) : null,
        el('ul', { className: 'lines' }, p.lines.map(line => el('li', {}, line))),
        p.warning ? el('p', { className: 'warning' }, p.warning) : null))));
  }
  body.push(el('section', { className: 'card' }, el('h3', {}, 'Hash do pacote (SHA-256)'), el('code', { className: 'hash' }, hash),
    el('p', { className: 'small' }, `Válido até ${dateTime(row.expira_em)}. Uma aprovação vale só para este pacote.`)));
  body.push(el('details', {}, el('summary', {}, 'Detalhe técnico completo'), el('pre', {}, pkg ? JSON.stringify(technicalView(pkg), null, 2) : row.conteudo)));
  if (problems.length) {
    body.push(el('section', { className: 'card error' }, el('h3', {}, 'Não é possível aprovar'), el('ul', {}, problems.map(p => el('li', {}, p)))));
    return show(...body);
  }
  const actions = el('div', { className: 'actions' });
  const decide = (kind) => {
    const verb = kind === 'approve' ? 'aprovar' : 'recusar';
    actions.replaceChildren(
      el('p', {}, `Confirmar: ${verb} somente este pacote (hash ${hash.slice(0, 12)}…)?`),
      el('button', { className: kind === 'approve' ? 'primary' : 'danger', onclick: async (event) => {
        event.currentTarget.disabled = true;
        if (!(await validUser())) {
          await sb.auth.signOut({ scope: 'local' });
          return showLogin('Sua sessão expirou. Entre de novo; nada foi aprovado.');
        }
        const fn = kind === 'approve' ? 'approve_meta_ads_package' : 'reject_meta_ads_package';
        const { error } = await sb.rpc(fn, { p_aprovacao_id: row.id, p_conteudo_sha256: hash });
        if (error) return showList().then(() => notice('O banco recusou: o pacote pode ter vencido, mudado ou já ter sido decidido. Nada foi feito.', 'error'));
        return showList(kind === 'approve' ? 'Pacote aprovado. Ele é executado sozinho em até cerca de 5 minutos e o aviso chega no seu WhatsApp.' : 'Pacote recusado.');
      } }, `Sim, ${verb}`),
      el('button', { onclick: () => actions.replaceChildren(approve, reject) }, 'Cancelar'));
  };
  const approve = el('button', { className: 'primary', onclick: () => decide('approve') }, 'Aprovo');
  const reject = el('button', { className: 'danger', onclick: () => decide('reject') }, 'Recusar');
  actions.append(approve, reject);
  body.push(actions);
  return show(...body);
}

function start() {
  if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(config.supabaseUrl || '') || !config.anonKey || !window.supabase) {
    notice('Página ainda não configurada para o banco. Nada pode ser aprovado.', 'error');
    return;
  }
  sb = window.supabase.createClient(config.supabaseUrl, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit', storageKey: 'empia-aprovar-de' },
  });
  sb.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') showLogin('Sua sessão terminou. Entre de novo.');
  });
  route();
}

start();
