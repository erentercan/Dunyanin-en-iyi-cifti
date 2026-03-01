const screens = {
  home: document.getElementById("screenHome"),
  gallery: document.getElementById("screenGallery"),
  message: document.getElementById("screenMessage"),
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove("is-active"));
  screens[name]?.classList.add("is-active");

  // mesaj sayfasına geçince yazıyı tekrar yazdır
  if(name === "message") startTyping();
}

// Butonlar
const btnStart = document.getElementById("btnStart");
const btnToMessage = document.getElementById("btnToMessage");

btnStart?.addEventListener("click", () => showScreen("gallery"));
btnToMessage?.addEventListener("click", () => showScreen("message"));

document.querySelectorAll("[data-go]").forEach(btn=>{
  btn.addEventListener("click", ()=> showScreen(btn.dataset.go));
});

/* ================================
   ✅ INTRO (Sürpriz ekran)
================================ */
const intro = document.getElementById("intro");
const btnIntro = document.getElementById("btnIntro");

btnIntro?.addEventListener("click", () => {
  intro?.classList.remove("is-open");
  // Kullanıcı etkileşimi var -> müzik başlatmayı dene
  tryStartMusicFromUserGesture();
});

/* ================================
   Sayaç (07.04.2021)
================================ */
const startDate = new Date(2021, 3, 7); // Ay: 0=Ocak, 3=Nisan
const cYears = document.getElementById("cYears");
const cMonths = document.getElementById("cMonths");
const cDays = document.getElementById("cDays");
const cTotalDays = document.getElementById("cTotalDays");

function updateCounter(){
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMs = now - startDate;
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  if(cYears) cYears.textContent = years;
  if(cMonths) cMonths.textContent = months;
  if(cDays) cDays.textContent = days;
  if(cTotalDays) cTotalDays.textContent = totalDays;
}
updateCounter();
setInterval(updateCounter, 1000 * 60);

/* ================================
   Uçuşan kalpler (arkada)
   ✅ tıklamayı engellemesin diye
   CSS'te fx-layer pointer-events:none olmalı
================================ */
const layer = document.getElementById("floatingLayer");
const hearts = ["💗","💖","💓","💕","❤️","✨","🫶"];

function spawnFloat(){
  if(!layer) return;
  const el = document.createElement("div");
  el.className = "float";
  el.textContent = hearts[Math.floor(Math.random()*hearts.length)];

  const left = Math.random()*100;
  const size = 12 + Math.random()*18;
  const dur  = 6 + Math.random()*8;

  el.style.left = left + "vw";
  el.style.bottom = "-10vh";
  el.style.fontSize = size + "px";
  el.style.animationDuration = dur + "s";
  el.style.opacity = 0.9;

  layer.appendChild(el);
  setTimeout(()=> el.remove(), dur*1000);
}
setInterval(spawnFloat, 260);

/* ================================
   Lightbox
================================ */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".photoCard img").forEach(img=>{
  img.addEventListener("click", ()=>{
    if(!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightbox.classList.add("is-open");
  });
});

lightbox?.addEventListener("click", ()=>{
  lightbox.classList.remove("is-open");
});

/* ================================
   Yazı yazılıyormuş gibi
================================ */
let typingTimer = null;

function startTyping(){
  const el = document.getElementById("type1");
  if(!el) return;

  const full = el.getAttribute("data-text") || "";

  // Önceki timer varsa durdur
  if (typingTimer) clearInterval(typingTimer);

  el.textContent = "";
  let i = 0;
  const speed = 18;

  typingTimer = setInterval(() => {
    el.textContent += full[i] || "";
    i++;
    if(i >= full.length){
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, speed);
}

/* ================================
   ✅ MÜZİK (Autoplay engeline uyumlu)
   - Butonla aç/kapat
   - İlk kullanıcı tıklamasında otomatik başlatmayı dener
================================ */
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

function setMusicIcon(){
  if(!musicBtn) return;
  if(!music || music.paused){
    musicBtn.textContent = "🔇";
  }else{
    musicBtn.textContent = "🔊";
  }
}

async function playMusic(){
  if(!music) return false;

  try{
    // Bazı tarayıcılarda load yardımcı olur
    music.load();

    // Eğer daha önce durmuşsa başa sar
    if (music.currentTime > 0 && music.paused) {
      music.currentTime = 0;
    }

    await music.play();
    setMusicIcon();
    return true;
  }catch(e){
    console.log("Müzik başlatılamadı (tarayıcı engeli / dosya yolu):", e);
    setMusicIcon();
    return false;
  }
}

function pauseMusic(){
  if(!music) return;
  music.pause();
  setMusicIcon();
}

// Kullanıcı etkileşiminden sonra 1 kere dene
function tryStartMusicFromUserGesture(){
  if(!music) return;
  if(!music.paused) return; // zaten çalıyorsa
  playMusic();
}

// Sayfada ilk tıklamada müzik başlatmayı dene (Chrome autoplay için)
document.addEventListener("click", tryStartMusicFromUserGesture, { once: true });

// Butonla aç/kapat
musicBtn?.addEventListener("click", async ()=>{
  if(!music) return;

  if(music.paused){
    await playMusic();
  }else{
    pauseMusic();
  }
});

// İlk ikon durumu
setMusicIcon();