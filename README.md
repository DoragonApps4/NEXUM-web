# NEXUM Web Frontend

Static frontend for GitHub Pages + Supabase.

## Architecture
- GitHub Pages: static frontend
- Supabase Auth: authentication and sessions
- Supabase REST API: customer/profile data
- Edge Function: `login-with-username`

## Public technical names
- `reset-password.html`
- `reset-password.js`
- English route/file/API naming
- Spanish user-facing copy

## Security
Only the Supabase publishable key is included in the browser. Never add a service-role/secret key here.

## Recovery redirect
Supabase Auth should allow:
`https://nexumapps.github.io/reset-password.html`

## Deploy
Upload the contents of this folder to the root of the GitHub Pages repository and deploy from `main` / root.
