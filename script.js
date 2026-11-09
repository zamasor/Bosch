// JAVASCRIPT CYBERPUNK SAMURAI - ZAMASOR_OS (BLINDADO)
document.addEventListener('DOMContentLoaded', () => {

    class CyberSound {
        constructor() {
            this.ctx = null;
            this.enabled = true;
        }

        init() {
            if (!this.ctx) {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioCtx();
                } catch (e) {}
            }
        }

        playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.05) {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
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

        playHover() { this.playTone(600, 'sawtooth', 0.04, 0.02); }
        playClick() {
            this.playTone(1400, 'square', 0.08, 0.05);
            setTimeout(() => this.playTone(300, 'sawtooth', 0.07, 0.04), 40);
        }
        playGlitch() {
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    this.playTone(Math.floor(Math.random() * 2000) + 200, 'sawtooth', 0.04, 0.05);
                }, i * 30);
            }
        }
    }

    const audioFX = new CyberSound();
    const rockOverlay = document.getElementById('rock-glitch-overlay');

    function triggerRockGlitch() {
        if (!rockOverlay) return;
        const randomX = Math.floor(Math.random() * 80) + 10;
        const randomY = Math.floor(Math.random() * 80) + 10;
        
        rockOverlay.style.backgroundImage = `url('Samurai.png')`;
        rockOverlay.style.backgroundPosition = `${randomX}% ${randomY}%`;
        rockOverlay.style.opacity = '0.35';
        audioFX.playGlitch();

        setTimeout(() => {
            rockOverlay.style.opacity = '0.05';
        }, 180);
    }

    setInterval(() => {
        if (Math.random() > 0.6) triggerRockGlitch();
    }, 3000);

    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    window.addEventListener('mousemove', (e) => {
        if (cursorDot) {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        }
        if (cursorRing) {
            cursorRing.style.left = `${e.clientX}px`;
            cursorRing.style.top = `${e.clientY}px`;
        }
    });

    // Background Canvas Particles
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
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
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 0, 60, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

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
                        ctx.strokeStyle = `rgba(255, 0, 60, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // Boot Screen Loader Logic (Blindado com Timeout de Segurança)
    let bootProgress = 0;
    const progressBar = document.getElementById('boot-progress');
    const bootLog = document.getElementById('boot-log');
    const bootScreen = document.getElementById('boot-screen');

    const bootLogs = [
        "> INICIANDO CHIP NEURAL OVERDRIVE...",
        "> AQUECENDO AMPLIFICADORES SAMURAI...",
        "> CARREGANDO MÓDULOS DE HARDWARE & JS...",
        "> IMPLANTANDO INTERFACE ZAMASOR_OS...",
        "> CONEXÃO ESTABELECIDA EM NIGHT CITY."
    ];

    let logIdx = 0;
    const bootInterval = setInterval(() => {
        bootProgress += 25;
        if (bootProgress > 100) bootProgress = 100;
        
        if (progressBar) progressBar.style.width = `${bootProgress}%`;
        
        if (logIdx < bootLogs.length) {
            if (bootLog) bootLog.textContent = bootLogs[logIdx];
            logIdx++;
            audioFX.playTone(600, 'sawtooth', 0.05, 0.04);
        }

        if (bootProgress >= 100) {
            clearInterval(bootInterval);
            setTimeout(finishBoot, 300);
        }
    }, 200);

    // Salvaguarda: se por qualquer motivo travar, libera em 1.5s
    setTimeout(() => {
        if (bootScreen && bootScreen.style.display !== 'none') {
            finishBoot();
        }
    }, 1500);

    function finishBoot() {
        if (!bootScreen) return;
        bootScreen.style.transition = 'opacity 0.5s ease';
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            triggerRockGlitch();
        }, 500);
    }

    const skipBtn = document.getElementById('btn-skip-boot');
    if (skipBtn) {
        skipBtn.addEventListener('click', finishBoot);
    }

    window.addEventListener('keydown', (e) => {
        finishBoot();
    });

    // Terminal CLI
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    const commands = {
        help: "Comandos: <span style='color: var(--neon-yellow);'>bio, skills, certs, robotics, samurai, clear</span>",
        bio: "Renato Valentin Cachuba (Zamasor). Engenharia reversa, robótica e desenvolvimento de software.",
        skills: "Stack: HTML5, CSS3, JavaScript, Python, Contabilidade Empresarial, Hardware.",
        certs: "Certificados: Frontend Web, Alura Python Track, Gestão & Contabilidade.",
        robotics: "Projetos: automação de hardware, modificação de circuitos e prototipagem.",
        samurai: "<span style='color: var(--silver-red);'>[SAMURAI PROTOCOL]: 'A Riffing Code line that never fades away.'</span>"
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value.trim().toLowerCase();
                audioFX.playClick();
                appendLine(`zamasor@root:~$ ${terminalInput.value}`, 'var(--silver-red)');
                if (val === 'clear') {
                    if (terminalBody) terminalBody.innerHTML = '';
                } else if (commands[val]) {
                    appendLine(commands[val], '#fff');
                } else if (val !== '') {
                    appendLine(`Comando desconhecido: '${val}'. Digite 'help'.`, 'var(--neon-yellow)');
                }
                terminalInput.value = '';
                if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    function appendLine(text, color = '#fff') {
        if (!terminalBody) return;
        const p = document.createElement('p');
        p.className = 'terminal-line';
        p.style.color = color;
        p.innerHTML = text;
        terminalBody.appendChild(p);
    }

    // Code Lab
    const labOutput = document.getElementById('lab-output');
    const glitchGen = document.getElementById('btn-glitch-gen');
    if (glitchGen) {
        glitchGen.addEventListener('click', () => {
            triggerRockGlitch();
            let res = '';
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/SAMURAI2026';
            for (let i = 0; i < 35; i++) res += chars[Math.floor(Math.random() * chars.length)];
            if (labOutput) labOutput.innerHTML = `> GLITCH: <br><span style="color: var(--silver-red);">${res}</span>`;
        });
    }

    const excuseBtn = document.getElementById('btn-excuse-gen');
    const excuses = [
        "Funciona perfeitamente na minha máquina cibernética.",
        "Foi um pulso eletromagnético solar que alterou a variável.",
        "O compilador não tinha estilo suficiente para entender o código."
    ];
    if (excuseBtn) {
        excuseBtn.addEventListener('click', () => {
            audioFX.playClick();
            const ex = excuses[Math.floor(Math.random() * excuses.length)];
            if (labOutput) labOutput.innerHTML = `> DESCULPA DEV: <br><span style="color: var(--neon-yellow);">"${ex}"</span>`;
        });
    }

    const soundPulse = document.getElementById('btn-sound-pulse');
    if (soundPulse) {
        soundPulse.addEventListener('click', () => {
            audioFX.playGlitch();
            triggerRockGlitch();
            if (labOutput) labOutput.innerHTML = `> PULSO SAMURAI ENVIADO COM SUCESSO.`;
        });
    }

    const form = document.getElementById('cyber-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            audioFX.playClick();
            alert('TRANSMISSÃO RECEBIDA COM SUCESSO!');
            form.reset();
        });
    }

    const audioToggle = document.getElementById('audio-toggle');
    const audioStatus = document.getElementById('audio-status');
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            audioFX.enabled = !audioFX.enabled;
            if (audioStatus) {
                audioStatus.textContent = audioFX.enabled ? 'ON' : 'OFF';
                audioStatus.style.color = audioFX.enabled ? 'var(--silver-red)' : '#666';
            }
            if (audioFX.enabled) audioFX.playClick();
        });
    }
});
