
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
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    container.innerHTML += `<input type="text" placeholder="Spieler ${i + 1}" id="name${i}">`;
  }
}

function confirmPlayers() {
  const count = parseInt(document.getElementById("playerCount").value);
  players = [];
  for (let i = 0; i < count; i++) {
    const name = document.getElementById(`name${i}`).value || `Spieler ${i + 1}`;
    players.push({ name: name, role: "Crewmate", revealed: false });
  }
  players[Math.floor(Math.random() * players.length)].role = "Impostor";
  localStorage.setItem("players", JSON.stringify(players));
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
  players.forEach((player, index) => {
    const div = document.createElement("div");
    div.className = "player-card";
    div.innerText = player.name;
    div.onclick = function () {
      if (!player.revealed) {
        player.revealed = true;
        div.classList.add("revealed");
        div.innerText = player.role === "Crewmate" ? `${player.name}\nWort: ${word}` : `${player.name}\nDu bist der Impostor!`;
      } else {
        player.revealed = false;
        div.classList.remove("revealed");
        div.innerText = player.name;
      }
    };
    container.appendChild(div);
  });
}

function restartGame() {
  localStorage.clear();
  window.location.href = "index.html";
}
