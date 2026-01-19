const content = {
    ca: {
        introTitle: "Hola! 👋",
        introDesc: "Anem a aprendre sobre les emocions. Mira les fotos i tria com es sent cada persona.",
        btnStart: "Començar",
        question: "Com es sent aquesta persona?",
        btnNext: "Següent",
        feedbackCorrect: "Molt bé!",
        feedbackCorrectSub: "Ho has aconseguit.",
        feedbackWrong: "Torna a intentar-ho",
        feedbackWrongSub: "Fixa't bé en la cara.",
        resultsTitle: "Fantàstic! 🏆",
        resultsDesc: "Has completat tota l'activitat.",
        btnRestart: "Tornar a jugar",
        scoreLabel: "Punts: ",
        emotions: {
            joy: "Alegria",
            sadness: "Tristesa",
            fear: "Por",
            anger: "Ira",
            frustration: "Frustració",
            surprise: "Sorpresa",
            calm: "Calma"
        }
    },
    es: {
        introTitle: "¡Hola! 👋",
        introDesc: "Vamos a aprender sobre las emociones. Mira las fotos y elige cómo se siente cada persona.",
        btnStart: "Empezar",
        question: "¿Cómo se siente esta persona?",
        btnNext: "Siguiente",
        feedbackCorrect: "¡Muy bien!",
        feedbackCorrectSub: "Lo has conseguido.",
        feedbackWrong: "Vuelve a intentarlo",
        feedbackWrongSub: "Fíjate bien en la cara.",
        resultsTitle: "¡Fantástico! 🏆",
        resultsDesc: "Has completado toda la actividad.",
        btnRestart: "Volver a jugar",
        scoreLabel: "Puntos: ",
        emotions: {
            joy: "Alegría",
            sadness: "Tristeza",
            fear: "Miedo",
            anger: "Ira",
            frustration: "Frustración",
            surprise: "Sorpresa",
            calm: "Calma"
        }
    }
};

const scenarios = [
    { id: 'joy', img: 'alegria.png', correct: 'joy', distractor1: 'fear', distractor2: 'anger' },
    { id: 'sadness', img: 'tristesa.png', correct: 'sadness', distractor1: 'calm', distractor2: 'surprise' },
    { id: 'anger', img: 'ira.png', correct: 'anger', distractor1: 'joy', distractor2: 'calm' },
    { id: 'fear', img: 'por.png', correct: 'fear', distractor1: 'surprise', distractor2: 'sadness' },
    { id: 'frustration', img: 'frustracio.png', correct: 'frustracio', distractor1: 'calm', distractor2: 'joy' },
    { id: 'surprise', img: 'sorpresa.png', correct: 'surprise', distractor1: 'fear', distractor2: 'anger' },
    { id: 'calm', img: 'calma.png', correct: 'calm', distractor1: 'sadness', distractor2: 'frustracio' }
];

// Mapping IDs for content object
const idMap = {
    joy: 'joy',
    sadness: 'sadness',
    fear: 'fear',
    anger: 'anger',
    frustracio: 'frustration',
    surprise: 'surprise',
    calm: 'calm'
};

let currentLang = 'ca';
let currentScenarioIndex = 0;
let score = 0;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const soundFile = type === 'success' ? 'success.mp3' : 'error.mp3';
    const audio = new Audio(soundFile);
    audio.play().catch(e => console.log("Audio play prevented", e));
}

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('btn-ca').classList.toggle('active', lang === 'ca');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    updateStaticText();
    if (document.getElementById('screen-game').classList.contains('active')) {
        renderScenario();
    }
}

window.setLanguage = setLanguage;

function updateStaticText() {
    const t = content[currentLang];
    document.getElementById('intro-title').innerText = t.introTitle;
    document.getElementById('intro-desc').innerText = t.introDesc;
    document.getElementById('btn-start-text').innerText = t.btnStart;
    document.getElementById('scenario-question').innerText = t.question;
    document.getElementById('btn-next').innerText = t.btnNext;
    document.getElementById('btn-restart').innerText = t.btnRestart;
    document.getElementById('results-title').innerText = t.resultsTitle;
    document.getElementById('results-desc').innerText = t.resultsDesc;
    updateScoreUI();
}

function updateScoreUI() {
    document.getElementById('score-text').innerText = `${content[currentLang].scoreLabel}${score}`;
}

function startGame() {
    score = 0;
    currentScenarioIndex = 0;
    showScreen('screen-game');
    renderScenario();
    updateScoreUI();
}
window.startGame = startGame;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function renderScenario() {
    const scenario = scenarios[currentScenarioIndex];
    const t = content[currentLang];
    
    document.getElementById('scenario-image').src = scenario.img;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    // Create a list of choices and shuffle
    const choices = [scenario.correct, scenario.distractor1, scenario.distractor2];
    choices.sort(() => Math.random() - 0.5);

    choices.forEach(choiceId => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        const label = t.emotions[idMap[choiceId]];
        
        // Add a placeholder "pictogram" emoji/icon for TEA support
        const icons = {
            joy: '😊', sadness: '😢', fear: '😨', anger: '😠',
            frustracio: '😫', surprise: '😮', calm: '😌'
        };

        btn.innerHTML = `<span>${icons[choiceId]}</span> <span>${label}</span>`;
        btn.onclick = () => checkAnswer(choiceId === scenario.correct);
        optionsContainer.appendChild(btn);
    });

    const progress = ((currentScenarioIndex) / scenarios.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function checkAnswer(isCorrect) {
    const feedbackOverlay = document.getElementById('feedback');
    const fTitle = document.getElementById('feedback-text');
    const fSub = document.getElementById('feedback-subtext');
    const fIcon = document.getElementById('feedback-icon');
    const t = content[currentLang];

    if (isCorrect) {
        score += 10;
        fTitle.innerText = t.feedbackCorrect;
        fSub.innerText = t.feedbackCorrectSub;
        fIcon.innerText = '🌟';
        playSound('success');
        document.getElementById('btn-next').style.display = 'block';
    } else {
        fTitle.innerText = t.feedbackWrong;
        fSub.innerText = t.feedbackWrongSub;
        fIcon.innerText = '🧐';
        playSound('error');
        document.getElementById('btn-next').style.display = 'none';
        // Give a small delay and hide to let them try again
        setTimeout(() => {
            if (feedbackOverlay.classList.contains('show') && document.getElementById('btn-next').style.display === 'none') {
                feedbackOverlay.classList.remove('show');
            }
        }, 2000);
    }

    feedbackOverlay.classList.add('show');
    updateScoreUI();
}

function nextScenario() {
    document.getElementById('feedback').classList.remove('show');
    currentScenarioIndex++;
    if (currentScenarioIndex < scenarios.length) {
        renderScenario();
    } else {
        showResults();
    }
}
window.nextScenario = nextScenario;

function showResults() {
    showScreen('screen-results');
    document.getElementById('final-score').innerText = `${score} pts`;
    document.getElementById('progress-fill').style.width = `100%`;
}

function restartGame() {
    startGame();
}
window.restartGame = restartGame;

function speakCurrentQuestion() {
    const t = content[currentLang];
    const text = t.question;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'ca' ? 'ca-ES' : 'es-ES';
    window.speechSynthesis.speak(utterance);
}
window.speakCurrentQuestion = speakCurrentQuestion;

// Initial Setup
updateStaticText();