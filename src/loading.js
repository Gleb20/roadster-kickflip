import {flipFrameAt} from './roadster-flip.js?v=2.4.1';

const screen = document.getElementById('loading-screen');
const game = document.getElementById('game');
const progress = document.getElementById('loading-progress');
const status = document.getElementById('loading-status');
const logs = document.getElementById('loading-logs');
const poses = [...screen.querySelectorAll('.loader-pose')];
const segments = [...screen.querySelectorAll('.loader-segment')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const bootTime = performance.now();
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
  const next = reducedMotion.matches ? 0 : flipFrameAt(((now - bootTime) % 2700) / 2700);
  if (next !== frame) {
    poses[frame].classList.remove('is-active');
    poses[next].classList.add('is-active');
    frame = next;
  }
  if (state === 'loading') animation = requestAnimationFrame(animate);
}
function stop() {
  cancelAnimationFrame(animation);
  clearInterval(logTimer);
  clearTimeout(timeout);
}
function fail() {
  if (state !== 'loading') return;
  state = 'failed';
  stop();
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
    stop();
    status.textContent = 'Flight systems ready.';
    // Let the first complete game frame paint beneath the opaque screen.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      screen.classList.add('is-leaving');
      const reveal = () => {
        const restoreFocus = screen.contains(document.activeElement);
        screen.hidden = true;
        game.inert = false;
        game.removeAttribute('aria-hidden');
        if (restoreFocus) document.getElementById('start').focus({preventScroll: true});
      };
      if (reducedMotion.matches) reveal();
      else setTimeout(reveal, 180);
    }));
  },
  fail,
};
timeout = setTimeout(fail, 30000);
animation = requestAnimationFrame(animate);
logTimer = setInterval(() => {
  if (!reducedMotion.matches) log(telemetry[logIndex++ % telemetry.length]);
}, 340);

// Start the tiny vector instrument before requesting the game's module graph.
import('./main.js?v=2.4.2').catch(fail);
