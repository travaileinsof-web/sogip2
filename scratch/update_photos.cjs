const fs = require('fs');

// Update Home.tsx
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const importMatch = /import React, { useState, useEffect } from 'react';/;
if (!importMatch.test(home)) {
  home = home.replace(/import React, { useState } from 'react';/, 'import React, { useState, useEffect } from \'react\';');
}

const componentStart = /const Home: React\.FC = \(\) => {/;
const stateInsert = `
  const [settings, setSettings] = useState<any>({});
  useEffect(() => {
    import('../services/api').then(({ api }) => {
      api.get('/settings').then(res => setSettings(res)).catch(console.error);
    });
  }, []);
`;

home = home.replace(componentStart, 'const Home: React.FC = () => {' + stateInsert);
home = home.replace(/src="\/images\/fondateur\.jpg"/g, 'src={settings.photo_directeur || "/images/fondateur.jpg"}');

fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');
console.log('Home.tsx updated.');

// Update About.tsx
let about = fs.readFileSync('src/pages/About.tsx', 'utf8');

const importMatchAbout = /import React, { useState, useEffect } from 'react';/;
if (!importMatchAbout.test(about)) {
  about = about.replace(/import React, { useState } from 'react';/, 'import React, { useState, useEffect } from \'react\';');
}

const componentStartAbout = /const About: React\.FC = \(\) => {/;
about = about.replace(componentStartAbout, 'const About: React.FC = () => {' + stateInsert);
about = about.replace(/src="\/images\/fondateur2\.jpg"/g, 'src={settings.photo_fondateur || "/images/fondateur2.jpg"}');

fs.writeFileSync('src/pages/About.tsx', about, 'utf8');
console.log('About.tsx updated.');
