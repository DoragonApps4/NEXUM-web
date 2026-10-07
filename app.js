const API = "https://ywcrowviufbioeqixwrq.supabase.co";
const KEY = "sb_publishable_7YgYWeWv9XxpXP54gLBLRA_j_Nc-dih";
const SITE_URL = "https://nexumapps.github.io/";
const RESET_URL = "https://nexumapps.github.io/reset-password.html";

const $ = id => document.getElementById(id);
function showMsg(text, type=""){const el=$("authMsg");if(!el)return;el.hidden=false;el.className=`msg ${type}`;el.textContent=text}
async function supa(path, options={}){
  const headers={"apikey":KEY,"Content-Type":"application/json",...(options.headers||{})};
  const response=await fetch(API+path,{...options,headers});
  let data={};try{data=await response.json()}catch{}
  if(!response.ok)throw new Error(data.msg||data.message||data.error_description||data.error||"No se pudo completar la operación.");
  return data;
}
function getSession(){try{return JSON.parse(localStorage.getItem("nexum_session")||"null")}catch{return null}}
function saveSession(data){localStorage.setItem("nexum_session",JSON.stringify(data))}
function clearSession(){localStorage.removeItem("nexum_session")}
function accessToken(){return getSession()?.access_token||null}

async function login(e){
  e.preventDefault();
  const identifier=$("identifier").value.trim(), password=$("password").value;
  if(!identifier||!password)return showMsg("Escribe usuario/correo y contraseña.","error");
  try{
    const data=await supa("/functions/v1/login-with-username",{method:"POST",body:JSON.stringify({identifier,password})});
    saveSession(data); await loadDashboard(data.access_token); showMsg("Acceso correcto.","ok");
  }catch(err){showMsg(err.message,"error")}
}

async function signup(e){
  e.preventDefault();
  const name=$("signupName").value.trim(), username=$("signupUsername").value.trim().toLowerCase(), email=$("signupEmail").value.trim(), password=$("signupPassword").value;
  if(password.length<8)return showMsg("La contraseña debe tener al menos 8 caracteres.","error");
  if(!/^[a-z0-9_]{3,30}$/.test(username))return showMsg("El usuario debe tener 3–30 caracteres: minúsculas, números o _.","error");
  try{
    const data=await supa("/auth/v1/signup",{method:"POST",body:JSON.stringify({email,password,data:{username,display_name:name},email_redirect_to:SITE_URL})});
    if(data.access_token){saveSession(data);await loadDashboard(data.access_token);showMsg("Cuenta creada correctamente.","ok")}
    else showMsg("Cuenta creada. Revisa tu correo para verificarla antes de entrar.","ok");
  }catch(err){showMsg(err.message,"error")}
}

async function recovery(e){
  e.preventDefault();
  const email=$("recoveryEmail").value.trim();
  if(!email)return showMsg("Escribe tu correo electrónico.","error");
  try{await supa("/auth/v1/recover",{method:"POST",body:JSON.stringify({email,redirect_to:RESET_URL})});showMsg("Si la cuenta puede recibir recuperación, recibirás un enlace por correo.","ok")}
  catch(err){showMsg(err.message,"error")}
}

async function loadDashboard(token){
  if(!token)return;
  try{
    const user=await supa("/auth/v1/user",{headers:{Authorization:`Bearer ${token}`}});
    const profile=await supa(`/rest/v1/profiles?select=username,display_name,role,is_active&id=eq.${encodeURIComponent(user.id)}`,{headers:{Authorization:`Bearer ${token}`}});
    const p=profile?.[0]||{};
    $("profileName").textContent=p.display_name||user.email||"Usuario NEXUM";
    $("profileUsername").textContent=p.username?`@${p.username}`:"Cuenta NEXUM";
    $("dashboardGreeting").textContent=`Bienvenido, ${(p.display_name||"usuario").split(" ")[0]}.`;
    $("authCard").hidden=true;$("dashboard").hidden=false;
    document.querySelector("#acceso").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(err){clearSession();showMsg("La sesión ya no es válida. Vuelve a iniciar sesión.","error")}
}
function logout(){clearSession();location.reload()}
function setAuthMode(mode){
  const loginMode=mode==="login";
  document.querySelectorAll(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.auth===mode));
  $("loginForm").hidden=!loginMode;$("signupForm").hidden=loginMode;$("recoveryForm").hidden=true;$("authTitle").textContent=loginMode?"Entrar a tu cuenta":"Crear tu cuenta";
  $("authMsg").hidden=true;
}
function showRecovery(){document.querySelectorAll(".auth-tab").forEach(b=>b.classList.remove("active"));$("loginForm").hidden=true;$("signupForm").hidden=true;$("recoveryForm").hidden=false;$("authTitle").textContent="Recuperar contraseña";$("authMsg").hidden=true}
function boot(){
  $("loginForm")?.addEventListener("submit",login);$("signupForm")?.addEventListener("submit",signup);$("recoveryForm")?.addEventListener("submit",recovery);$("showRecovery")?.addEventListener("click",showRecovery);$("backToLogin")?.addEventListener("click",()=>setAuthMode("login"));$("logoutBtn")?.addEventListener("click",logout);
  document.querySelectorAll(".auth-tab").forEach(btn=>btn.addEventListener("click",()=>setAuthMode(btn.dataset.auth)));
  const session=getSession();if(session?.access_token)loadDashboard(session.access_token);
}
document.addEventListener("DOMContentLoadeds_toaee.l