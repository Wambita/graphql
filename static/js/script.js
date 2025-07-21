import { login, logout, isLoggedIn } from "./auth.js";
import { fetchGraphQl } from "./query.js";

async function loadProfile() {
  try {
    const data = await fetchGraphQl();
    if (!data) {
  console.error("❌ No data returned from fetchGraphQl()");
  return;
}
    console.log("GraphQL data:", data);

    const user = data.user?.[0];
    const event = data.event?.[0];

    console.log("👤 user:", user);
    console.log("📅 event:", event);


    if (!user) {
      console.error("User data missing.");
      return;
    }


    // Fill in the UI
    const fullName = `${user.attrs?.firstName || ""} ${user.attrs?.middleName || ""} ${user.attrs?.lastName || ""}`.trim();
    document.getElementById("welcomeMessage").textContent = `Welcome ${fullName || "User"}!`;

    document.getElementById("userId").textContent = user.id || "N/A";
    document.getElementById("userLogin").textContent = user.login || "N/A";
    document.getElementById("userEmail").textContent = user.email || "N/A";

    document.getElementById("campusName").textContent = user.campus|| "N/A";
    document.getElementById("campusCountry").textContent = user.attrs?.country || "N/A";

    document.getElementById("moduleStart").textContent = event?.startAt?.split("T")[0] || "N/A";
    document.getElementById("moduleEnd").textContent = event?.endAt?.split("T")[0] || "N/A";

  } catch (err) {
    console.error("Failed to load profile:", err);
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