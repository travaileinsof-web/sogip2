fetch('https://sogip-frontend-bobp507jm-travaileinsof-1730s-projects.vercel.app/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@sogip.com', password: 'admin123' })
})
.then(res => res.text().then(text => ({status: res.status, text})))
.then(console.log)
.catch(console.error);
