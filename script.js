const moodData = {
  happy: {
    color: "#FFF9C4",
    quoteBg: "#FFECB3",
    quotes: ["Your happiness lights up the world."]
  },
  sad: {
    color: "#BBDEFB",
    quoteBg: "#B3E5FC",
    quotes: ["Even the darkest night will end, and the sun will rise."]
  },
  angry: {
    color: "#FFCDD2",
    quoteBg: "#FF8A80",
    quotes: ["Speak when you’re calm, not when you’re burning."]
  },
  tired: {
    color: "#ECEFF1",
    quoteBg: "#CFD8DC",
    quotes: ["Slow down. Even waves rest before crashing again."]
  },
  excited: {
    color: "#E1BEE7",
    quoteBg: "#CE93D8",
    quotes: ["Let your passion be the fire that leads your way."]
  }
};

let currentMood = null;

function createMoodButtons() {
  const container = document.querySelector(".mood-buttons");
  container.innerHTML = '';

  Object.keys(moodData).forEach((mood) => {
    const btn = document.createElement("button");
    btn.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);

    // Single-click: select mood
    btn.onclick = () => setMood(mood);

    // Double-click: remove only custom moods
    if (!["happy", "sad", "angry", "tired", "excited"].includes(mood)) {
      btn.ondblclick = () => {
        if (confirm(`Double-click detected. Remove custom mood "${mood}"?`)) {
          delete moodData[mood];
          saveCustomMoods();
          createMoodButtons();
          if (currentMood === mood) resetMood();
        }
      };
      btn.title = "Double-click to remove this custom mood";
    }

    container.appendChild(btn);
  });
}


function applyMood(mood) {
  const moodInfo = moodData[mood];
  if (moodInfo) {
    const quote = moodInfo.quotes[Math.floor(Math.random() * moodInfo.quotes.length)];
    document.body.style.backgroundColor = moodInfo.color;

    const moodEl = document.getElementById("current-mood");
    moodEl.innerText = mood.charAt(0).toUpperCase() + mood.slice(1);
    moodEl.style.backgroundColor = moodInfo.quoteBg || "#dddddd";
    moodEl.style.color = "#ffffff";

    const quoteEl = document.getElementById("quote");
    quoteEl.innerText = quote;
    quoteEl.style.backgroundColor = moodInfo.quoteBg || "#eeeeee";
    quoteEl.style.color = "#000000";
    quoteEl.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";

    currentMood = mood;
    localStorage.setItem("lastMood", mood);
  }
}

function resetMood() {
  document.body.style.backgroundColor = "#ffffff";
  const moodEl = document.getElementById("current-mood");
  moodEl.innerText = "Your Mood";
  moodEl.style.backgroundColor = "#eeeeee";
  moodEl.style.color = "#333";

  const quoteEl = document.getElementById("quote");
  quoteEl.innerText = "Select a mood to see a quote.";
  quoteEl.style.backgroundColor = "#ffffff";
  quoteEl.style.color = "#000000";
  quoteEl.style.boxShadow = "none";

  currentMood = null;
  localStorage.removeItem("lastMood");
}

function setMood(mood) {
  if (currentMood === mood) {
    resetMood();
  } else {
    applyMood(mood);
  }
}

document.getElementById("addMoodForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("newMood").value.trim().toLowerCase();
  const color = document.getElementById("newColor").value;
  const quoteBg = document.getElementById("newQuoteBg").value;
  const quote = document.getElementById("newQuote").value.trim();

  if (!name || !quote) return;

  moodData[name] = {
    color: color,
    quoteBg: quoteBg,
    quotes: [quote]
  };

  saveCustomMoods();
  createMoodButtons();
  resetMood();
  this.reset();
});

function removeMood(mood) {
  if (confirm(`Are you sure you want to remove the mood "${mood}"?`)) {
    delete moodData[mood];
    saveCustomMoods();
    createMoodButtons();
    if (currentMood === mood) resetMood();
  }
}

function saveCustomMoods() {
  const customMoods = {};
  for (let mood in moodData) {
    if (!["happy", "sad", "angry", "tired", "excited"].includes(mood)) {
      customMoods[mood] = moodData[mood];
    }
  }
  localStorage.setItem("customMoods", JSON.stringify(customMoods));
}

function loadCustomMoods() {
  const stored = localStorage.getItem("customMoods");
  if (stored) {
    const custom = JSON.parse(stored);
    for (let mood in custom) {
      moodData[mood] = custom[mood];
    }
  }
}

window.onload = () => {
  resetMood();
  loadCustomMoods();
  createMoodButtons();
};
