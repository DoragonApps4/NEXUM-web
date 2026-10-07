const API = "https://ywcrowviufbioeqixwrq.supabase.co";
const KEY = "sb_publishable_7YgYWeWv9XxpXP54gLBLRA_j_Nc-dih";
const SITE_URL = "https://nexumapps.github.io/";
const RESET_URL = "https://nexumapps.github.io/reset-password.html";
const APP_VERSION = "5.0";

const $ = id => document.getElementById(id);

function showMsg(text, type = "") {
  const el = $("authMsg");
  if (!el) return;
  el.hidden = false;
  el.className = `msg ${type}`;
  el.textContent = text;
}

function friendlyError(err) {
  const raw = String(err?.message || err || "").trim();
  const s = raw.toLowerCase();
  if (!raw) return "No se pudo completar la operación.";
  if (s.includes("user already registered") || s.includes("already been registered")) return "Ese correo ya está registrado. Intenta entrar o recuperar la contraseña.";
  if (s.includes("username") && (s.includes("duplicate") || s.includes("unique") || s.includes("already"))) return "Ese usuario NEXUM ya está ocupado. Elige otro.";
  if (s.includes("email") && s.includes("invalid")) return "El correo electrónico no es válido.";
  if (s.includes("password") && (s.includes("weak") || s.includes("at least"))) return "La contraseña debe tener al menos 8 caracteres.";
  if (s.includes("rate limit") || s.includes("too many")) return "Se alcanzó temporalmente el límite de intentos. Espera unos minutos y vuelve a probar.";
  if (s.includes("email rate limit")) return "Se alcanzó el límite temporal de correos. No hagas más intentos por ahora.";
  if (s.includes("credentials invalid") || s.includes("invalid login credentials")) return "Credenciales incorrectas o cuenta no verificada.";
  if (s.includes("failed to fetch") || s.includes("networkerror")) return "No se pudo conectar con NEXUM. Comprueba tu conexión a Internet.";
  return raw;
}

async function supa(path, options = {}) {
  const headers = {
    "apikey": KEY,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const response = await fetch(API + path, { ...options, headers });
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    const message = data.msg || data.message || data.error_description || data.error || `Error HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function getSession() {
  try { return JSON.parse(localStorage.getItem("nexum_session") || "null"); }
  catch { return null; }
}
function saveSession(data) { localStorage.setItem("nexum_session", JSON.stringify(data)); }
function clearSession() { localStorage.removeItem("nexum_session"); }
function accessToken() { return getSession()?.access_token || null; }

function setBusy(form, busy, label) {
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  if (busy) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.textContent = label || "Procesando…";
  } else {
    button.disabled = false;
    if (button.dataset.originalText) button.innerHTML = button.dataset.originalText;
  }
}

async function login(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const identifier = $("identifier").value.trim();
  const password = $("password").value;
  if (!identifier || !password) return showMsg("Escribe usuario/correo y contraseña.", "error");
  showMsg("Comprobando acceso…");
  setBusy(form, true, "Entrando…");
  try {
    const data = await supa("/functions/v1/login-with-username", {
      method: "POST",
      body: JSON.stringify({ identifier, password })
    });
    saveSession(data);
    await loadDashboard(data.access_token);
    showMsg("Acceso correcto.", "ok");
  } catch (err) {
    showMsg(friendlyError(err), "error");
  } finally {
    setBusy(form, false);
  }
}

async function signup(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const name = $("signupName").value.trim();
  const username = $("signupUsername").value.trim().toLowerCase();
  const email = $("signupEmail").value.trim().toLowerCase();
  const password = $("signupPassword").value;

  if (!name) return showMsg("Escribe tu nombre.", "error");
  if (!/^[a-z0-9_]{3,30}$/.test(username)) return showMsg("El usuario debe tener 3–30 caracteres: minúsculas, números o _.", "error");
  if (!email) return showMsg("Escribe tu correo electrónico.", "error");
  if (password.length < 8) return showMsg("La contraseña debe tener al menos 8 caracteres.", "error");

  showMsg("Creando tu cuenta…");
  setBusy(form, true, "Creando…");
  try {
    // Supabase Auth creates the auth user and the database trigger creates the NEXUM profile.
    const data = await supa("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        data: { username, display_name: name },
        email_redirect_to: SITE_URL
      })
    });

    if (data.access_token) {
      saveSession(data);
      await loadDashboard(data.access_token);
      showMsg("Cuenta creada correctamente.", "ok");
    } else {
      showMsg("Cuenta creada. Revisa tu correo para verificarla antes de entrar.", "ok");
    }
  } catch (err) {
    showMsg(friendlyError(err), "error");
  } finally {
    setBusy(form, false);
  }
}

async function recovery(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const email = $("recoveryEmail").value.trim().toLowerCase();
  if (!email) return showMsg("Escribe tu correo electrónico.", "error");
  showMsg("Solicitando recuperación…");
  setBusy(form, true, "Enviando…");
  try {
    await supa("/auth/v1/recover", {
      method: "POST",
      body: JSON.stringify({ email, redirect_to: RESET_URL })
    });
    showMsg("Si la cuenta puede recibir recuperación, recibirás un enlace por correo.", "ok");
  } catch (err) {
    showMsg(friendlyError(err), "error");
  } finally {
    setBusy(form, false);
  }
}

async function loadDashboard(token) {
  if (!token) return;
  try {
    const user = await supa("/auth/v1/user", { headers: { Authorization: `Bearer ${token}` } });
    const profile = await supa(`/rest/v1/profiles?select=username,display_name,role,is_active&id=eq.${encodeURIComponent(user.id)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const p = profile?.[0] || {};
    if (p.is_active === false) throw new Error("Esta cuenta está inactiva.");
    $("profileName").textContent = p.display_name || user.email || "Usuario NEXUM";
    $("profileUsername").textContent = p.username ? `@${p.username}` : "Cuenta NEXUM";
    $("dashboardGreeting").textContent = `Bienvenido, ${(p.display_name || "usuario").split(" ")[0]}.`;
    $("authCard").hidden = true;
    $("dashboard").hidden = false;
    document.querySelector("#acceso")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    clearSession();
    showMsg(friendlyError(err) || "La sesión ya no es válida. Vuelve a iniciar sesión.", "error");
  }
}

function logout() { clearSession(); location.reload(); }

function setAuthMode(mode) {
  const loginMode = mode === "login";
  document.querySelectorAll(".auth-tab").forEach(b => b.classList.toggle("active", b.dataset.auth === mode));
  $("loginForm").hidden = !loginMode;
  $("signupForm").hidden = loginMode;
  $("recoveryForm").hidden = true;
  $("authTitle").textContent = loginMode ? "Entrar a tu cuenta" : "Crear tu cuenta";
  $("authMsg").hidden = true;
}

function showRecovery() {
  document.querySelectorAll(".auth-tab").forEach(b => b.classList.remove("active"));
  $("loginForm").hidden = true;
  $("signupForm").hidden = true;
  $("recoveryForm").hidden = false;
  $("authTitle").textContent = "Recuperar contraseña";
  $("authMsg").hidden = true;
}

function boot() {
  document.title = `NEXUM · ${APP_VERSION}`;
  $("loginForm")?.addEventListener("submit", login);
  $("signupForm")?.addEventListener("submit", signup);
  $("recoveryForm")?.addEventListener("submit", recovery);
  $("showRecovery")?.addEventListener("click", showRecovery);
  $("backToLogin")?.addEventListener("click", () => setAuthMode("login"));
  $("logoutBtn")?.addEventListener("click", logout);
  document.querySelectorAll(".auth-tab").forEach(btn => btn.addEventListener("click", () => setAuthMode(btn.dataset.auth)));

  const session = getSession();
  if (session?.access_token) loadDashboard(session.access_token);
}

document.addEventListener("DOMContentLoaded", boot);
