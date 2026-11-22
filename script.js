
// Wedding countdown: 31 January 2027, 2 PM IST

const weddingDate = new Date("2027-01-31T14:00:00+05:30").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  document.getElementById("days").textContent =
    Math.floor(distance / 86400000);

  document.getElementById("hours").textContent =
    Math.floor((distance % 86400000) / 3600000);

  document.getElementById("minutes").textContent =
    Math.floor((distance % 3600000) / 60000);

  document.getElementById("seconds").textContent =
    Math.floor((distance % 60000) / 1000);
}

updateCountdown();
setInterval(updateCountdown, 1000);


// INVITATION OPENING

const gate = document.getElementById("invitationGate");
const openButton = document.getElementById("openInvitation");
const siteContent = document.getElementById("siteContent");

let invitationOpened = false;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createCelebration() {
  const symbols = ["✦", "✧", "❀", "✿", "❋", "·", "✺"];
  const particleCount = 75;

  // Sparkles and petals falling from above
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    const isPetal = Math.random() > 0.55;

    particle.className = "celebration-particle" + (isPetal ? " petal" : "");
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = randomBetween(0, 100) + "vw";
    particle.style.top = randomBetween(-20, 0) + "vh";
    particle.style.fontSize = randomBetween(12, 25) + "px";
    particle.style.setProperty("--duration", randomBetween(2.5, 5) + "s");
    particle.style.setProperty("--drift", randomBetween(-100, 100) + "px");
    particle.style.setProperty("--spin", randomBetween(180, 720) + "deg");

    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
  }

  // A second burst of petals from the left and right edges
  for (let i = 0; i < 24; i++) {
    const petal = document.createElement("span");
    const fromLeft = i % 2 === 0;

    petal.className = "celebration-particle petal side-petal";
    petal.textContent = ["❀", "✿", "❋"][i % 3];

    petal.style.left = fromLeft ? "-20px" : "calc(100vw + 20px)";
    petal.style.top = randomBetween(15, 75) + "vh";
    petal.style.fontSize = randomBetween(18, 30) + "px";
    petal.style.setProperty("--duration", randomBetween(2, 3.8) + "s");
    petal.style.setProperty("--side-drift", fromLeft ? "150px" : "-150px");
    petal.style.setProperty("--spin", randomBetween(180, 540) + "deg");

    document.body.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}

openButton.addEventListener("click", () => {
  if (invitationOpened) return;
  invitationOpened = true;
  startWeddingMusic();

  // Start the envelope opening animation
  gate.classList.add("opening");
  openButton.disabled = true;
  openButton.innerHTML = "<span>REVEALING YOUR INVITATION</span> <span>✦</span>";

  // Release the website after the surprise animation begins
  window.setTimeout(() => {
    createCelebration();

    document.body.classList.remove("is-locked");
    siteContent.removeAttribute("inert");
    siteContent.setAttribute("aria-hidden", "false");

    gate.classList.add("closing");

    window.setTimeout(() => {
      gate.remove();
      window.scrollTo(0, 0);
    }, 850);
  }, 1250);
});


// MOBILE NAVIGATION

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menu.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});


// BACKGROUND MUSIC

// START WEDDING MUSIC WHEN INVITATION IS OPENED

const music = document.getElementById("weddingMusic");

async function startWeddingMusic() {
  try {
    await music.play();
  } catch (error) {
    console.log("Music could not start automatically:", error);
  }
}

// WHATSAPP SHARING

const invitation =
  "You're invited to Shubham & Karuna's wedding! " +
  "29–31 January 2027 at Parinay Vatika, Near RRCAT Square, Indore. " +
  "We can't wait to celebrate with you! " + window.location.href;

document.getElementById("whatsappShare").href =
  "https://wa.me/?text=" + encodeURIComponent(invitation);

document.getElementById("whatsappShare").target = "_blank";
document.getElementById("whatsappShare").rel = "noopener";
