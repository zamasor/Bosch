// JAVASCRIPT CYBERPUNK SAMURAI - RENATO VALENTIN CACHUBA (ZAMASOR)

// Web Audio API Synthesizer
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
        this.playTone(600, 'sawtooth', 0.04, 0.02);
    }

    playClick() {
        this.playTone(1400, 'square', 0.08, 0.05);
        setTimeout(() => this.playTone(300, 'sawtooth', 0.07, 0.04), 40);
    }

    playGlitch() {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const randomFreq = Math.floor(Math.random() * 2500) + 150;
                this.playTone(randomFreq, 'sawtooth', 0.04, 0.06);
            }, i * 35);
        }
    }
}

const audioFX = new CyberSound();

// Glitch Overlay com a imagem do Samurai
const rockSymbols = [
    'Samurai.png'
];

const rockOverlay = id('rock-glitch-overlay');

function triggerRockGlitch() {
    const randomSymbol = rockSymbols[Math.floor(Math.random() * rockSymbols.length)];
    const randomX = Math.floor(Math.random() * 80) + 10;
    const randomY = Math.floor(Math.random() * 80) + 10;
    const randomScale = (Math.random() * 1.5 + 0.8).toFixed(2);
    
    rockOverlay.style.backgroundImage = `url('${randomSymbol}')`;
    rockOverlay.style.backgroundPosition = `${randomX}% ${randomY}%`;
    rockOverlay.style.transform = `scale(${randomScale})`;
    rockOverlay.style.opacity = '0.35';
    
    audioFX.playGlitch();

    setTimeout(() => {
        rockOverlay.style.opacity = '0.05';
    }, 180);
}

const rockOverlay = id('rock-glitch-overlay');

function triggerRockGlitch() {
    const randomSymbol = rockSymbols[Math.floor(Math.random() * rockSymbols.length)];
    const randomX = Math.floor(Math.random() * 80) + 10;
    const randomY = Math.floor(Math.random() * 80) + 10;
    
    rockOverlay.style.backgroundImage = `url('${randomSymbol}')`;
    rockOverlay.style.backgroundPosition = `${randomX}% ${randomY}%`;
    rockOverlay.style.opacity = '0.35';
    
    audioFX.playGlitch();

    setTimeout(() => {
        rockOverlay.style.opacity = '0.05';
    }, 200);
}

setInterval(() => {
    if (Math.random() > 0.6) {
        triggerRockGlitch();
    }
}, 3000);

// Custom Cursor
const cursorDot = id('cursor-dot');
const cursorRing = id('cursor-ring');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
});

// Canvas Background Particle Grid
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
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) { this.reset(); }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 60, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 70; i++) { particles.push(new Particle()); }

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
        p.update();
        p.draw();
        for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 0, 60, ${0.18 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.6;
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
    "> INICIANDO CHIP NEURAL OVERDRIVE...",
    "> AQUECENDO AMPLIFICADORES SAMURAI...",
    "> CARREGANDO MÓDULOS DE HARDWARE & JS...",
    "> IMPLANTANDO INTERFACE ZAMASOR_OS...",
    "> CONEXÃO ESTABELECIDA EM NIGHT CITY."
];

let logIdx = 0;
const bootInterval = setInterval(() => {
    bootProgress += Math.floor(Math.random() * 15) + 6;
    if (bootProgress > 100) bootProgress = 100;
    
    progressBar.style.width = `${bootProgress}%`;
    
    if (bootProgress > (logIdx + 1) * 20 && logIdx < bootLogs.length) {
        bootLog.textContent = bootLogs[logIdx];
        logIdx++;
        audioFX.playTone(500 + logIdx * 120, 'sawtooth', 0.06, 0.04);
    }

    if (bootProgress >= 100) {
        clearInterval(bootInterval);
        setTimeout(finishBoot, 400);
    }
}, 110);

function finishBoot() {
    bootScreen.style.transition = 'opacity 0.6s ease';
    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.style.display = 'none';
        triggerRockGlitch();
    }, 600);
}

id('btn-skip-boot').addEventListener('click', finishBoot);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && bootScreen.style.display !== 'none') {
        finishBoot();
    }
});

// Interactive Terminal CLI
const terminalInput = id('terminal-input');
const terminalBody = id('terminal-body');

const commands = {
    help: "Comandos disponíveis: <span style='color: var(--neon-yellow);'>bio, skills, certs, robotics, samurai, clear</span>",
    bio: "Renato Valentin Cachuba (Zamasor). Apaixonado por desmontar eletrônicos, criar projetos de robótica e desenvolver softwares com lógica refinada e humor.",
    skills: "Stack: HTML5, CSS3, JavaScript Avançado, Python, Contabilidade Empresarial, Eletrônica & Hardware.",
    certs: "Certificados registrados: Frontend Web, Alura Python Track, Gestão & Contabilidade Empresarial.",
    robotics: "Projetos desde a infância: automação de hardware, modificação de circuitos e prototipagem de robótica.",
    samurai: "<span style='color: var(--silver-red);'>[SAMURAI PROTOCOL]: 'A Riffing Code line that never fades away.'</span>"
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputVal = terminalInput.value.trim().toLowerCase();
        audioFX.playClick();
        
        appendTerminalLine(`zamasor@root:~$ ${terminalInput.value}`, 'var(--silver-red)');
        
        if (inputVal === 'clear') {
            terminalBody.innerHTML = '';
        } else if (commands[inputVal]) {
            appendTerminalLine(commands[inputVal], '#fff');
        } else if (inputVal !== '') {
            appendTerminalLine(`Comando não reconhecido: '${inputVal}'. Digite 'help' para ajuda.`, 'var(--neon-yellow)');
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

// Code Lab Interactive Actions
const labOutput = id('lab-output');

id('btn-glitch-gen').addEventListener('click', () => {
    triggerRockGlitch();
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/SAMURAI_ZAMASOR_2026';
    let result = '';
    for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    labOutput.innerHTML = `> GLITCH_OUTPUT: <br><span style="color: var(--silver-red); font-size: 1.1rem;">${result}</span>`;
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
    triggerRockGlitch();
    labOutput.innerHTML = `> PULSO SAMURAI SINTETIZADO ENVIADO COM SUCESSO.`;
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
    audioStatus.style.color = audioFX.enabled ? 'var(--silver-red)' : '#666';
    if (audioFX.enabled) audioFX.playClick();
});

// Audio feedback on interaction
document.querySelectorAll('.cyber-btn, .cyber-card, input').forEach(elem => {
    elem.addEventListener('mouseenter', () => audioFX.playHover());
});

function id(name) {
    return document.getElementById(name);
}
