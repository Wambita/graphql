const SIGNIN_ENDPOINT =  "https://learn.zone01kisumu.ke/api/auth/signin";

//Encode  credentials for BasicAuth
export function encodeCredentials(username, password) {
    return btoa(`${username}:${password}`);
}

//login and  store  jwt
export async function login(username, password) {
    const basicAuth = encodeCredentials(username, password);
    const response = await fetch(SIGNIN_ENDPOINT, {
        method : "POST",
        headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(error.message||"Invalid Credentials");
    }

    const token = await response.text(); // raw jwt
    localStorage.setItem("jwt", token);
    return token;
}

//get stored  token
export function getToken() {
    return localStorage.getItem("jwt");
}

//check if  user is  logged in
export function isLoggedIn() {
    return !!getToken();
}

//logout
export function logout() {
    localStorage.removeItem("jwt");
}