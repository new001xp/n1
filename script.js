// --- INITIALIZATION ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let credits = 0;
let energy = 100;
let isAuth = false;

// --- WEB3 SECURITY ---
const authBtn = document.getElementById('authBtn');
const lockScreen = document.getElementById('lockScreen');

async function authenticate() {
    if (window.ethereum) {
        try {
            const acc = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const msg = `NEBULA-X PROTOCOL: UNLOCK COLONY DATA ${Date.now()}`;
            await window.ethereum.request({ method: 'personal_sign', params: [msg, acc[0]] });
            
            isAuth = true;
            lockScreen.classList.add('hidden');
            authBtn.innerText = "COMMANDER: " + acc[0].substring(0,6);
            addLog("ACCESS GRANTED. COLONY ONLINE.");
            gameLoop();
        } catch(e) { alert("Auth Failed"); }
    }
}
authBtn.onclick = authenticate;

// --- GAME LOGIC ---
function addLog(msg) {
    const logs = document.getElementById('logs');
    logs.innerHTML = `<p class="text-slate-400 font-mono">> ${msg}</p>` + logs.innerHTML;
}

document.getElementById('mineBtn').onclick = () => {
    if(!isAuth || energy < 10) return;
    energy -= 10;
    const gain = (Math.random() * 5 + 1).toFixed(2);
    credits += parseFloat(gain);
    updateUI();
    addLog(`EXTRACTED ${gain} STARDUST`);
};

document.getElementById('upgradeBtn').onclick = () => {
    if(credits >= 50) {
        credits -= 50;
        addLog("CORE UPGRADED. EFFICIENCY +20%");
        updateUI();
    }
};

function updateUI() {
    document.getElementById('credits').innerText = credits.toFixed(2);
    document.getElementById('energyBar').style.width = energy + "%";
}

// --- VISUAL ENGINE (The "Best Graphics" Part) ---
const particles = [];
function createParticles() {
    for(let i=0; i<100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5
        });
    }
}

function draw() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#3b82f6';
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speed;
        if(p.y > canvas.height) p.y = 0;
    });

    // Draw Planet
    ctx.shadowBlur = 50;
    ctx.shadowColor = '#1e40af';
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 100, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    requestAnimationFrame(draw);
}

// Resize Fix
window.onresize = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
};
window.onresize();
createParticles();
draw();

// Auto-Regen Energy Loop
setInterval(() => {
    if(isAuth && energy < 100) {
        energy += 1;
        updateUI();
    }
}, 2000);
