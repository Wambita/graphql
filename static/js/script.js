import { login, logout, isLoggedIn } from "./auth.js";

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
window.addEventListener("DOMContentLoaded" , () => {
    if (isLoggedIn()) {
        showProfile();
    } else {
        showLogin();
    }
});