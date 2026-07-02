const fs = require('fs');
let c = fs.readFileSync('src/pages/Formations.tsx', 'utf8');
let idx = 1;
c = c.replace(/picsum\.photos\/seed\/formation\$1/g, () => 'picsum.photos/seed/sogip' + (idx++));
fs.writeFileSync('src/pages/Formations.tsx', c);
