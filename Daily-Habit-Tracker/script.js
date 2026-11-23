// ===== Daily Habit Tracker - script.js =====
// A habit is stored as: { id: 123, name: "Drink water", icon: "💧", doneDates: ["2026-11-15"] }

var STORAGE_KEY = "dailyHabitTracker";
var THEME_KEY = "dailyHabitTheme";

// Icons the user can choose from, each with its own card colour
var ICONS = [
  { icon: "💧", label: "Water",        color: "#2f80ed" },
  { icon: "📚", label: "Education",     color: "#8e5cf7" },
  { icon: "🏃", label: "Exercise",     color: "#f2603d" },
  { icon: "😴", label: "Sleep",        color: "#5c6bc0" },
  { icon: "🧘", label: "Relax",        color: "#1fa98a" },
  { icon: "🥗", label: "Healthy food", color: "#43a047" },
  { icon: "✍️", label: "Writing",      color: "#d98200" },
  { icon: "💻", label: "Coding",       color: "#0e9fbc" }
];

var habits = [];                 // all habits
var selectedIcon = ICONS[0].icon;
var toastTimer = null;


// ---------- 1. Small helpers ----------

// Creates an element with an optional class and text
function el(tag, className, text) {
  var e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

function plural(n, word) {
  return n + " " + word + (n === 1 ? "" : "s");
}

function colorFor(icon) {
  for (var i = 0; i < ICONS.length; i++) {
    if (ICONS[i].icon === icon) return ICONS[i].color;
  }
  return "#2f80ed";
}

// Date as text like "2026-11-15" (local time)
function dateKey(date) {
  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
}

// Key for "n days ago" (0 = today)
function daysAgo(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  return dateKey(d);
}

function nextDay(key) {
  var p = key.split("-");
  return dateKey(new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]) + 1));
}


// ---------- 2. Saving and loading (localStorage) ----------

function saveHabits() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    toast("Could not save your habits in this browser.", "error");
  }
}

function loadHabits() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      habits = saved.filter(function (h) {
        return h && h.name && Array.isArray(h.doneDates);
      });
    }
  } catch (error) {
    habits = [];
  }
}


// ---------- 3. Streaks ----------

// Days in a row ending today (or yesterday, if today is not ticked yet)
function currentStreak(habit) {
  var streak = 0;
  var day = habit.doneDates.includes(daysAgo(0)) ? 0 : 1;
  while (habit.doneDates.includes(daysAgo(day))) {
    streak++;
    day++;
  }
  return streak;
}

// Longest run of consecutive days ever recorded
function bestStreak(habit) {
  var dates = habit.doneDates.slice().sort();
  var best = 0, run = 0, previous = null;
  for (var i = 0; i < dates.length; i++) {
    run = (previous !== null && nextDay(previous) === dates[i]) ? run + 1 : 1;
    if (run > best) best = run;
    previous = dates[i];
  }
  return best;
}

function allDoneToday() {
  return habits.length > 0 && habits.every(function (h) {
    return h.doneDates.includes(daysAgo(0));
  });
}


// ---------- 4. Feedback: toast and confetti ----------

function toast(text, type) {
  var t = document.getElementById("toast");
  t.textContent = text;
  t.className = "toast show " + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.className = "toast"; }, 3200);
}

function confetti() {
  var colors = ["#f2b134", "#1fa98a", "#2f80ed", "#e5484d", "#8e5cf7"];
  for (var i = 0; i < 44; i++) {
    var piece = el("i", "confetti");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    piece.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
    document.body.appendChild(piece);
    setTimeout(function (p) { p.remove(); }, 3000, piece);
  }
}


// ---------- 5. User actions ----------

function addHabit(event) {
  event.preventDefault();
  var input = document.getElementById("habitName");
  var name = input.value.trim();

  if (name === "") {
    input.classList.add("invalid");
    toast("Please type a habit name first.", "error");
    return;
  }
  for (var i = 0; i < habits.length; i++) {
    if (habits[i].name.toLowerCase() === name.toLowerCase()) {
      input.classList.add("invalid");
      toast("\"" + name + "\" is already in your list.", "error");
      return;
    }
  }

  habits.push({ id: Date.now(), name: name, icon: selectedIcon, doneDates: [] });
  saveHabits();
  render();
  input.value = "";
  input.focus();
  toast("Habit added. Tick it off when you are done today.", "ok");
}

// Tick or untick a habit on a given day (today or any of the last 6 days)
function toggleDate(id, key) {
  var wasAllDone = allDoneToday();
  var habit = habits.find(function (h) { return h.id === id; });
  var index = habit.doneDates.indexOf(key);
  if (index === -1) {
    habit.doneDates.push(key);
  } else {
    habit.doneDates.splice(index, 1);
  }
  saveHabits();
  render();
  if (!wasAllDone && allDoneToday()) {
    confetti();
    toast("All habits done today. Excellent work!", "ok");
  }
}

function deleteHabit(id) {
  var habit = habits.find(function (h) { return h.id === id; });
  if (!habit || !confirm("Delete \"" + habit.name + "\" and its history?")) return;
  habits = habits.filter(function (h) { return h.id !== id; });
  saveHabits();
  render();
  toast("Habit deleted.", "ok");
}


// ---------- 6. Drawing the page ----------

// One clickable day in the 7-day strip
function makeDay(habit, offset) {
  var date = new Date();
  date.setDate(date.getDate() - offset);
  var key = dateKey(date);
  var on = habit.doneDates.includes(key);

  var btn = el("button", "day" + (on ? " on" : "") + (offset === 0 ? " today" : ""));
  btn.type = "button";
  btn.title = offset === 0 ? "Today" : key;
  btn.setAttribute("aria-pressed", on);
  btn.setAttribute("aria-label", habit.name + " on " + key);
  btn.appendChild(el("b", "", on ? "✓" : date.getDate()));
  btn.appendChild(el("span", "", date.toLocaleDateString("en-US", { weekday: "short" })));
  btn.addEventListener("click", function () { toggleDate(habit.id, key); });
  return btn;
}

function render() {
  var list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach(function (habit) {
    var doneToday = habit.doneDates.includes(daysAgo(0));
    var card = el("li", "habit" + (doneToday ? " done" : ""));
    card.style.setProperty("--c", colorFor(habit.icon));

    // top row: icon, name, streak badge, tick button
    var head = el("div", "habit-head");
    var info = el("div");
    var current = currentStreak(habit);
    info.appendChild(el("div", "name", habit.name));
    info.appendChild(el("span", "badge",
      current === 0 ? "No streak yet" : "🔥 " + plural(current, "day") + " streak"));

    var check = el("button", "check", "✓");
    check.type = "button";
    check.setAttribute("aria-pressed", doneToday);
    check.setAttribute("aria-label", "Mark " + habit.name + " as done today");
    check.addEventListener("click", function () { toggleDate(habit.id, daysAgo(0)); });

    head.appendChild(el("div", "tile", habit.icon));
    head.appendChild(info);
    head.appendChild(check);

    // last 7 days (oldest on the left, today on the right)
    var week = el("div", "week");
    for (var i = 6; i >= 0; i--) {
      week.appendChild(makeDay(habit, i));
    }

    // bottom row: best streak and delete
    var foot = el("div", "foot");
    foot.appendChild(el("span", "", "Best streak: " + plural(bestStreak(habit), "day")));
    var del = el("button", "delete", "Delete");
    del.type = "button";
    del.setAttribute("aria-label", "Delete " + habit.name);
    del.addEventListener("click", function () { deleteHabit(habit.id); });
    foot.appendChild(del);

    card.appendChild(head);
    card.appendChild(week);
    card.appendChild(foot);
    list.appendChild(card);
  });

  document.getElementById("emptyState").hidden = habits.length > 0;
  updateSummary();
}

// Progress bars, best streak and the hero message
function updateSummary() {
  var total = habits.length;

  var doneToday = 0;
  var weekDone = 0;
  var best = 0;
  habits.forEach(function (h) {
    if (h.doneDates.includes(daysAgo(0))) doneToday++;
    for (var i = 0; i < 7; i++) {
      if (h.doneDates.includes(daysAgo(i))) weekDone++;
    }
    best = Math.max(best, bestStreak(h));
  });

  var todayPct = total === 0 ? 0 : Math.round(doneToday / total * 100);
  var weekPct = total === 0 ? 0 : Math.round(weekDone / (total * 7) * 100);

  document.getElementById("todayPct").textContent = todayPct + "%";
  document.getElementById("todayFill").style.width = todayPct + "%";
  document.getElementById("todayText").textContent = doneToday + " of " + plural(total, "habit") + " done";
  document.getElementById("weekPct").textContent = weekPct + "%";
  document.getElementById("weekFill").style.width = weekPct + "%";
  document.getElementById("weekText").textContent = weekDone + " of " + total * 7 + " check-ins";
  document.getElementById("bestStreak").textContent = best;

  var message;
  if (total === 0) message = "Add your first habit below and start your streak today.";
  else if (doneToday === 0) message = "A fresh day. Tick off your first habit to get moving.";
  else if (todayPct === 100) message = "All habits done today. Excellent work!";
  else if (todayPct >= 50) message = "More than halfway there. Keep going!";
  else message = "Good start. Every tick counts.";
  document.getElementById("motivation").textContent = message;
}

function setGreeting() {
  var hour = new Date().getHours();
  var text = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  document.getElementById("greeting").textContent = text + ".";
  document.getElementById("todayLabel").textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}


// ---------- 7. Icon picker and light/dark theme ----------

function buildIconPicker() {
  var box = document.getElementById("iconPicker");
  ICONS.forEach(function (item) {
    var btn = el("button", "icon-btn");
    btn.type = "button";
    btn.appendChild(el("span", "icon-emoji", item.icon));
    btn.appendChild(el("span", "icon-label", item.label));
    btn.style.setProperty("--c", item.color);
    btn.addEventListener("click", function () {
      selectedIcon = item.icon;
      markSelectedIcon();
    });
    box.appendChild(btn);
  });
  markSelectedIcon();
}

function markSelectedIcon() {
  var buttons = document.getElementById("iconPicker").children;
  for (var i = 0; i < buttons.length; i++) {
    var chosen = ICONS[i].icon === selectedIcon;
    buttons[i].classList.toggle("selected", chosen);
    buttons[i].setAttribute("aria-pressed", chosen);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem(THEME_KEY, theme); } catch (error) {}
}

function initTheme() {
  var theme = null;
  try { theme = localStorage.getItem(THEME_KEY); } catch (error) {}
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(theme);
}


// ---------- 8. Start the app ----------

document.getElementById("habitForm").addEventListener("submit", addHabit);
document.getElementById("habitName").addEventListener("input", function (e) {
  e.target.classList.remove("invalid");
});
document.getElementById("themeBtn").addEventListener("click", function () {
  var current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});
window.addEventListener("focus", function () { setGreeting(); render(); }); // refresh after midnight

initTheme();
buildIconPicker();
setGreeting();
loadHabits();
render();