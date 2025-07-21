const SIGNIN_URL = "https://learn.zone01kisumu.ke/api/auth/signin";

export async function login(username, password) {
  const credentials = btoa(`${username}:${password}`); // Encode username:password
  const res = await fetch(SIGNIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }


 const raw = await res.text();
const token = raw.replace(/^"|"$/g, ""); 
localStorage.setItem("jwt", token);
  if (!token) {
    throw new Error("Login successful, but no token returned.");
  }

}

export function getToken() {
  return localStorage.getItem("jwt");
}

export function logout() {
  localStorage.removeItem("jwt");
}

export function isLoggedIn() {
  return !!getToken();
}
