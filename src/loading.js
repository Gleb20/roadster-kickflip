import {flipFrameAt} from './roadster-flip.js?v=4.7.0';

const screen = document.getElementById('loading-screen');
const game = document.getElementById('game');
const progress = document.getElementById('loading-progress');
const status = document.getElementById('loading-status');
const logs = document.getElementById('loading-logs');
const poses = [...screen.querySelectorAll('.loader-pose')];
const segments = [...screen.querySelectorAll('.loader-segment')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const bootTime = performance.now();
const visitKey = 'roadster-materials-ready-v1';
let returning = false;
try { returning = localStorage.getItem(visitKey) === '1'; } catch {}
// A short grace period prevents a loader flash on a ready/cached navigation.
const appearDelay = 180, firstVisitDuration = 3000;
let shownAt = null, showTimer, presentationTimer;
const telemetry = [
  'RCS :: discover thruster bus / address 0x04',
  'RCS :: bind fore / aft nozzle pairs',
  'ROLL :: map attitude solver / 9 keyframes',
  'RCS :: zero gimbal offsets / nominal',
  'CTRL :: sync pulse-width modulation / standby',
  'RCS :: prime cold-gas manifold / simulated',
  'ROLL :: align inertial frame / calibration',
  'CTRL :: hold ignition interlock / awaiting materials',
];
let state = 'loading', frame = 0, animation, logTimer, timeout, count = 0, logIndex = 0;

function log(message) {
  const line = document.createElement('span');
  line.textContent = `[${((performance.now() - bootTime) / 1000).toFixed(3).padStart(6, '0')}] ${message}`;
  logs.append(line);
  while (logs.children.length > 5) logs.firstElementChild.remove();
}
function animate(now) {
  const next = reducedMotion.matches ? 0 : document.hidden ? frame : flipFrameAt(((now - shownAt) % 2700) / 2700);
  if (next !== frame) {
    poses[frame].classList.remove('is-active');
    poses[next].classList.add('is-active');
    frame = next;
  }
  if (state === 'loading' || state === 'ready') animation = requestAnimationFrame(animate);
}
function stop() {
  cancelAnimationFrame(animation);
  clearInterval(logTimer);
  clearTimeout(timeout);
  clearTimeout(showTimer);
  clearTimeout(presentationTimer);
}
function fail() {
  if (state !== 'loading') return;
  state = 'failed';
  stop();
  show();
  screen.classList.add('has-error');
  document.getElementById('loading-title').textContent = 'Loading failed';
  status.textContent = 'The artwork could not load. Check your connection and retry.';
  log('BOOT :: material link failed / retry required');
  document.getElementById('loading-retry').hidden = false;
}

// Preload begins in HTML; inserting the actual stylesheet here lets us observe
// success/error reliably without a parser-blocking stylesheet delaying first paint.
const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = document.getElementById('game-style').href;
const stylesReady = new Promise((resolve, reject) => {
  stylesheet.onload = resolve;
  stylesheet.onerror = reject;
  document.head.append(stylesheet);
});
// Attach the rejection handler now, even if the game module graph is still loading.
stylesReady.catch(fail);

export const loading = {
  stylesReady,
  async load(materials) {
    // Count decoded/baked material sets, not elapsed time or invented byte percentages.
    const total = materials.length;
    progress.max = total;
    await Promise.all(materials.map(async ({name, load}) => {
      await load();
      if (state !== 'loading') return;
      count++;
      progress.value = count;
      const percent = Math.floor(count / total * 100);
      progress.textContent = `${percent}%`;
      document.getElementById('loading-count').textContent = `MATERIALS ${String(count).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      document.getElementById('loading-percent').textContent = `${percent}%`;
      segments.forEach((segment, i) => segment.classList.toggle('is-filled', i < Math.floor(count / total * segments.length)));
      log(`MATERIAL :: ${name} / ready`);
      status.textContent = `Materials ready: ${count} of ${total}`;
    }));
    return state === 'loading';
  },
  finish() {
    if (state !== 'loading') return;
    state = 'ready';
    clearTimeout(timeout);
    clearTimeout(showTimer);
    status.textContent = 'Flight systems ready.';
    // A stored visit is only an intro preference; resource readiness still comes
    // from load/decode/bake and the complete first scene prepared by main.js.
    const firstVisit = !returning && !materialsFromCache();
    try { localStorage.setItem(visitKey, '1'); } catch {}
    if (firstVisit) show();
    const remaining = shownAt === null ? 0 : Math.max(0,
      (firstVisit ? firstVisitDuration : 220) - (performance.now() - shownAt));
    presentationTimer = setTimeout(reveal, remaining);
  },
  fail,
};
// Resource Timing describes the actual image/style responses, including a
// first visit whose resources were already cached by an older game version.
function materialsFromCache() {
  const resources = performance.getEntriesByType('resource').filter(entry =>
    entry.initiatorType === 'img' || entry.name === stylesheet.href);
  return resources.length >= 12 && resources.every(entry =>
    entry.transferSize === 0 && entry.decodedBodySize > 0);
}
function show() {
  if (shownAt !== null) return;
  shownAt = Number(screen.dataset.shownAt) || performance.now();
  screen.classList.add('is-visible');
  screen.removeAttribute('aria-hidden');
  if (state !== 'failed') animation = requestAnimationFrame(animate);
}
function reveal() {
  stop();
  state = 'done';
  const complete = () => {
    const restoreFocus = screen.contains(document.activeElement);
    screen.hidden = true;
    game.inert = false;
    game.removeAttribute('aria-hidden');
    game.dispatchEvent(new Event('tesla-ready'));
    if (restoreFocus) document.getElementById('start').focus({preventScroll: true});
  };
  // The complete scene is already prepared; cached/fast starts skip both fades.
  if (shownAt === null) complete();
  else {
    screen.classList.add('is-leaving');
    if (reducedMotion.matches) complete();
    else setTimeout(complete, 180);
  }
}
if (screen.classList.contains('is-visible')) show();
timeout = setTimeout(fail, 30000);
showTimer = setTimeout(() => {
  if (state === 'loading' && !materialsFromCache()) show();
}, appearDelay);
logTimer = setInterval(() => {
  if (shownAt !== null && !document.hidden && !reducedMotion.matches) {
    log(state === 'ready' ? 'CTRL :: flight systems ready / awaiting pilot' : telemetry[logIndex++ % telemetry.length]);
  }
}, 340);

// Start the tiny vector instrument before requesting the game's module graph.
import('./main.js?v=4.7.0').catch(fail);
