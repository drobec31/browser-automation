const TOTAL_STEPS = 12;
let currentStep = 1;

const state = {
  firstName: '', lastName: '', phone: '',    company: '',
  role: '',      teamSize: '', challenge: '', goals: [],
  referral: '',  tools: [],    timeline: '',  feature: ''
};

const stepKey = {
  1: 'firstName', 2: 'lastName',  3: 'phone',    4: 'company',
  5: 'role',      6: 'teamSize',  7: 'challenge', 8: 'goals',
  9: 'referral',  10: 'tools',    11: 'timeline', 12: 'feature'
};

function getStepEl(n) {
  return document.getElementById(n === 'thanks' ? 'step-thanks' : `step-${n}`);
}

function updateUI(n) {
  document.getElementById('progressFill').style.width = `${(n / TOTAL_STEPS) * 100}%`;
  document.getElementById('stepCounter').textContent = `${n} of ${TOTAL_STEPS}`;
  const backBtn = getStepEl(n).querySelector('.btn-back');
  if (backBtn) backBtn.classList.toggle('hidden', n === 1);
}

function restoreAnswers(n) {
  const key = stepKey[n];
  if (!key) return;
  const val = state[key];
  if (n === 8 || n === 10) {
    getStepEl(n).querySelectorAll('.chip').forEach(c =>
      c.classList.toggle('selected', val.includes(c.dataset.value))
    );
  } else if (n >= 5) {
    getStepEl(n).querySelectorAll('.choice').forEach(c =>
      c.classList.toggle('selected', c.dataset.value === val)
    );
  } else {
    const input = getStepEl(n).querySelector('.text-input');
    if (input) input.value = val;
  }
}

function goTo(n, dir) {
  const outEl = getStepEl(currentStep);
  const inEl  = getStepEl(n);
  const outClass = dir === 'forward' ? 'slide-out-forward'  : 'slide-out-backward';
  const inClass  = dir === 'forward' ? 'slide-in-forward'   : 'slide-in-backward';

  outEl.classList.add(outClass);
  outEl.addEventListener('animationend', () => {
    outEl.classList.remove('active', outClass);
  }, { once: true });

  inEl.classList.add('active', inClass);
  inEl.addEventListener('animationend', () => {
    inEl.classList.remove(inClass);
  }, { once: true });

  currentStep = n;
  updateUI(n);
  restoreAnswers(n);
}

function validate(n) {
  if (n === 8 || n === 10) {
    const container = getStepEl(n).querySelector('.chips');
    const ok = [...container.querySelectorAll('.chip')].some(c => c.classList.contains('selected'));
    if (!ok) { shake(container); return false; }
  } else if (n >= 5) {
    const container = getStepEl(n).querySelector('.choices');
    const ok = [...container.querySelectorAll('.choice')].some(c => c.classList.contains('selected'));
    if (!ok) { shake(container); return false; }
  } else {
    const input = getStepEl(n).querySelector('.text-input');
    const val = input.value.trim();
    if (!val) { shake(input); return false; }
    if (n === 3 && !/^\+?[\d\s\-(). ]{7,}$/.test(val)) { shake(input); return false; }
  }
  return true;
}

function saveAnswer(n) {
  const key = stepKey[n];
  if (n === 8 || n === 10) {
    state[key] = [...getStepEl(n).querySelectorAll('.chip.selected')].map(c => c.dataset.value);
  } else if (n >= 5) {
    const sel = getStepEl(n).querySelector('.choice.selected');
    state[key] = sel ? sel.dataset.value : '';
  } else {
    state[key] = getStepEl(n).querySelector('.text-input').value.trim();
  }
}

function shake(el) {
  el.classList.remove('error-shake');
  void el.offsetWidth;
  el.classList.add('error-shake');
  el.addEventListener('animationend', () => el.classList.remove('error-shake'), { once: true });
}

function showThanks() {
  const outEl = getStepEl(currentStep);
  const inEl  = getStepEl('thanks');
  outEl.classList.add('slide-out-forward');
  outEl.addEventListener('animationend', () => {
    outEl.classList.remove('active', 'slide-out-forward');
  }, { once: true });
  inEl.classList.add('active', 'slide-in-forward');
  inEl.addEventListener('animationend', () => {
    inEl.classList.remove('slide-in-forward');
  }, { once: true });
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('stepCounter').textContent = '';
  document.getElementById('thanksMessage').textContent =
    `Welcome to Velo, ${state.firstName}. We'll be in touch.`;
  console.log('Velo onboarding complete:', state);
}

function goNext() {
  if (!validate(currentStep)) return;
  saveAnswer(currentStep);
  if (currentStep === TOTAL_STEPS) { showThanks(); return; }
  goTo(currentStep + 1, 'forward');
}

function goBack() {
  if (currentStep === 1) return;
  goTo(currentStep - 1, 'backward');
}

// Single-select choice wiring
document.querySelectorAll('.choices').forEach(group => {
  group.addEventListener('click', e => {
    const btn = e.target.closest('.choice');
    if (!btn) return;
    group.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Multi-select chip wiring
document.querySelectorAll('.chips').forEach(group => {
  group.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('selected');
  });
});

// Init
updateUI(1);
