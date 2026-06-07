const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  particles = [];
  const count = Math.floor((W * H) / 12000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.5 + 0.05,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
    });
  }
}

let mx = -999, my = -999;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    const dist = Math.hypot(p.x - mx, p.y - my);
    const glow = Math.max(0, 1 - dist / 160);
    const alpha = Math.min(0.9, p.alpha + glow * 0.6);
    const radius = p.r + glow * 2.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,208,32,${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animate);
}

resize();
animate();
window.addEventListener('resize', resize);

/* ── PROGRESS BARS ── */
const progObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.prog-fill').forEach(el => {
        const w = el.dataset.w;
        setTimeout(() => el.style.width = w + '%', 100);
      });
      progObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const progGrid = document.getElementById('prog-grid');
if (progGrid) progObserver.observe(progGrid);

/* ── CARD TOGGLE ── */
function toggleCard(trigger) {
  const card = trigger.closest('.topic-card');
  if (card.classList.contains('locked')) return;
  const body = card.querySelector('.card-body');
  const chevron = trigger.querySelector('.card-chevron');
  const isOpen = body.classList.toggle('open');
  chevron.classList.toggle('open', isOpen);
}
