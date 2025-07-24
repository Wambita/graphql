import { login, logout, isLoggedIn } from "./auth.js";
import { fetchGraphQl } from "./query.js";
import { generateXPGraph, generatePassFailPie } from "./graph.js";

let currentUser = null;

async function loadProfile() {
  try {
    const data = await fetchGraphQl();
    if (!data) {
      console.error("No data returned from fetchGraphQl()");
      return;
    }

    const user = data.user?.[0];
    const event = data.event?.[0];

    if (!user) {
      console.error("User data missing.");
      return;
    }

    currentUser = user;

    // Fill in UI basic info
    const fullName = `${user.attrs?.firstName || ""} ${user.attrs?.middleName || ""} ${user.attrs?.lastName || ""}`.trim();
    document.getElementById("welcomeMessage").textContent = `Welcome ${fullName || "User"}!`;

    document.getElementById("userId").textContent = user.id || "N/A";
    document.getElementById("userLogin").textContent = user.login || "N/A";
    document.getElementById("userEmail").textContent = user.email || "N/A";
    document.getElementById("campusName").textContent = user.campus || "N/A";
    document.getElementById("campusCountry").textContent = user.attrs?.country || "N/A";
    document.getElementById("moduleStart").textContent = event?.startAt?.split("T")[0] || "N/A";
    document.getElementById("moduleEnd").textContent = event?.endAt?.split("T")[0] || "N/A";

    // Stats Section
    const xpEl = document.getElementById("totalXp");
    const levelEl = document.getElementById("level");
    const rankEl = document.getElementById("rank");
    const auditRatioEl = document.getElementById("auditRatio");
    const gradeEl = document.getElementById("latestGrade");

    const totalXP = user.transactions.reduce((totalXP, transaction) => {
      return (transaction.type === "xp" && transaction.eventId === 75) ? totalXP + transaction.amount : totalXP;
    }, 0);

    const [xpValue, xpUnit] = formatXP(totalXP);
    xpEl.textContent = `${xpValue} ${xpUnit}`;

    const latestGrade = currentUser.progresses?.[0]?.grade ?? "N/A";
    gradeEl.textContent = typeof latestGrade === "number" ? latestGrade.toFixed(2) : "N/A";

    const level = currentUser.events?.[0]?.level ?? 0;
    levelEl.textContent = level;

    const rankLevels = [
      "Aspiring Developer", "Beginner Developer", "Apprentice Developer",
      "Assistant Developer", "Basic Developer", "Junior Developer",
      "Intermediate Developer", "Senior Developer", "Lead Developer", "Mentor Developer"
    ];
    const rankIndex = Math.floor(level / 10);
    rankEl.textContent = rankLevels[rankIndex] || "Developer";

    const auditRatio = currentUser.auditRatio ?? null;
    auditRatioEl.textContent = auditRatio !== null ? auditRatio.toFixed(2) : "N/A";

    // Generate Graphs
    generateXPGraph(user.transactions, event.startAt, event.endAt);
    generatePassFailPie(user.progresses);

  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

function formatXP(bytes) {
  if (bytes >= 1_000_000) return [(bytes / 1_000_000).toFixed(2), "MB"];
  if (bytes >= 1_000) return [(bytes / 1_000).toFixed(2), "KB"];
  return [bytes, "Bytes"];
}

// DOM Elements
const loginPage = document.getElementById("loginPage");
const profilePage = document.getElementById("profilePage");
const loginBtn = document.getElementById("login-button");
const logoutBtn = document.getElementById("logoutBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage") || { textContent: "" };
const togglePasswordBtn = document.getElementById("togglePasswordVisibility");
const eyeOpenPaths = document.querySelectorAll(".eye-open-path");
const eyeClosedPath = document.querySelector(".eye-closed-path");

// Show/Hide Screens
function showLogin() {
  loginPage.classList.remove("hidden");
  profilePage.classList.add("hidden");
}

function showProfile() {
  loginPage.classList.add("hidden");
  profilePage.classList.remove("hidden");
}

// Handle login
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  errorMessage.textContent = "";

  try {
    await login(username, password);
    showProfile();
    await loadProfile();
  } catch (e) {
    errorMessage.textContent = e.message;
  }
});

// Handle logout
logoutBtn.addEventListener("click", () => {
  logout();
  showLogin();
});

// Enable Enter key for login
[usernameInput, passwordInput].forEach(input => {
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      loginBtn.click();
    }
  });
});

// Toggle password visibility
document.getElementById("togglePasswordVisibility").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const eyeOpenPaths = document.querySelectorAll(".eye-open-path");
  const eyeClosedPaths = document.querySelectorAll(".eye-closed-path");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpenPaths.forEach(p => p.classList.add("hidden-path"));
    eyeClosedPaths.forEach(p => p.classList.remove("hidden-path"));
  } else {
    passwordInput.type = "password";
    eyeOpenPaths.forEach(p => p.classList.remove("hidden-path"));
    eyeClosedPaths.forEach(p => p.classList.add("hidden-path"));
  }
});

// On page load
window.addEventListener("DOMContentLoaded", async () => {
  if (isLoggedIn()) {
    showProfile();
    await loadProfile();
  } else {
    showLogin();
  }
});
