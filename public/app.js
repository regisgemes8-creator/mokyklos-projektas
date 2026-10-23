const form = document.querySelector('#generator-form');
const requestField = document.querySelector('#request');
const reasonField = document.querySelector('#reason');
const generateButton = document.querySelector('#generate-button');
const results = document.querySelector('#results');
const errorMessage = document.querySelector('#error-message');
const modeBadge = document.querySelector('#mode-badge');
const editButton = document.querySelector('#edit-button');
let latestResults = null;

const examples = {
  work: {
    request: 'Kolega prašo, kad šią savaitę perimčiau dar vieną užduotį, bet mano darbų sąrašas jau pilnas.',
    relationship: 'Kolegui', channel: 'Žinutė', tone: 'Subalansuotas',
    reason: 'Šią savaitę jau turiu suplanuotų darbų.'
  },
  plans: {
    request: 'Draugė kviečia šeštadienį į vakarėlį, bet norėčiau likti namie ir pailsėti.',
    relationship: 'Draugui / draugei', channel: 'Žinutė', tone: 'Šiltas',
    reason: 'Man reikia ramaus vakaro sau.'
  },
  favor: {
    request: 'Pažįstamas prašo padėti persikraustyti visą šeštadienį, tačiau negaliu skirti tiek laiko.',
    relationship: 'Pažįstamam', channel: 'Žinutė', tone: 'Tvirtas, bet mandagus',
    reason: 'Šeštadienį turiu kitų planų.'
  }
};

async function checkStatus() {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    if (data.mode === 'live') {
      modeBadge.classList.add('live');
      modeBadge.innerHTML = '<span class="status-dot"></span> AI prijungtas';
      modeBadge.title = `Modelis: ${data.model}`;
    } else {
      modeBadge.innerHTML = '<span class="status-dot"></span> Pavyzdinis režimas';
      modeBadge.title = 'Prijunk API raktą, kad naudotum gyvą AI.';
    }
  } catch {
    modeBadge.innerHTML = '<span class="status-dot"></span> Vietinis pavyzdys';
    modeBadge.title = 'Paleisk projektą su npm start.';
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function displayResults(data) {
  latestResults = data;
  document.querySelector('#result-gentle').textContent = data.gentle;
  document.querySelector('#result-balanced').textContent = data.balanced;
  document.querySelector('#result-firm').textContent = data.firm;
  document.querySelector('#result-tip').textContent = data.tip || 'Gali būti malonus ir kartu išsaugoti savo ribas.';
  document.querySelector('#result-mode-note').textContent = data.demo
    ? 'Tai pavyzdinis režimas su paruoštais atsakymų šablonais. Pridėk API raktą, kad atsakymus kurtų AI pagal tavo situaciją.'
    : 'Atsakymus sugeneravo AI. Prieš siųsdamas perskaityk ir pritaikyk juos sau.';
  results.classList.remove('hidden');
  results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMessage.classList.add('hidden');
  results.classList.add('hidden');
  if (requestField.value.trim().length < 4) {
    showError('Trumpai aprašyk, ko tavęs prašo.');
    requestField.focus();
    return;
  }

  const payload = {
    request: requestField.value.trim(),
    relationship: document.querySelector('#relationship').value,
    channel: document.querySelector('#channel').value,
    tone: document.querySelector('input[name="tone"]:checked').value,
    reason: reasonField.value.trim()
  };
  const buttonText = generateButton.querySelector('.button-text');
  generateButton.disabled = true;
  buttonText.textContent = 'Kuriami atsakymai…';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Nepavyko sukurti atsakymų. Pabandyk dar kartą.');
    displayResults(data);
  } catch (error) {
    showError(error.message || 'Nepavyko pasiekti serverio. Patikrink, ar svetainė paleista su komanda npm start.');
  } finally {
    generateButton.disabled = false;
    buttonText.textContent = 'Sukurti atsakymus';
  }
});

document.querySelectorAll('.tone-option input').forEach((input) => {
  input.addEventListener('change', () => {
    document.querySelectorAll('.tone-option').forEach((label) => label.classList.toggle('selected', label.querySelector('input').checked));
  });
});

document.querySelectorAll('.example-card').forEach((card) => {
  card.addEventListener('click', () => {
    const example = examples[card.dataset.example];
    if (!example) return;
    requestField.value = example.request;
    document.querySelector('#relationship').value = example.relationship;
    document.querySelector('#channel').value = example.channel;
    document.querySelector(`input[name="tone"][value="${example.tone}"]`).checked = true;
    document.querySelectorAll('.tone-option').forEach((label) => label.classList.toggle('selected', label.querySelector('input').checked));
    reasonField.value = example.reason;
    document.querySelector('#generatorius').scrollIntoView({ behavior: 'smooth' });
    requestField.focus({ preventScroll: true });
  });
});

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    if (!latestResults) return;
    const key = button.dataset.copy;
    const original = button.innerHTML;
    try {
      await navigator.clipboard.writeText(latestResults[key]);
      button.textContent = 'Nukopijuota ✓';
    } catch {
      const range = document.createRange();
      const target = document.querySelector(`#result-${key}`);
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Pažymėta — kopijuok';
    }
    setTimeout(() => { button.innerHTML = original; }, 1800);
  });
});

editButton.addEventListener('click', () => {
  results.classList.add('hidden');
  requestField.focus();
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#year').textContent = new Date().getFullYear();
checkStatus();
