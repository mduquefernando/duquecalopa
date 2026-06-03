const folderView = document.getElementById("folderView");
const folderTabs = document.getElementById("folderTabs");
const folderContent = document.getElementById("folderContent");
const clockTime = document.getElementById("clockTime");
const clockDate = document.getElementById("clockDate");
const viralLogo = document.getElementById("viralLogo");
const topbar = document.querySelector(".topbar");
let lastTimeText = "";
let logoRaf = 0;
let workVideoObserver = null;
let activeModalVideo = null;
const WORK_VIDEO_FILES = [
  "YUNG BEEF SHOW VISUALS-web.mp4",
  "BIMBO.mp4",
  "VILLANO BLACKIE.mp4",
  "HUGO BOSS.mp4",
  "McDonalds x Stranger Things-web.mp4",
  "J Balvin x Saiko.mp4",
  "TLS 2.mp4",
  "True Life.mp4",
  "Zion ft. Bad Gyal -.mp4",
  "CAROLINA HERRERA.mp4",
  "CH.mp4",
];
const FEATURED_VIDEO_FILES = new Set([
  "BIMBO.mp4",
  "YUNG BEEF SHOW VISUALS-web.mp4",
  "HUGO BOSS.mp4",
  "McDonalds x Stranger Things-web.mp4",
  "Zion ft. Bad Gyal -.mp4",
]);
const VERTICAL_VIDEO_FILES = new Set([
  "CAROLINA HERRERA.mp4",
  "CH.mp4",
]);
const WORK_POSTER_LAYOUT = [
  { col: 7, row: 3, w: 3, h: 2, rot: -9 },
  { col: 10, row: 2, w: 3, h: 2, rot: -3 },
  { col: 13, row: 3, w: 3, h: 2, rot: 6 },
  { col: 16, row: 4, w: 3, h: 2, rot: -7 },
  { col: 5, row: 6, w: 3, h: 2, rot: 4 },
  { col: 14, row: 7, w: 4, h: 3, rot: -5 },
  { col: 6, row: 10, w: 3, h: 2, rot: -2 },
  { col: 14, row: 10, w: 4, h: 3, rot: -4 },
  { col: 6, row: 13, w: 3, h: 2, rot: 3 },
  { col: 14, row: 13, w: 4, h: 2, rot: -3 },
  { col: 7, row: 16, w: 3, h: 2, rot: 5 },
  { col: 13, row: 16, w: 4, h: 3, rot: -2 },
];
const WORK_DOT_COORDS = [
  [2, 8],[3, 8],[4, 8],[5, 8],[7, 8],[8, 8],[9, 8],[10, 8],
  [2, 9],[11, 9],[14, 8],[15, 8],[16, 8],[17, 8],[18, 8],[19, 8],[20, 8],
  [2, 10],[5, 10],[8, 10],[11, 10],[14, 9],[21, 9],
  [2, 11],[3, 11],[4, 11],[5, 11],[7, 11],[8, 11],[9, 11],[10, 11],[11, 11],[14, 10],[21, 10],
  [1, 13],[4, 13],[7, 13],[11, 13],[14, 11],[15, 11],[16, 11],[17, 11],[18, 11],[21, 11],
  [2, 14],[3, 14],[4, 14],[7, 14],[8, 14],[9, 14],[11, 14],[14, 12],[18, 12],[21, 12]
];

const folders = {
  work: {
    title: "WORK",
    content: ""
  },
  about: {
    title: "ABOUT",
    content: `
      <section class="about-panel about-contacts">
        <div class="about-contact">
          <p class="about-name">Fernando Duque</p>
          <a
            class="about-instagram"
            href="https://www.instagram.com/fernando.duque_/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
          >Instagram</a>
        </div>
        <div class="about-contact">
          <p class="about-name">Eloi Calopa</p>
          <a
            class="about-instagram"
            href="https://www.instagram.com/eloi_calopa/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
          >Instagram</a>
        </div>
        <p class="about-role about-role-shared">Digital artists specialized in AI cinematography, VFX, and 3D.</p>
      </section>
    `
  }
};

function renderFolderTabs(activeKey) {
  folderTabs.innerHTML = Object.entries(folders)
    .map(([key, folder]) => `
      <button
        class="icon-btn folder-tab-btn ${key === activeKey ? "is-active" : ""}"
        data-folder="${key}"
        type="button"
        aria-pressed="${key === activeKey ? "true" : "false"}"
      >
        <div class="icon" aria-hidden="true"></div>
        <div class="label">${folder.title}</div>
      </button>
    `)
    .join("");

  folderTabs.querySelectorAll(".folder-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => openFolder(btn.dataset.folder));
  });
}

function openFolder(key) {
  const folder = folders[key];
  if (!folder) return;

  if (workVideoObserver) {
    workVideoObserver.disconnect();
    workVideoObserver = null;
  }
  closeWorkVideoModal();

  folderView.dataset.folder = key;
  renderFolderTabs(key);

  if (key === "work") {
    folderContent.innerHTML = renderWorkContent();
    setupWorkVideoPlayback();
  } else {
    folderContent.innerHTML = folder.content;
  }
}

function renderWorkContent() {
  if (WORK_VIDEO_FILES.length === 0) {
    return `
      <p>Bienvenido a <strong>WORK</strong>.</p>
      <p>
        AÃ±ade tus videos en <code>media/work-videos/</code> y luego incluye sus nombres
        en <code>WORK_VIDEO_FILES</code> dentro de <code>app.js</code>.
      </p>
    `;
  }

  const buildVideoCard = (fileName) => {
    const safeName = encodeURIComponent(fileName).replace(/%2F/g, "/");
    const cleanLabel = fileName.replace(/-web(?=\.[^.]+$)/, "").replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
    const cardClass = FEATURED_VIDEO_FILES.has(fileName)
      ? "work-video-card is-featured"
      : "work-video-card";
    const orientationClass = VERTICAL_VIDEO_FILES.has(fileName) ? "is-tall" : "is-wide";
    return `
      <article
        class="${cardClass} work-reel-card ${orientationClass}"
        data-video-src="media/work-videos/${safeName}"
        data-video-label="${cleanLabel}"
      >
        <video
          class="work-video"
          src="media/work-videos/${safeName}"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
        ></video>
        <div class="work-video-overlay">
          <p class="work-video-name">${cleanLabel}</p>
        </div>
      </article>
    `;
  };

  const verticalVideos = WORK_VIDEO_FILES.filter((fileName) => VERTICAL_VIDEO_FILES.has(fileName));
  const horizontalVideos = WORK_VIDEO_FILES.filter((fileName) => !VERTICAL_VIDEO_FILES.has(fileName));

  const rows = horizontalVideos.map((fileName) => `
    <section class="work-reel-row single-row">
      ${buildVideoCard(fileName)}
    </section>
  `);

  if (verticalVideos.length > 0) {
    rows.push(`
      <section class="work-reel-row vertical-pair-row">
        ${verticalVideos.map((fileName) => buildVideoCard(fileName)).join("")}
      </section>
    `);
  }

  rows.push(`
    <section class="work-reel-row single-row work-contact-row">
      <section class="work-contact-panel" aria-labelledby="workContactTitle">
        <p class="work-contact-kicker">CONTACT US</p>
        <h3 id="workContactTitle" class="work-contact-title">Let's Talk</h3>
        <div class="work-contact-cta">
          <p class="work-contact-cta-copy">If you'd like to have a chat with us, write to us and we'll get back to you soon.</p>
          <a
            class="work-contact-email-btn"
            href="mailto:duquecalopawork@gmail.com"
          >duquecalopawork@gmail.com</a>
        </div>
      </section>
    </section>
  `);

  return `
    <section class="work-reel">${rows.join("")}</section>
  `;
}

function openWorkVideoModal(src, label) {
  const modal = document.getElementById("workVideoModal");
  const modalVideo = document.getElementById("workModalVideo");
  const modalLabel = document.getElementById("workModalLabel");
  if (!modal || !modalVideo || !modalLabel || !src) return;

  activeModalVideo = modalVideo;
  modalVideo.src = src;
  modalVideo.currentTime = 0;
  modalVideo.muted = false;
  modalVideo.play().catch(() => {});
  modalLabel.textContent = label || "";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeWorkVideoModal() {
  const modal = document.getElementById("workVideoModal");
  if (!modal) return;

  if (activeModalVideo) {
    activeModalVideo.pause();
    activeModalVideo.removeAttribute("src");
    activeModalVideo.load();
  }
  activeModalVideo = null;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateClock() {
  const now = new Date();
  const timeText = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
  if (timeText !== lastTimeText) {
    renderDotMatrixTime(clockTime, timeText);
    lastTimeText = timeText;
  }
  clockDate.textContent = now.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function renderDotMatrixTime(target, text) {
  const glyphs = {
    "0": ["111", "101", "101", "101", "111"],
    "1": ["010", "110", "010", "010", "111"],
    "2": ["111", "001", "111", "100", "111"],
    "3": ["111", "001", "111", "001", "111"],
    "4": ["101", "101", "111", "001", "001"],
    "5": ["111", "100", "111", "001", "111"],
    "6": ["111", "100", "111", "101", "111"],
    "7": ["111", "001", "010", "010", "010"],
    "8": ["111", "101", "111", "101", "111"],
    "9": ["111", "101", "111", "001", "111"],
    ":": ["0", "1", "0", "1", "0"]
  };

  const dotPitch = 4;
  let col = 0;
  target.innerHTML = "";

  for (const ch of text) {
    const g = glyphs[ch];
    if (!g) continue;
    const gw = g[0].length;
    for (let y = 0; y < g.length; y++) {
      for (let x = 0; x < gw; x++) {
        if (g[y][x] === "1") {
          const dot = document.createElement("span");
          dot.className = "clock-dot";
          dot.style.left = `${(col + x) * dotPitch}px`;
          dot.style.top = `${y * dotPitch}px`;
          target.appendChild(dot);
        }
      }
    }
    col += gw + 1;
  }
}

function renderPointCloudLogo() {
  const lines = ["eloi calopa", "fernando duque"];
  const width = Math.min(520, Math.floor(window.innerWidth * 0.82));
  const height = 112;
  const step = 5;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    viralLogo.textContent = text;
    return;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const fontSize = Math.floor(height * 0.39);
  const lineGap = Math.floor(height * 0.06);
  ctx.font = `700 ${fontSize}px "Courier New", monospace`;
  lines.forEach((line, index) => {
    const y = index * (fontSize + lineGap);
    ctx.fillText(line, 0, y);
  });

  const data = ctx.getImageData(0, 0, width, height).data;
  viralLogo.innerHTML = "";
  viralLogo.style.width = `${width}px`;
  viralLogo.style.height = `${height}px`;

  let maxDotX = 0;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const p = (y * width + x) * 4 + 3;
      if (data[p] > 120) {
        const dot = document.createElement("span");
        const px = x;
        const py = y;
        dot.className = "logo-dot";
        dot.style.left = `${px}px`;
        dot.style.top = `${py}px`;
        viralLogo.appendChild(dot);
        if (px > maxDotX) maxDotX = px;
      }
    }
  }
  const inkWidth = Math.min(width, maxDotX + 6);
  topbar.style.setProperty("--logo-ink-width", `${inkWidth}px`);
}

function scheduleLogoRender() {
  if (logoRaf) {
    cancelAnimationFrame(logoRaf);
  }
  logoRaf = requestAnimationFrame(() => {
    renderPointCloudLogo();
    logoRaf = 0;
  });
}

function setupWorkVideoPlayback() {
  const videos = folderContent.querySelectorAll(".work-video");
  if (videos.length === 0) return;

  videos.forEach((video) => {
    const applyAspect = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const card = video.closest(".work-video-card");
      if (!card) return;
      const ratio = video.videoWidth / video.videoHeight;
      const isPortrait = ratio < 0.95;
      card.classList.toggle("is-portrait", isPortrait);
    };
    if (video.readyState >= 1) {
      applyAspect();
    } else {
      video.addEventListener("loadedmetadata", applyAspect, { once: true });
    }
  });

  if (!("IntersectionObserver" in window)) {
    videos.forEach((video) => {
      video.play().catch(() => {});
    });
    return;
  }

  workVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.45, 0.75] });

  videos.forEach((video) => workVideoObserver.observe(video));
}

function setupCustomCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add("is-visible");
  });

  window.addEventListener("mousedown", () => cursor.classList.add("is-pressed"));
  window.addEventListener("mouseup", () => cursor.classList.remove("is-pressed"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWorkVideoModal();
  }
});

openFolder("work");
updateClock();
setInterval(updateClock, 1000);
renderPointCloudLogo();
window.addEventListener("resize", scheduleLogoRender);
setupCustomCursor();




