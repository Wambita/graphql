import { login, logout, isLoggedIn } from "./auth.js";
import { fetchGraphQl } from "./query.js";
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

    // ==== Stats Section ====

    // Get DOM elements
    const xpEl = document.getElementById("totalXp");
    const levelEl = document.getElementById("level");
    const rankEl = document.getElementById("rank");
    const auditRatioEl = document.getElementById("auditRatio");
    const gradeEl = document.getElementById("latestGrade");
    // Total XP
 const totalXP = user.transactions.reduce((totalXP, transaction) => {
  return (transaction.type === "xp" && transaction.eventId === 75) ? totalXP + transaction.amount : totalXP;
}, 0);
    const [xpValue, xpUnit] = formatXP(totalXP);
    xpEl.textContent = `${xpValue} ${xpUnit}`;

    // Grade
    const latestGrade = currentUser.progresses?.[0]?.grade ?? "N/A";
    gradeEl.textContent = typeof latestGrade === "number" ? latestGrade.toFixed(2) : "N/A";

    // Level & Rank
    const level = currentUser.events?.[0]?.level ?? 0;
    levelEl.textContent = level;

    const rankLevels = [
      "Aspiring Developer", "Beginner Developer", "Apprentice Developer",
      "Assistant Developer", "Basic Developer", "Junior Developer",
      "Intermediate Developer", "Senior Developer", "Lead Developer", "Mentor Developer"
    ];
    const rankIndex = Math.floor(level / 10);
    rankEl.textContent = rankLevels[rankIndex] || "Developer";

    // Audit Ratio
    const auditRatio = currentUser.auditRatio ?? null;
    auditRatioEl.textContent = auditRatio !== null ? auditRatio.toFixed(2) : "N/A";

  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

function formatXP(bytes) {
  if (bytes >= 1_000_000) {
    return [(bytes / 1_000_000).toFixed(2), "MB"];
  } else if (bytes >= 1_000) {
    return [(bytes / 1_000).toFixed(2), "KB"];
  } else {
    return [bytes, "Bytes"];
  }
}
//elements
const loginPage = document.getElementById("loginPage");
const profilePage = document.getElementById("profilePage");
const loginBtn = document.getElementById("login-button");
const logoutBtn = document.getElementById("logoutBtn");
const errorMessage = document.getElementById("errorMessage") || { textContent: "" };

//show/hide
function showLogin(){
    loginPage.classList.remove("hidden");
    profilePage.classList.add("hidden");
}

function showProfile() {
    loginPage.classList.add("hidden");
    profilePage.classList.remove("hidden");
}

//handle login
loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    errorMessage.textContent = ""; 
    try {
        await login(username, password);
        showProfile();
        await loadProfile();
    } catch (e) {
        errorMessage.textContent = e.message;
    }

});


//handle logout\
logoutBtn.addEventListener("click", () => {
    logout();
    showLogin();
});


//when page loads
window.addEventListener("DOMContentLoaded" , async() => {
    if (isLoggedIn()) {
        showProfile();
        await loadProfile();
    } else {
        showLogin();
    }
});


