
// ==========================================
// WEDDING COUNTDOWN
// Wedding: 31 January 2027, 2:00 PM IST
// ==========================================

const weddingDate = new Date("2027-01-31T14:00:00+05:30").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  if (distance <= 0) {
    Object.values(countdownElements).forEach(element => {
      if (element) element.textContent = "00";
    });
    return;
  }

  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = countdownElements[id];

    if (element) {
      element.textContent = String(value).padStart(2, "0");
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================
// INVITATION OPENING
// ==========================================

const gate = document.getElementById("invitationGate");
const openButton = document.getElementById("openInvitation");
const siteContent = document.getElementById("siteContent");

let invitationOpened = false;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}


// ==========================================
// CELEBRATION EFFECTS
// Sparkles and petals from above and sides
// ==========================================

function createCelebration() {
  const symbols = ["✦", "✧", "❀", "✿", "❋", "·", "✺"];
  const particleCount = 75;

  // Sparkles and petals falling from above
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    const isPetal = Math.random() > 0.55;

    particle.className =
      "celebration-particle" + (isPetal ? " petal" : "");

    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = randomBetween(0, 100) + "vw";
    particle.style.top = randomBetween(-20, 0) + "vh";
    particle.style.fontSize = randomBetween(12, 25) + "px";

    particle.style.setProperty(
      "--duration",
      randomBetween(2.5, 5) + "s"
    );

    particle.style.setProperty(
      "--drift",
      randomBetween(-100, 100) + "px"
    );

    particle.style.setProperty(
      "--spin",
      randomBetween(180, 720) + "deg"
    );

    document.body.appendChild(particle);

    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }

  // Petals entering from the left and right sides
  for (let i = 0; i < 24; i++) {
    const petal = document.createElement("span");
    const fromLeft = i % 2 === 0;

    petal.className =
      "celebration-particle petal side-petal";

    petal.textContent = ["❀", "✿", "❋"][i % 3];

    petal.style.left = fromLeft
      ? "-20px"
      : "calc(100vw + 20px)";

    petal.style.top = randomBetween(15, 75) + "vh";
    petal.style.fontSize = randomBetween(18, 30) + "px";

    petal.style.setProperty(
      "--duration",
      randomBetween(2, 3.8) + "s"
    );

    petal.style.setProperty(
      "--side-drift",
      fromLeft ? "150px" : "-150px"
    );

    petal.style.setProperty(
      "--spin",
      randomBetween(180, 540) + "deg"
    );

    document.body.appendChild(petal);

    petal.addEventListener("animationend", () => {
      petal.remove();
    });
  }
}


// ==========================================
// OPEN INVITATION
// ==========================================

if (openButton && gate && siteContent) {
  openButton.addEventListener("click", () => {
    if (invitationOpened) return;

    invitationOpened = true;

    // Start music directly from the user's click
    startWeddingMusic();

    // Begin envelope opening animation
    gate.classList.add("opening");
    openButton.disabled = true;

    openButton.innerHTML =
      "<span>REVEALING YOUR INVITATION</span> <span>✦</span>";

    // Reveal the website after the opening animation begins
    window.setTimeout(() => {
      createCelebration();

      document.body.classList.remove("is-locked");

      siteContent.removeAttribute("inert");
      siteContent.setAttribute("aria-hidden", "false");

      gate.classList.add("closing");

      // Remove the invitation gate after its closing animation
      window.setTimeout(() => {
        gate.remove();
        window.scrollTo(0, 0);
      }, 850);

    }, 1250);
  });
}


// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menu && nav) {
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
}


// ==========================================
// WEDDING BACKGROUND MUSIC
// ==========================================

const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

// Music is enabled by default.
// The browser will attempt playback when the invitation is opened.
let musicEnabled = true;


// Update the speaker button appearance and accessibility labels
function updateMusicButton() {
  if (!musicToggle) return;

  musicToggle.textContent = musicEnabled ? "🔊" : "🔇";

  musicToggle.setAttribute(
    "aria-label",
    musicEnabled
      ? "Mute wedding music"
      : "Unmute wedding music"
  );

  musicToggle.setAttribute(
    "aria-pressed",
    String(musicEnabled)
  );
}


// Start music when the invitation is opened
function startWeddingMusic() {
  if (!music) return;

  music.muted = !musicEnabled;

  if (!musicEnabled) {
    updateMusicButton();
    return;
  }

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateMusicButton();
      })
      .catch(error => {
        console.log("Music could not start:", error);
        updateMusicButton();
      });
  }

  updateMusicButton();
}


// Speaker button: mute or unmute music
if (musicToggle && music) {
  updateMusicButton();

  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled;

    music.muted = !musicEnabled;

    // If the invitation is already open, start playback
    // when the user turns the music back on.
    if (musicEnabled && invitationOpened && music.paused) {
      const playPromise = music.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Music could not start:", error);
        });
      }
    }

    updateMusicButton();
  });

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);
  music.addEventListener("volumechange", updateMusicButton);
}


// ==========================================
// WHATSAPP INVITATION SHARING
// ==========================================

const whatsappShare = document.getElementById("whatsappShare");

if (whatsappShare) {
  const invitation =
    "You're invited to Shubham & Karuna's wedding! " +
    "29–31 January 2027 at Parinay Vatika, " +
    "Near RRCAT Square, Indore. " +
    "We can't wait to celebrate with you! " +
    window.location.href;

  whatsappShare.href =
    "https://wa.me/?text=" + encodeURIComponent(invitation);

  whatsappShare.target = "_blank";
  whatsappShare.rel = "noopener noreferrer";
}

// WEDDING CALENDAR DOWNLOAD - AUTOMATED


// WEDDING CALENDAR DOWNLOAD - AUTOMATED

document.addEventListener("DOMContentLoaded", function () {

  const calendarButton = document.getElementById("addToCalendar");

  if (!calendarButton) return;

  calendarButton.addEventListener("click", function () {

    const venue =
      "Parinay Vatika, Near RRCAT Square, Indore, Madhya Pradesh, India";

    // Event times are in UTC.
    // They correspond to the published Indian Standard Time schedule.

    const events = [
      {
        title: "Mehendi - Shubham & Karuna",
        start: "20270129T153000Z",
        end: "20270129T173000Z"
      },
      {
        title: "Haldi - Shubham & Karuna",
        start: "20270130T033000Z",
        end: "20270130T053000Z"
      },
      {
        title: "Sangeet - Shubham & Karuna",
        start: "20270130T133000Z",
        end: "20270130T160000Z"
      },
      {
        title: "Wedding - Shubham & Karuna",
        start: "20270131T083000Z",
        end: "20270131T110000Z"
      },
      {
        title: "Reception - Shubham & Karuna",
        start: "20270131T143000Z",
        end: "20270131T173000Z"
      }
    ];

    function escapeICal(value) {
      return value
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    }

    const stamp = new Date().toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Shubham and Karuna//Wedding Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    events.forEach(function (event, index) {
      lines.push(
        "BEGIN:VEVENT",
        "UID:shubham-karuna-" + index + "-202701@wedding",
        "DTSTAMP:" + stamp,
        "DTSTART:" + event.start,
        "DTEND:" + event.end,
        "SUMMARY:" + escapeICal(event.title),
        "LOCATION:" + escapeICal(venue),
        "DESCRIPTION:" + escapeICal(
          "Join us to celebrate Shubham and Karuna's wedding!"
        ),
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");

    const calendarContent = lines.join("\r\n") + "\r\n";

    const blob = new Blob(
      [calendarContent],
      { type: "text/calendar;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Shubham-Karuna-Wedding.ics";

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Allow mobile browsers enough time to process the file.
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 60000);

  });

});

