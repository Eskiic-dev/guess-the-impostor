let players = [];
let selectedCategory = "";
let chosenWord = "";

const categoryFiles = {
  "🌍 Rund um die Welt": "Welt_woerter.json",
  "🎬 Unterhaltung": "Unterhaltung_woerter.json",
  "🏠 Alltag": "Alltag_woerter.json",
  "🐾 Tiere & Natur": "Natur_woerter.json",
  "⚽ Sport & Freizeit": "Freizeit_woerter.json",
  "📚 Wissen & Schule": "Schule_woerter.json",
  "🎉 Feste & Feiern": "Feiern_woerter.json",
  "🇩🇪 Deutsche Begriffe": "Begriffe_woerter.json",
  "⭐ Stars & Promis": "Promis_woerter.json",
  "🌶️ Spicy": "Spicy_woerter.json"
};

function generateNameInputs() {
  const count = parseInt(document.getElementById("playerCount").value);
  const container = document.getElementById("nameInputs");
  const savedNames = JSON.parse(localStorage.getItem("playerNames") || "[]");

  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const value = savedNames[i] || "";
    container.innerHTML += `<input type="text" placeholder="Spieler ${i + 1}" id="name${i}" value="${value}">`;
  }
}

function confirmPlayers() {
  console.log('Spiel starten gedrückt');
  const count = parseInt(document.getElementById("playerCount").value);
  if (isNaN(count) || count < 3) {
    alert("Bitte mindestens 3 Spieler eingeben.");
    return;
  }

  players = [];
  let namesToStore = [];

  for (let i = 0; i < count; i++) {
    const name = document.getElementById(`name${i}`).value || `Spieler ${i + 1}`;
    players.push({ name: name, role: "Crewmate" });
    namesToStore.push(name);
  }

  players[Math.floor(Math.random() * players.length)].role = "Impostor";
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("playerNames", JSON.stringify(namesToStore));
  console.log('Weiterleitung zur Kategorie...');
  window.location.href = "categories.html";
}

function loadCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  for (const cat in categoryFiles) {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.onclick = () => {
      const file = categoryFiles[cat];
      fetch(file)
        .then(res => res.json())
        .then(words => {
          const word = words[Math.floor(Math.random() * words.length)];
          localStorage.setItem("selectedCategory", cat);
          localStorage.setItem("word", word);
          window.location.href = "game.html";
        })
        .catch(() => alert("Fehler beim Laden der Wörterdatei."));
    };
    btn.className = "category-button";
    list.appendChild(btn);
  }
}

function renderCards() {
  const container = document.getElementById("cardsContainer");
  const players = JSON.parse(localStorage.getItem("players"));
  const word = localStorage.getItem("word");
  container.innerHTML = "";

  players.forEach((player) => {
    const div = document.createElement("div");
    div.className = "player-card";
    div.innerText = player.name;

    div.onclick = function () {
      if (!div.classList.contains("revealed")) {
        div.classList.add("revealed");
        div.innerText = player.role === "Crewmate" ? word : 'Du bist der Impostor!';
      } else {
        div.classList.remove("revealed");
        div.innerText = player.name;
      }
    };

    container.appendChild(div);
  });
}

function restartGame() {
  localStorage.removeItem("players");
  localStorage.removeItem("selectedCategory");
  localStorage.removeItem("word");
  window.location.href = "index.html";
}