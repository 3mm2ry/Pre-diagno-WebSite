/* ===================================================
   Pre-Diagno — Static Website Script
   =================================================== */

/* ---------- NAV SCROLL ---------- */
(function () {
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  /* hamburger */
  var ham = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  ham.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
  });
})();

/* ---------- SCROLL REVEAL ---------- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { obs.observe(el); });
})();

/* ---------- EVALUATION CHART (Chart.js) ---------- */
window.addEventListener('DOMContentLoaded', function () {
  var ctx = document.getElementById('evalChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Strong Agreement', 'Moderate Agreement', 'Weak Agreement', 'Very Weak'],
      datasets: [{
        data: [62, 24, 10, 4],
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e', '#94a3b8'],
        borderWidth: 3, borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { family: "'Inter',sans-serif", size: 12 } } },
        tooltip: { callbacks: { label: function (c) { return ' ' + c.label + ': ' + c.parsed + '%'; } } }
      }
    }
  });
});

/* ---------- CHATBOT (fully embedded) ---------- */
(function () {

  /* ---- Medical case dataset (40 representative cases) ---- */
  var CASES = [
    { symptoms: ['chest pain', 'shortness of breath', 'sweating', 'nausea'], disease: 'Heart Attack', level: 1 },
    { symptoms: ['difficulty breathing', 'severe chest tightness', 'wheezing'], disease: 'Acute Asthma Attack', level: 1 },
    { symptoms: ['high fever', 'stiff neck', 'severe headache', 'sensitivity to light'], disease: 'Meningitis', level: 1 },
    { symptoms: ['sudden severe headache', 'vomiting', 'loss of consciousness'], disease: 'Stroke', level: 1 },
    { symptoms: ['high fever', 'rapid heartbeat', 'confusion', 'low blood pressure'], disease: 'Sepsis', level: 1 },
    { symptoms: ['severe abdominal pain', 'rigid abdomen', 'vomiting blood'], disease: 'Internal Bleeding', level: 1 },
    { symptoms: ['fever', 'cough', 'shortness of breath', 'chest pain'], disease: 'Pneumonia', level: 2 },
    { symptoms: ['chest pain', 'irregular heartbeat', 'dizziness'], disease: 'Angina', level: 2 },
    { symptoms: ['severe allergic reaction', 'swelling', 'hives', 'throat tightening'], disease: 'Anaphylaxis', level: 2 },
    { symptoms: ['seizures', 'uncontrollable shaking', 'loss of awareness'], disease: 'Epileptic Seizure', level: 2 },
    { symptoms: ['severe burns', 'blistering skin', 'pain'], disease: 'Second Degree Burns', level: 2 },
    { symptoms: ['abdominal pain', 'fever', 'nausea', 'vomiting'], disease: 'Appendicitis', level: 2 },
    { symptoms: ['moderate fever', 'cough', 'sore throat', 'runny nose', 'body ache'], disease: 'Influenza', level: 3 },
    { symptoms: ['headache', 'fever', 'fatigue', 'joint pain'], disease: 'Dengue Fever', level: 3 },
    { symptoms: ['persistent cough', 'fatigue', 'night sweats', 'weight loss'], disease: 'Tuberculosis', level: 3 },
    { symptoms: ['fever', 'rash', 'joint pain'], disease: 'Chikungunya', level: 3 },
    { symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps'], disease: 'Gastroenteritis', level: 3 },
    { symptoms: ['urinary burning', 'frequent urination', 'pelvic pain'], disease: 'Urinary Tract Infection', level: 3 },
    { symptoms: ['mild headache', 'nasal congestion', 'sneezing'], disease: 'Common Cold', level: 4 },
    { symptoms: ['mild fever', 'slight cough', 'mild fatigue'], disease: 'Upper Respiratory Tract Infection', level: 4 },
    { symptoms: ['skin rash', 'itching', 'mild swelling'], disease: 'Allergic Dermatitis', level: 4 },
    { symptoms: ['toothache', 'jaw pain', 'mild fever'], disease: 'Dental Abscess', level: 4 },
    { symptoms: ['ear pain', 'ear discharge', 'mild hearing loss'], disease: 'Ear Infection', level: 4 },
    { symptoms: ['minor cut', 'mild bleeding'], disease: 'Minor Laceration', level: 4 },
    { symptoms: ['mild anxiety', 'stress', 'difficulty sleeping'], disease: 'Anxiety', level: 5 },
    { symptoms: ['routine checkup', 'no symptoms', 'general wellness'], disease: 'Routine Visit', level: 5 },
    { symptoms: ['mild back pain', 'stiffness'], disease: 'Muscle Strain', level: 5 },
    { symptoms: ['minor bruise', 'pain from fall'], disease: 'Minor Contusion', level: 5 },
    { symptoms: ['cough', 'sore throat'], disease: 'Pharyngitis', level: 4 },
    { symptoms: ['fever', 'muscle aches', 'headache'], disease: 'Viral Syndrome', level: 3 },
    { symptoms: ['high blood pressure', 'severe headache', 'blurred vision'], disease: 'Hypertensive Crisis', level: 2 },
    { symptoms: ['chest tightness', 'coughing', 'wheezing at night'], disease: 'Chronic Asthma', level: 3 },
    { symptoms: ['sharp chest pain', 'deep breathing worsens pain'], disease: 'Pleuritis', level: 3 },
    { symptoms: ['sudden vision loss', 'eye pain'], disease: 'Acute Glaucoma', level: 2 },
    { symptoms: ['palpitations', 'lightheadedness', 'shortness of breath'], disease: 'Arrhythmia', level: 2 },
    { symptoms: ['blood in urine', 'lower back pain', 'fever'], disease: 'Kidney Infection', level: 3 },
    { symptoms: ['yellow skin', 'yellow eyes', 'dark urine'], disease: 'Jaundice / Hepatitis', level: 2 },
    { symptoms: ['numbness', 'tingling in arms or legs'], disease: 'Peripheral Neuropathy', level: 4 },
    { symptoms: ['confusion', 'disorientation', 'memory loss'], disease: 'Cognitive Disturbance', level: 2 },
    { symptoms: ['severe dizziness', 'spinning sensation', 'vomiting'], disease: 'Vertigo', level: 3 }
  ];

  function matchCase(text) {
    var lower = text.toLowerCase();
    var best = null, bestScore = 0;
    CASES.forEach(function (c) {
      var score = 0;
      c.symptoms.forEach(function (s) { if (lower.indexOf(s) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = c; }
    });
    if (bestScore === 0) return null;
    return best;
  }

  /* ---- Conversation flow ---- */
  var STEPS = [
    'greeting', 'patient_type', 'age_gender', 'chronic', 'smoker', 'vitals', 'symptoms'
  ];

  function getState() { return JSON.parse(sessionStorage.getItem('prediagno_state') || 'null'); }
  function saveState(s) { sessionStorage.setItem('prediagno_state', JSON.stringify(s)); }

  function initialState() {
    return { step: 'patient_type', data: {} };
  }

  function getBotResponse(userMsg, state) {
    var msg = userMsg.trim().toLowerCase();
    var reply = '', triageLevel = null, disease = null;
    var nextStep = state.step;

    switch (state.step) {
      case 'patient_type':
        state.data.patientType = msg;
        reply = 'Thank you. May I know the patient\'s age and gender? (e.g., "28 male" or "45 female")';
        nextStep = 'age_gender';
        break;

      case 'age_gender':
        state.data.ageGender = msg;
        reply = 'Do you or the patient have any chronic diseases? (e.g., diabetes, hypertension, asthma — or type "none")';
        nextStep = 'chronic';
        break;

      case 'chronic':
        state.data.chronic = msg;
        reply = 'Is the patient a smoker? (yes / no)';
        nextStep = 'smoker';
        break;

      case 'smoker':
        state.data.smoker = msg;
        reply = 'Please describe the current vital signs if known, such as temperature, heart rate, or blood pressure. Type "unknown" to skip.';
        nextStep = 'vitals';
        break;

      case 'vitals':
        state.data.vitals = msg;
        reply = 'Please describe the main symptoms in detail. Include onset, duration, and severity.';
        nextStep = 'symptoms';
        break;

      case 'symptoms':
        var result = matchCase(userMsg);
        if (result) {
          triageLevel = result.level;
          disease = result.disease;
          var levelDescriptions = ['', 'Immediate — life-threatening', 'Emergent — urgent attention', 'Urgent — seen soon', 'Semi-urgent', 'Non-urgent'];
          var advice = {
            1: 'CRITICAL: Call emergency services immediately (999). Do not wait.',
            2: 'URGENT: Go to the emergency department right away.',
            3: 'Please visit the hospital or clinic within 30–60 minutes.',
            4: 'You should see a doctor today at a clinic or outpatient department.',
            5: 'Schedule an appointment at your convenience. Monitor symptoms.'
          };
          reply = 'Based on your symptoms, I\'ve assessed the following:\n\n'
            + '🔍 Suspected condition: ' + disease + '\n'
            + '⚠️ Triage Level ' + triageLevel + ' — ' + levelDescriptions[triageLevel] + '\n\n'
            + '📋 Recommendation: ' + advice[triageLevel] + '\n\n'
            + 'This is a preliminary AI assessment only. Always seek professional medical evaluation.';
        } else {
          reply = 'I could not match your symptoms to a known pattern. Please provide more detail or visit the nearest healthcare facility immediately.';
        }
        nextStep = 'done';
        break;

      case 'done':
        reply = 'If you have new symptoms to assess, please reset the conversation using the refresh button and start again.';
        break;

      default:
        reply = 'Please describe your symptoms so I can help assess your condition.';
    }

    state.step = nextStep;
    return { reply: reply, triageLevel: triageLevel, disease: disease, state: state };
  }

  /* ---- DOM manipulation ---- */
  var messagesEl = document.getElementById('chat-messages');
  var inputEl = document.getElementById('chat-input');
  var sendBtn = document.getElementById('chat-send');
  var resetBtn = document.getElementById('chat-reset');

  if (!messagesEl) return;

  function scrollDown() { messagesEl.scrollTop = messagesEl.scrollHeight; }

  function appendMsg(role, text) {
    var row = document.createElement('div');
    row.className = 'msg-row ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble ' + role;
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollDown();
  }

  function appendTyping() {
    var row = document.createElement('div');
    row.className = 'msg-row bot';
    row.id = 'typing-indicator';
    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble bot msg-typing';
    bubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollDown();
    return row;
  }

  function appendTriage(level, disease) {
    var row = document.createElement('div');
    row.className = 'triage-badge';
    var icons = ['', '🚨', '⚠️', '🟡', '🔵', '🟢'];
    var pill = document.createElement('span');
    pill.className = 'triage-pill triage-' + level;
    pill.innerHTML = icons[level] + ' Triage Level ' + level + (disease ? ' — Suspected: ' + disease : '');
    row.appendChild(pill);
    messagesEl.appendChild(row);
    scrollDown();
  }

  function setLoading(on) {
    sendBtn.disabled = on;
    inputEl.disabled = on;
  }

  function resetChat() {
    messagesEl.innerHTML = '';
    var state = initialState();
    saveState(state);
    appendMsg('bot', 'Hello. I am the Pre-Diagno AI assistant. Are you the patient, or are you contacting on behalf of someone else?');
  }

  resetBtn.addEventListener('click', function () { resetChat(); });

  function handleSend() {
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    appendMsg('user', text);
    setLoading(true);

    var state = getState() || initialState();
    var typing = appendTyping();

    setTimeout(function () {
      typing.remove();
      var result = getBotResponse(text, state);
      saveState(result.state);
      appendMsg('bot', result.reply);
      if (result.triageLevel) appendTriage(result.triageLevel, result.disease);
      setLoading(false);
      inputEl.focus();
    }, 600 + Math.random() * 500);
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });

  /* init */
  resetChat();

})();
