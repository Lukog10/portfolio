/* ══════════════════════════════════════════════
   GOKUL R — PORTFOLIO · INTERACTIONS
   3D Float + Scroll Rotate + Cursor + Pop-in
   ══════════════════════════════════════════════ */

// ── Custom Cursor ──
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

(function followRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(followRing);
})();

// Cursor hover grow
document.querySelectorAll('a, button, .project-card, .skill-row, .contact-item, .timeline-card, .hero-btn, .skills-tab').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width = '12px';
    dot.style.height = '12px';
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.opacity = '.6';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width = '6px';
    dot.style.height = '6px';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.opacity = '.4';
  });
});

// ── Pop-In Scroll Reveal ──
const popObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      popObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pop-in').forEach(el => popObserver.observe(el));

// ── Navbar style change on scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.style.background = 'rgba(254,89,69,0.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    navbar.style.backdropFilter = 'blur(12px)';
  } else {
    navbar.style.background = '#f0493c';
    navbar.style.boxShadow = 'none';
    navbar.style.backdropFilter = 'none';
  }
});

// ── Skills: Tab Switching + Row Selection ──
(function initSkills() {
  const tabs = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skills-tab-panel');
  const indicator = document.querySelector('.tab-indicator');

  // Position indicator under active tab
  function moveIndicator(tab) {
    if (!indicator || !tab) return;
    indicator.style.left = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }

  // Initialize indicator position
  const activeTab = document.querySelector('.skills-tab.active');
  if (activeTab) moveIndicator(activeTab);
  window.addEventListener('resize', () => {
    const at = document.querySelector('.skills-tab.active');
    if (at) moveIndicator(at);
  });

  // Tab click handler
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Switch active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      moveIndicator(tab);

      // Switch panel
      const target = tab.dataset.tab;
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });


      // Re-observe pop-ins for the newly shown panel
      if (activePanel) {
        activePanel.querySelectorAll('.pop-in:not(.visible)').forEach(el => popObserver.observe(el));
      }
    });
  });


})();

// ── Interactive Project Selector ──
const projectsData = [
  {
    id: 1,
    category: "AI SECURITY",
    title: "VAULT-Aegis — AI Security Gateway",
    metric: "1ST PRIZE HACKATHON",
    image: "vault_aegis.png",
    tags: ["Python", "FastAPI", "Streamlit", "spaCy"],
    desc: "Zero-trust AI security gateway for LLM deployments. Prompt injection defence, PII sanitization (7+ types), and OWASP API scanning."
  },
  {
    id: 2,
    category: "PREDICTION",
    title: "Video Games Sales Prediction",
    metric: "R² = 0.84",
    image: "games_sales.png",
    tags: ["Random Forest", "XGBoost", "pandas"],
    desc: "Profiled 16,000+ titles. Benchmarked Linear Regression, Random Forest & XGBoost to accurately predict global game sales."
  },
  {
    id: 3,
    category: "CLASSIFICATION",
    title: "Land Approval Prediction",
    metric: "F1 3× IMPROVEMENT",
    image: "land_approval.png",
    tags: ["Logistic Reg", "Streamlit"],
    desc: "Trained models on land documentation data to predict approval probabilities. Deployed via interactive Streamlit dashboard."
  },
  {
    id: 4,
    category: "BEHAVIOURAL ML",
    title: "Gaming Addiction Analysis",
    metric: "TOP 5 RISK INDICATORS",
    image: "gaming_addiction.png",
    tags: ["EDA", "seaborn", "Streamlit"],
    desc: "Extracted behavioural patterns from extensive survey data. Identified the top 5 risk indicators for gaming addiction."
  },
  {
    id: 5,
    category: "REGRESSION",
    title: "Laptop Price Prediction",
    metric: "R² = 0.88",
    image: "laptop_price.png",
    tags: ["Regression", "Feature Importance"],
    desc: "Optimized Random Forest regression on 1,000+ device configurations to provide highly accurate price estimations."
  },
  {
    id: 6,
    category: "ANALYTICS",
    title: "London Bike Ride Analysis",
    metric: "DEMAND ANALYTICS",
    image: "bike_rides.png",
    tags: ["Tableau", "Time Series", "EDA"],
    desc: "Uncovered seasonal demand patterns. Quantified ~23% higher weekend demand and visualized data via interactive Tableau dashboards."
  }
];

let currentPage = 1;
let selectedId = 1;
const ITEMS_PER_PAGE = 3;

const featuredContainer = document.getElementById('featured-card');
const lowerRowContainer = document.getElementById('lower-row');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageIndicator = document.getElementById('page-indicator');

function renderFeaturedCard() {
  if (!featuredContainer) return;
  const project = projectsData.find(p => p.id === selectedId);
  if (!project) return;
  const numStr = String(project.id).padStart(2, '0');
  
  featuredContainer.classList.add('fade-out');
  setTimeout(() => {
    featuredContainer.innerHTML = `
      <div class="bc-top">
        <span class="bc-num">${numStr}</span>
        <span class="bc-cat">${project.category}</span>
        <div class="bc-thumb"></div>
      </div>
      <div class="bc-media"><img src="${project.image}" alt="${project.title}" class="project-asset-img"></div>
      <div class="bc-content">
        <h3 class="bc-title">${project.title}</h3>
        <span class="bc-accent">${project.metric}</span>
        <p style="font-size: 0.9rem; color: rgba(245,245,233,0.8); margin-bottom: 24px; line-height: 1.6;">${project.desc}</p>
        <div class="bc-chips">
          ${project.tags.map(t => '<span>' + t + '</span>').join('')}
        </div>
      </div>

    `;
    featuredContainer.classList.remove('fade-out');
  }, 300);
}

function renderLowerRow() {
  if (!lowerRowContainer) return;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageProjects = projectsData.slice(startIdx, endIdx);
  
  lowerRowContainer.classList.add('fade-out');
  setTimeout(() => {
    lowerRowContainer.innerHTML = pageProjects.map((p, index) => {
      const numStr = String(p.id).padStart(2, '0');
      const isWide = index === 0 ? 'bento-wide' : '';
      const isActive = p.id === selectedId ? 'active-card' : '';
      return `
        <article class="bento-card ${isWide} ${isActive}" data-id="${p.id}">
          <div class="bc-top">
            <span class="bc-num">${numStr}</span>
            <span class="bc-cat">${p.category}</span>
            <div class="bc-thumb"></div>
          </div>
          <div class="bc-media"><img src="${p.image}" alt="${p.title}" class="project-asset-img"></div>
          <div class="bc-content">
            <h3 class="bc-title">${p.title}</h3>
            <span class="bc-accent">${p.metric}</span>
            <div class="bc-chips">
              ${p.tags.map(t => '<span>' + t + '</span>').join('')}
            </div>
          </div>

        </article>
      `;
    }).join('');
    
    const totalPages = Math.ceil(projectsData.length / ITEMS_PER_PAGE);
    if (pageIndicator) pageIndicator.textContent = String(currentPage).padStart(2, '0') + ' / ' + String(totalPages).padStart(2, '0');
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
    
    lowerRowContainer.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        if (id !== selectedId) {
          selectedId = id;
          renderFeaturedCard();
          lowerRowContainer.querySelectorAll('.bento-card').forEach(c => c.classList.remove('active-card'));
          card.classList.add('active-card');
        }
      });
    });

    lowerRowContainer.classList.remove('fade-out');
  }, 300);
}

if (lowerRowContainer) {
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderLowerRow();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const totalPages = Math.ceil(projectsData.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderLowerRow();
      }
    });
  }

  renderFeaturedCard();
  renderLowerRow();
}

// ── Editorial Education & Certifications ──
const featuredData = {
  education: {
    monogram: "OK",
    label: "DATA SCIENTIST",
    heading: "B.Sc. Data Science",
    desc: "The American College, Madurai. — CGPA: 8.5",
    image: "edu_college.png"
  },
  experience: {
    monogram: "OK",
    label: "FIELD WORK",
    heading: "Data Science Experience",
    desc: "Freelance — Management Assistant Head / Web Management & Data Analyst, The American College",
    image: "exp_freelance.png"
  }
};

const svgLogos = {
  google: '<svg viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>',
  aws: '<svg viewBox="0 0 640 512" fill="currentColor"><path d="M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zm170.92 23.05c-7.86.72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zm273.48 5.63c-5.88.01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89.91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42zm40.2 104.86c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38zm29.19-33.29c-8.96-11.52-59.28-5.38-81.81-2.69-6.79.77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z"/></svg>',
  hf: '<svg viewBox="0 0 24 24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" font-family="Arial">🤗</text></svg>',
  tata: '<svg viewBox="0 0 24 24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" font-family="Arial" font-weight="bold">TATA</text></svg>',
  accenture: '<svg viewBox="0 0 24 24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="22" font-family="Arial" font-weight="bold">></text></svg>',
  microsoft: '<svg viewBox="0 0 24 24"><path d="M0 0h11.4v11.4H0V0zm12.6 0H24v11.4H12.6V0zM0 12.6h11.4V24H0V12.6zm12.6 0H24V24H12.6V12.6z"/></svg>'
};

const certsData = [
  { id: 1, title: 'Google Analytics', issuer: 'Google', year: 2024, desc: 'Advanced data tracking and analytics.', svg: svgLogos.google },
  { id: 2, title: 'Prompt Engineering', issuer: 'AWS', year: 2024, desc: 'Techniques for optimizing LLM interactions.', svg: svgLogos.aws },
  { id: 3, title: 'AI Agents', issuer: 'Hugging Face', year: 2024, desc: 'Building autonomous AI systems.', svg: svgLogos.hf },
  { id: 4, title: 'Data Visualization', issuer: 'TATA', year: 2023, desc: 'Enterprise data visualization strategies.', svg: svgLogos.tata },
  { id: 5, title: 'Data Analytics', issuer: 'Accenture', year: 2023, desc: 'Applied analytics for business solutions.', svg: svgLogos.accenture },
  { id: 6, title: 'Data Analysis', issuer: 'Microsoft', year: 2023, desc: 'Core data analysis methodologies.', svg: svgLogos.microsoft },
  { id: 7, title: 'Generative AI', issuer: 'Microsoft', year: 2023, desc: 'Foundations of GenAI and prompt design.', svg: svgLogos.microsoft }
];

// Band 1 Toggle Logic
const featuredContent = document.getElementById('featured-edu-content');
const eduMedia = document.querySelector('.edu-media');
const toggleBtns = document.querySelectorAll('.toggle-btn');

function renderFeaturedBlock(type) {
  if (!featuredContent) return;
  const data = featuredData[type];
  if (!data) return;
  
  featuredContent.classList.add('fade-out');
  if (eduMedia) eduMedia.classList.add('fade-out');
  
  setTimeout(() => {
    featuredContent.innerHTML = `
      <div class="edu-monogram-wrap">
        <div class="edu-monogram">${data.monogram}</div>
        <span class="edu-monogram-label">${data.label}</span>
      </div>
      <h2 class="edu-heading">${data.heading}</h2>
      <hr class="edu-short-divider">
      <p class="edu-desc">${data.desc}</p>
    `;
    
    if (eduMedia && data.image) {
      eduMedia.innerHTML = `<img src="${data.image}" alt="${data.heading}" class="edu-asset-img">`;
      eduMedia.classList.remove('hatch-bg-blue');
    }

    featuredContent.classList.remove('fade-out');
    if (eduMedia) eduMedia.classList.remove('fade-out');
  }, 300);
}

if (toggleBtns.length > 0) {
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFeaturedBlock(btn.dataset.target);
    });
  });
  renderFeaturedBlock('education');
}

// Band 2 Carousel Logic
let currentCertIndex = 0;
const certTrack = document.getElementById('cert-track');
const certPrevBtn = document.getElementById('cert-prev');
const certNextBtn = document.getElementById('cert-next');
const certCounter = document.getElementById('cert-counter');

function renderCertCarousel() {
  if (!certTrack) return;
  
  const len = certsData.length;
  const prevIdx = (currentCertIndex - 1 + len) % len;
  const nextIdx = (currentCertIndex + 1) % len;
  
  const prevCert = certsData[prevIdx];
  const currCert = certsData[currentCertIndex];
  const nextCert = certsData[nextIdx];
  
  certTrack.style.opacity = '0';
  setTimeout(() => {
    certTrack.innerHTML = `
      <!-- Prev Card -->
      <div class="cert-card side-cert" data-idx="${prevIdx}">
        <div class="cert-icon">${prevCert.svg}</div>
        <h3 class="cert-name">${prevCert.title}</h3>
      </div>
      <!-- Current Card -->
      <div class="cert-card featured-cert">
        <div class="cert-icon">${currCert.svg}</div>
        <h3 class="cert-name">${currCert.title}</h3>
        <p class="cert-desc">${currCert.desc}</p>
      </div>
      <!-- Next Card -->
      <div class="cert-card side-cert" data-idx="${nextIdx}">
        <div class="cert-icon">${nextCert.svg}</div>
        <h3 class="cert-name">${nextCert.title}</h3>
      </div>
    `;
    
    if (certCounter) {
      certCounter.textContent = '№ ' + (currentCertIndex + 1) + ' / ' + len;
    }
    
    // Add click listeners to side cards
    certTrack.querySelectorAll('.side-cert').forEach(card => {
      card.addEventListener('click', () => {
        currentCertIndex = parseInt(card.dataset.idx);
        renderCertCarousel();
      });
    });
    
    certTrack.style.opacity = '1';
  }, 300);
}

if (certTrack) {
  certPrevBtn.addEventListener('click', () => {
    currentCertIndex = (currentCertIndex - 1 + certsData.length) % certsData.length;
    renderCertCarousel();
  });
  certNextBtn.addEventListener('click', () => {
    currentCertIndex = (currentCertIndex + 1) % certsData.length;
    renderCertCarousel();
  });
  renderCertCarousel();
}

/* ══════════════════════════════════════════════
   FIND ME — Interactive Square Selection
   ══════════════════════════════════════════════ */
const findmeSquares = document.querySelectorAll('.findme-square');

findmeSquares.forEach(sq => {
  sq.addEventListener('mouseenter', () => {
    findmeSquares.forEach(s => s.classList.remove('active-square'));
    sq.classList.add('active-square');
  });
});
// update