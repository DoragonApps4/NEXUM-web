# NEXUM Web — GitHub Pages

Frontend estático inicial de NEXUM.

Incluye:
- Página principal.
- Login mediante `login-with-username`.
- Solicitud de recuperación.
- `nueva-contrasena.html` para completar la recuperación de Supabase.
- Solo usa la publishable key; no contiene `service_role` ni secretos.

## Importante
La URL final de GitHub Pages debe añadirse en Supabase Authentication > URL Configuration.

La URL de recuperación será:
`https://USUARIO.github.io/nexum-web/nueva-contrasena.html`

GitHub Pages publica el sitio en Internet aunque el repositorio de origen sea privado cuando el plan permite Pages para repositorios privados. No subir nunca contraseñas, tokens, service_role/secret key ni datos de clientes.
