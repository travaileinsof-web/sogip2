const fs = require('fs');

let contact = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

const importMatch = /import React, { useState, useEffect } from 'react';/;
if (!importMatch.test(contact)) {
  contact = contact.replace(/import React, { useState } from 'react';/, 'import React, { useState, useEffect } from \'react\';');
}

const componentStart = /const Contact: React\.FC = \(\) => {/;
const stateInsert = `
  const [settings, setSettings] = useState<any>({});
  useEffect(() => {
    import('../services/api').then(({ api }) => {
      api.get('/settings').then(res => setSettings(res)).catch(console.error);
    });
  }, []);
`;

contact = contact.replace(componentStart, 'const Contact: React.FC = () => {' + stateInsert);

// Replace values
contact = contact.replace(/\{\s*data\?\.info\?\.adresse \|\| "([^"]+)"\s*\}/g, '{settings.contact_address || data?.info?.adresse || "$1"}');
contact = contact.replace(/\{\s*data\?\.info\?\.telephone \|\| "([^"]+)"\s*\}/g, '{settings.contact_phone || data?.info?.telephone || "$1"}');
contact = contact.replace(/camus@sogipgroup\.com/g, '{settings.contact_email || "camus@sogipgroup.com"}');
contact = contact.replace(/sogipinfos@sogipgroup\.com/g, '{settings.contact_email || "sogipinfos@sogipgroup.com"}');
contact = contact.replace(/href="mailto:camus@sogipgroup\.com"/g, 'href={`mailto:${settings.contact_email || "camus@sogipgroup.com"}`}');
contact = contact.replace(/href="mailto:sogipinfos@sogipgroup\.com"/g, 'href={`mailto:${settings.contact_email || "sogipinfos@sogipgroup.com"}`}');

// Also update the UI presentation of the email.
// The hardcoded emails were:
// <a href="mailto:camus..." className="...">camus...</a>
// <a href="mailto:sogipinfos..." className="...">sogipinfos...</a>
// Let's replace the block entirely with a single dynamic one.

const emailBlockRegex = /<a href=\{`mailto:\$\{settings\.contact_email \|\| "camus@sogipgroup\.com"\}`\} className="text-slate-600 hover:text-amber-600 transition-colors">\s*\{settings\.contact_email \|\| "camus@sogipgroup\.com"\}\s*<\/a>\s*<a href=\{`mailto:\$\{settings\.contact_email \|\| "sogipinfos@sogipgroup\.com"\}`\} className="text-slate-600 hover:text-amber-600 transition-colors">\s*\{settings\.contact_email \|\| "sogipinfos@sogipgroup\.com"\}\s*<\/a>/g;

contact = contact.replace(emailBlockRegex, '<a href={`mailto:${settings.contact_email || "contact@sogipgroup.com"}`} className="text-slate-600 hover:text-amber-600 transition-colors">{settings.contact_email || "contact@sogipgroup.com"}</a>');

contact = contact.replace(/\{\s*data\?\.info\?\.facebook \|\| "([^"]+)"\s*\}/g, '{settings.social_facebook || data?.info?.facebook || "$1"}');
contact = contact.replace(/\{\s*data\?\.info\?\.linkedin \|\| "([^"]+)"\s*\}/g, '{settings.social_linkedin || data?.info?.linkedin || "$1"}');
contact = contact.replace(/\{\s*data\?\.info\?\.tiktok \|\| "([^"]+)"\s*\}/g, '{settings.social_tiktok || data?.info?.tiktok || "$1"}');

fs.writeFileSync('src/pages/Contact.tsx', contact, 'utf8');
console.log('Contact.tsx updated.');
