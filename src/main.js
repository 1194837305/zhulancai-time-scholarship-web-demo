const ASSETS = {
  campus: './public/assets/campus-time-stage.png',
  character: './public/assets/judy-placeholder.png',
};

const SAVE_KEY = 'zhulancai-web-save-v1';
const app = document.querySelector('#app');

const actions = [
  { id: 'class', icon: '课', name: '上课', subtitle: '课程与随堂推导', color: '#4f7bc5', energy: -12, chance: 72, effects: { academics: 12, pressure: 5 } },
  { id: 'research', icon: '研', name: '科研', subtitle: '博文杯方案打磨', color: '#bd6b6e', energy: -18, chance: 58, effects: { research: 15, pressure: 7 } },
  { id: 'anime', icon: '漫', name: '东西动漫社', subtitle: '分镜与活动筹备', color: '#9d6aae', energy: -12, chance: 66, effects: { campus: 10, affection: 3 } },
  { id: 'dance', icon: '舞', name: 'DK 街舞社', subtitle: '排练与舞台协作', color: '#d18e3b', energy: -14, chance: 61, effects: { campus: 12, stability: 4 } },
  { id: 'rest', icon: '休', name: '躺平', subtitle: '恢复体力，整理心绪', color: '#3b9a8c', energy: 26, chance: 100, effects: { pressure: -12, stability: 5 } },
  { id: 'quiz', icon: '题', name: '做题', subtitle: '三评委答题挑战', color: '#7960a8', energy: -14, chance: 86, effects: { academics: 8, research: 4 } },
];

const defaults = () => ({
  screen: 'training',
  turn: 0,
  academics: 25,
  research: 10,
  campus: 10,
  energy: 70,
  pressure: 20,
  affection: 10,
  stability: 55,
  judges: [18, 22, 14],
  last: null,
});

let state = load();

function load() {
  try {
    return { ...defaults(), ...JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') };
  } catch {
    return defaults();
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function stat(title, value, tone) {
  return `<div class="mini-stat" style="--tone:${tone}"><span>${title}</span><strong>${value}<b>/100</b></strong></div>`;
}

function shell(view) {
  return `
    <section class="game-shell" style="--stage-image:url('${ASSETS.campus}')">
      <div class="stage-bg"></div><div class="stage-wash"></div><div class="stage-grain"></div><div class="time-rings"></div>
      ${hud()}
      <div class="character-stage"><img src="${ASSETS.character}" alt="朱迪同学的临时立绘" /></div>
      ${view}
      ${nav()}
    </section>
    <aside class="rotate-tip"><b>↻</b><p>请将手机横过来。<br/>时序校准需要一张完整的舞台。</p></aside>`;
}

function hud() {
  const dots = Array.from({ length: 8 }, (_, index) => `<i class="turn-dot ${index < state.turn ? 'done' : ''} ${index === state.turn ? 'current' : ''}"></i>`).join('');
  return `<header class="hud">
    <div class="wordmark"><i class="wordmark-mark"></i><div><h1>猪栏菜：时序奖学金</h1><p>ZHULANCAI UNIVERSITY · TIME SCHOLARSHIP</p></div></div>
    <div class="hud-main"><div class="turn-track" aria-label="行动进度">${dots}</div><div class="hud-stat"><span>大一 · 春季校验</span><strong>${state.turn}/8 次行动</strong></div></div>
  </header>`;
}

function nav() {
  const items = [['training', '养成'], ['story', '剧情'], ['quiz', '答题'], ['review', '年审']];
  return `<nav class="bottom-nav" aria-label="游戏导航">${items.map(([id, label]) => `<button class="nav-button ${state.screen === id ? 'active' : ''}" data-screen="${id}">${label}</button>`).join('')}</nav>`;
}

function renderTraining() {
  const actionCards = actions.map((action, index) => `<button class="action-card" data-action="${action.id}" style="--card:${action.color};--delay:${80 + index * 55}ms"><i class="icon">${action.icon}</i><strong>${action.name}</strong><small>${action.subtitle}</small><footer>体力 ${action.energy > 0 ? '+' : ''}${action.energy} · ${action.chance}%</footer></button>`).join('');
  return shell(`<section class="scene-content"><div class="intro-ribbon"><i></i>时序校准档案 · 第 ${state.turn + 1} 行动格</div><div class="training-layout"><article class="training-board"><div class="board-heading"><div><h2>本周安排</h2><p>让朱迪同学把每一格时间活成奖学金的可能。</p></div><span class="year-stamp">奖学金审查线 48</span></div><div class="mini-stats">${stat('学业', state.academics, '#4f7bc5')}${stat('科研', state.research, '#d9676c')}${stat('校园活动', state.campus, '#9d6aae')}${stat('体力', state.energy, '#3b9a8c')}</div><div class="action-grid">${actionCards}</div></article><aside class="stage-note"><span>时序备注</span><p>校史正在被两条时间线同时改写。每次行动不仅改变分数，也会改变她是否愿意相信你。</p></aside></div></section>`);
}

function renderStory() {
  const text = state.turn <= 1 ? '我记得自己应该在另一座城市收拾毕业材料。可学生证上的入学年份、班级和你的名字都在告诉我：我现在是这里的大一新生。' : '刚刚那条时间线又闪了一下。要是奖学金校验失败，这里的档案会不会真的被擦掉？';
  return shell(`<section class="scene-content adv-view"><div class="adv-copy"><span class="chapter-tag">EP.01　异常的新生报到日</span><article class="dialogue-box"><strong class="speaker">朱迪</strong><p class="dialogue-text" data-typewrite="${text}"></p><span class="dialogue-hint">CLICK TO CHOOSE</span></article><div class="choice-row"><button class="choice-card" data-choice="trust"><strong>先听她把记忆里的时间线说完</strong><small>偏向信任与陪伴</small></button><button class="choice-card" data-choice="logic"><strong>把矛盾的日期逐项记入档案</strong><small>偏向理性整理</small></button></div></div></section>`);
}

function renderQuiz() {
  const tones = ['#d69a36', '#4f7bc5', '#3b9a8c'];
  const names = ['严谨委员', '实践委员', '时序委员'];
  const marks = ['Ⅰ', 'Ⅱ', 'Ⅲ'];
  return shell(`<section class="scene-content"><article class="quiz-panel"><span class="section-kicker">CHALLENGE · 三评委答题</span><h2>错位档案题</h2><p class="question">一份档案同时写着“已毕业”和“刚入学”。请说明你会怎样判断哪一条记录更接近真实时间线。</p><div class="judges">${state.judges.map((value, index) => `<section class="judge" style="--judge:${tones[index]}"><div class="judge-head"><i class="judge-mark">${marks[index]}</i>${names[index]}</div><small>注意力 ${value}/100</small><div class="meter"><i style="--value:${value}%"></i></div></section>`).join('')}</div><div class="strategy-row"><button class="strategy" data-strategy="logic">列条件并推导<br/>先给出可证伪的判断条件</button><button class="strategy" data-strategy="case">提出核验案例<br/>用具体步骤验证资料来源</button><button class="strategy" data-strategy="paradox">校验时间因果<br/>指出不能同时成立的时间顺序</button></div></article></section>`);
}

function renderReview() {
  const score = Math.round(state.academics * .38 + state.research * .28 + state.campus * .22 + state.stability * .12);
  const gates = [['学业', state.academics, 45], ['科研', state.research, 18], ['校园活动', state.campus, 10], ['时序稳定度', state.stability, 40]];
  const passed = score >= 48 && gates.every(([, value, min]) => value >= min);
  return shell(`<section class="scene-content"><article class="review-panel"><span class="section-kicker">ANNUAL REVIEW · 奖学金审查</span><h2>${passed ? '时间锚点暂时稳定' : '档案仍有修复余地'}</h2><div class="review-score"><strong>${score.toFixed(1)}</strong><span>/ 48.0　审查分</span></div><div class="gates">${gates.map(([name, value, min]) => `<div class="gate"><span>${value >= min ? '✓' : '○'} ${name}</span><b>${value} / ${min}</b></div>`).join('')}</div><button class="primary-cta" data-review-action="${passed ? 'advance' : 'back'}">${passed ? '确认通过，前往下一年' : '返回养成，继续修复时间线'}</button></article></section>`);
}

function renderResult() {
  const item = state.last;
  if (!item) { state.screen = 'training'; return renderTraining(); }
  const tone = item.success ? '#3b9a8c' : '#d9676c';
  return shell(`<section class="scene-content"><article class="result-panel" style="--result:${tone}"><div class="result-orbit">${item.success ? '✓' : '!'}</div><span class="section-kicker">ACTION RECORD · 第 ${state.turn} 格</span><h2>${item.title}</h2><p>${item.message}</p><div class="result-effects">${item.effects.map((effect) => `<span>${effect}</span>`).join('')}</div><button class="primary-cta" data-result-next>继续安排本周</button></article></section>`);
}

function render() {
  const views = { training: renderTraining, story: renderStory, quiz: renderQuiz, review: renderReview, result: renderResult };
  app.innerHTML = (views[state.screen] || renderTraining)();
  bind();
  const typed = document.querySelector('[data-typewrite]');
  if (typed) typewrite(typed, typed.dataset.typewrite);
}

function typewrite(node, text) {
  node.textContent = '';
  let index = 0;
  const timer = setInterval(() => {
    node.textContent += text[index] || '';
    index += 1;
    if (index >= text.length) clearInterval(timer);
  }, 22);
}

function bind() {
  document.querySelectorAll('[data-screen]').forEach((button) => button.addEventListener('click', () => { state.screen = button.dataset.screen; save(); render(); }));
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => perform(button.dataset.action)));
  document.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => choose(button.dataset.choice)));
  document.querySelectorAll('[data-strategy]').forEach((button) => button.addEventListener('click', () => strategy(button.dataset.strategy)));
  document.querySelector('[data-result-next]')?.addEventListener('click', () => { state.screen = state.turn >= 8 ? 'review' : 'training'; save(); render(); });
  document.querySelector('[data-review-action]')?.addEventListener('click', () => { if (state.turn >= 8) state = defaults(); else state.screen = 'training'; save(); render(); });
}

function perform(id) {
  const action = actions.find((entry) => entry.id === id);
  if (!action) return;
  if (id === 'quiz') { state.screen = 'quiz'; save(); render(); return; }
  const chance = Math.min(100, action.chance + Math.round((state.energy - 50) * .22) - Math.round(state.pressure * .12));
  const success = id === 'rest' || ((state.turn * 37 + state.energy * 3 + action.energy) % 100) < chance;
  state.turn = Math.min(8, state.turn + 1);
  state.energy = clamp(state.energy + action.energy);
  Object.entries(action.effects).forEach(([key, value]) => { state[key] = clamp(state[key] + (success ? value : Math.round(value * .35))); });
  if (!success) state.pressure = clamp(state.pressure + 9);
  const effectText = Object.entries(action.effects).map(([key, value]) => `${label(key)} ${value >= 0 ? '+' : ''}${success ? value : Math.round(value * .35)}`);
  state.last = { success, title: `${action.name} · ${success ? '顺利推进' : '出现偏差'}`, message: success ? `你们把这一格时间压进了正确的轨道。${action.subtitle}留下了可追溯的进展。` : `体力与压力让这次安排偏离了预期，但并非无事发生：下一格仍然可以调整。`, effects: [...effectText, `体力 ${action.energy >= 0 ? '+' : ''}${action.energy}`] };
  state.screen = state.turn === 1 ? 'story' : 'result';
  save(); render();
}

function choose(choice) {
  const trust = choice === 'trust';
  state.affection = clamp(state.affection + (trust ? 10 : 4));
  state.stability = clamp(state.stability + (trust ? 3 : 7));
  state.last = { success: true, title: '选择已写入档案', message: trust ? '朱迪把原本断裂的记忆讲给了你听。她第一次相信，这里或许不是一条绝路。' : '你们把冲突日期逐项钉进档案。混乱没有消失，但终于有了可以核对的坐标。', effects: [trust ? '好感 +10' : '好感 +4', trust ? '稳定度 +3' : '稳定度 +7'] };
  state.screen = 'result'; save(); render();
}

function strategy(type) {
  const changes = type === 'logic' ? [22, 7, 10] : type === 'case' ? [8, 22, 10] : [9, 8, 24];
  state.judges = state.judges.map((value, index) => clamp(value + changes[index]));
  const qualified = state.judges.filter((value) => value >= 60).length;
  if (qualified >= 2) {
    state.turn = Math.min(8, state.turn + 1);
    state.academics = clamp(state.academics + 11);
    state.research = clamp(state.research + 6);
    state.last = { success: true, title: '答题挑战通过', message: `有 ${qualified} 位评委认可了你的判断。异时档案没有被解释成奇谈，而是被拆成了可验证的因果链。`, effects: ['学业 +11', '科研 +6', '行动格 -1'] };
    state.screen = 'result';
  }
  save(); render();
}

function label(key) {
  return { academics: '学业', research: '科研', campus: '校园活动', energy: '体力', pressure: '压力', affection: '好感', stability: '稳定度' }[key] || key;
}

render();
