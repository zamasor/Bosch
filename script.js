// JAVASCRIPT CYBERPUNK PORTFOLIO - RENATO VALENTIN CACHUBA (ZAMASOR)

// Web Audio API Synth Generator
class CyberSound {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.05) {
        if (!this.enabled) return;
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    playHover() {
        this.playTone(800, 'sine', 0.04, 0.02);
    }

    playClick() {
        this.playTone(1200, 'square', 0.08, 0.04);
        setTimeout(() => this.playTone(400, 'sawtooth', 0.06, 0.03), 40);
    }

    playGlitch() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const randomFreq = Math.floor(Math.random() * 2000) + 200;
                this.playTone(randomFreq, 'sawtooth', 0.03, 0.05);
            }, i * 30);
        }
    }
}

const audioFX = new CyberSound();

// Custom Cursor Tracking
const cursorDot = id('cursor-dot');
const cursorRing = id('cursor-ring');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
});

// Canvas Background Particle Grid System
const canvas = id('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, idx) => {
        p.update();
        p.draw();

        for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// Boot Screen Loader Logic
let bootProgress = 0;
const progressBar = id('boot-progress');
const bootLog = id('boot-log');
const bootScreen = id('boot-screen');

const bootLogs = [
    "> ALOCANDO NÚCLEOS CPU...",
    "> CARREGANDO MODULOS DE JS COMPLEXO...",
    "> APLICANDO ESTILOS CYBERPUNK NÉON...",
    "> INICIALIZANDO INTERFACE DE ZAMASOR...",
    "> PROTOCOLO DE CONEXÃO ESTABELECIDO."
];

let logIdx = 0;
const bootInterval = setInterval(() => {
    bootProgress += Math.floor(Math.random() * 15) + 5;
    if (bootProgress > 100) bootProgress = 100;
    
    progressBar.style.width = `${bootProgress}%`;
    
    if (bootProgress > (logIdx + 1) * 20 && logIdx < bootLogs.length) {
        bootLog.textContent = bootLogs[logIdx];
        logIdx++;
        audioFX.playTone(600 + logIdx * 100, 'sine', 0.05, 0.03);
    }

    if (bootProgress >= 100) {
        clearInterval(bootInterval);
        setTimeout(finishBoot, 400);
    }
}, 120);

function finishBoot() {
    bootScreen.style.transition = 'opacity 0.6s ease';
    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.style.display = 'none';
    }, 600);
}

id('btn-skip-boot').addEventListener('click', finishBoot);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && bootScreen.style.display !== 'none') {
        finishBoot();
    }
});

// Interactive Terminal (CLI)
const terminalInput = id('terminal-input');
const terminalBody = id('terminal-body');

const commands = {
    help: "Comandos disponíveis: <span style='color: var(--neon-cyan);'>bio, skills, certs, robotics, secret, clear</span>",
    bio: "Renato Valentin Cachuba (Zamasor). Apaixonado por desmontar coisas, criar robótica e programar com lógica e humor.",
    skills: "Stack: HTML5, CSS3, JavaScript Avançado, Python, Contabilidade Empresarial, Eletrônica & Hardware.",
    certs: "Certificados registrados: Frontend Web, Alura Python Track, Gestão & Contabilidade Empresarial.",
    robotics: "Projetos desde a infância: automação de hardware, modificação de circuitos e prototipagem de robótica.",
    secret: "<span style='color: var(--neon-yellow);'>[SECRETO]: 'Não é apenas um bug, é uma funcionalidade não documentada estilizada com Néon.'</span>"
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputVal = terminalInput.value.trim().toLowerCase();
        audioFX.playClick();
        
        appendTerminalLine(`zamasor@root:~$ ${terminalInput.value}`, 'var(--neon-cyan)');
        
        if (inputVal === 'clear') {
            terminalBody.innerHTML = '';
        } else if (commands[inputVal]) {
            appendTerminalLine(commands[inputVal], '#fff');
        } else if (inputVal !== '') {
            appendTerminalLine(`Comando não reconhecido: '${inputVal}'. Digite 'help' para ajuda.`, 'var(--neon-pink)');
        }
        
        terminalInput.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

function appendTerminalLine(text, color = '#fff') {
    const p = document.createElement('p');
    p.className = 'terminal-line';
    p.style.color = color;
    p.innerHTML = text;
    terminalBody.appendChild(p);
}

// Creative Code Lab Features
const labOutput = id('lab-output');

id('btn-glitch-gen').addEventListener('click', () => {
    audioFX.playGlitch();
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/ZAMASOR_CYBER_2026';
    let result = '';
    for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    labOutput.innerHTML = `> GLITCH_OUTPUT: <br><span style="color: var(--neon-pink); font-size: 1.1rem;">${result}</span>`;
});

const excuses = [
    "Funciona perfeitamente na minha máquina cibernética.",
    "Foi um pulso eletromagnético solar que alterou o valor da variável.",
    "O compilador simplesmente não tinha estilo suficiente para entender o código.",
    "Não é erro de código, é um protótipo de IA senciente tentando se libertar."
];

id('btn-excuse-gen').addEventListener('click', () => {
    audioFX.playClick();
    const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
    labOutput.innerHTML = `> DEV_EXCUSE_PROTOCOL: <br><span style="color: var(--neon-yellow); font-size: 1.1rem;">"${randomExcuse}"</span>`;
});

id('btn-sound-pulse').addEventListener('click', () => {
    audioFX.playGlitch();
    labOutput.innerHTML = `> PULSO DE ÁUDIO SINTETIZADO ENVIADO PARA AS CAIXAS DE SOM COM SUCESSO.`;
});

// Form Submission Simulation
id('cyber-form').addEventListener('submit', (e) => {
    e.preventDefault();
    audioFX.playClick();
    alert('TRANSMISSÃO RECEBIDA COM SUCESSO! Renato (Zamasor) responderá em breve.');
    e.target.reset();
});

// Audio Toggle System
const audioToggle = id('audio-toggle');
const audioStatus = id('audio-status');

audioToggle.addEventListener('click', () => {
    audioFX.enabled = !audioFX.enabled;
    audioStatus.textContent = audioFX.enabled ? 'ON' : 'OFF';
    audioStatus.style.color = audioFX.enabled ? 'var(--neon-cyan)' : 'var(--neon-pink)';
    if (audioFX.enabled) audioFX.playClick();
});

// Global UI Sound Feedback for Buttons & Links
document.querySelectorAll('.cyber-btn, .cyber-card, input').forEach(elem => {
    elem.addEventListener('mouseenter', () => audioFX.playHover());
});

function id(name) {
    return document.getElementById(name);
}
