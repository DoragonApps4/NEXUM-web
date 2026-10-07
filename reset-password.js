const API="https://ywcrowviufbioeqixwrq.supabase.co";
const KEY="sb_publishable_7YgYWeWv9XxpXP54gLBLRA_j_Nc-dih";
const $=id=>document.getElementById(id);
function msg(t,c=""){const e=$("resetMsg");e.hidden=false;e.className=`msg ${c}`;e.textContent=t}
function params(){
  const hash=new URLSearchParams(location.hash.replace(/^#/,""));
  const query=new URLSearchParams(location.search);
  return {
    access:hash.get("access_token")||query.get("access_token"),
    type:hash.get("type")||query.get("type"),
    error:hash.get("error")||query.get("error"),
    errorCode:hash.get("error_code")||query.get("error_code"),
    errorDescription:hash.get("error_description")||query.get("error_description"),
    code:query.get("code")||hash.get("code")
  };
}
async function reset(e){
  e.preventDefault();
  const t=params(),p=$("newPassword").value,c=$("confirmPassword").value;
  if(t.error){return msg(t.errorDescription||"El enlace de recuperación no es válido o ya no está disponible.","error")}
  if(!t.access||t.type!=="recovery")return msg("El enlace de recuperación no es válido o ya no está disponible.","error");
  if(p.length<8)return msg("La contraseña debe tener al menos 8 caracteres.","error");
  if(p!==c)return msg("Las contraseñas no coinciden.","error");
  try{
    const r=await fetch(API+"/auth/v1/user",{method:"PUT",headers:{"apikey":KEY,"Authorization":"Bearer "+t.access,"Content-Type":"application/json"},body:JSON.stringify({password:p})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.msg||d.message||d.error_description||"No se pudo actualizar la contraseña.");
    history.replaceState({},document.title,location.pathname);
    $("resetForm").reset();
    msg("Contraseña actualizada correctamente. Ya puedes volver a NEXUM e iniciar sesión.","ok");
  }catch(err){msg(err.message,"error")}
}
document.addEventListener("DOMContentLoaded",()=>{
  $("resetForm").addEventListener("submit",reset);
  const t=params();
  if(t.error) msg(t.errorDescription||"El enlace de recuperación no es válido o ya no está disponible.","error");
  else if(!t.access||t.type!=="recovery") msg("Esta página debe abrirse desde el enlace de recuperación enviado por NEXUM.","error");
});
