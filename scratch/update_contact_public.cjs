const fs = require('fs');

let contact = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

// 1. Add parseArray
if (!contact.includes('const parseArray')) {
  const importsEnd = contact.lastIndexOf('import ');
  const nextLine = contact.indexOf('\n', importsEnd) + 1;
  const parseArrayFunc = `
const parseArray = (str: any, defaultArr: any[]) => {
  if (!str) return defaultArr;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [str];
  } catch {
    return [str];
  }
};
`;
  contact = contact.slice(0, nextLine) + parseArrayFunc + contact.slice(nextLine);
}

// 2. Add derived variables inside component after settings
const stateInsertRegex = /api\.get\('\/settings'\)\.then\(res => setSettings\(res\)\)\.catch\(console\.error\);\s*\}\);\s*\}, \[\]\);\s*/;
const varsInsert = `
  const emails = parseArray(settings.contact_emails || settings.contact_email, ['camus@sogipgroup.com', 'sogipinfos@sogipgroup.com']);
  const phones = parseArray(settings.contact_phones || settings.contact_phone, ['+224 620 52 12 49']);
  const socials = parseArray(settings.socials, [
    { platform: 'Facebook', url: settings.social_facebook || data?.info?.facebook || "https://facebook.com/SogipGroup" },
    { platform: 'LinkedIn', url: settings.social_linkedin || data?.info?.linkedin || "https://linkedin.com/company/sogipgroup" },
    { platform: 'TikTok', url: settings.social_tiktok || data?.info?.tiktok || "https://tiktok.com/@sogipgroup" }
  ]).filter((s: any) => s.url);
`;
contact = contact.replace(stateInsertRegex, (match) => match + varsInsert);

// 3. Replace phone block
const phoneBlockRegex = /<h4 className="text-lg font-bold text-slate-800 mb-1">Téléphone<\/h4>\s*<p className="text-slate-600 leading-relaxed">\s*\{settings\.contact_phone \|\| data\?\.info\?\.telephone \|\| "\+224 620 52 12 49"\}\s*<\/p>/;
const newPhoneBlock = `
<h4 className="text-lg font-bold text-slate-800 mb-1">Téléphone</h4>
<div className="flex flex-col gap-1">
  {phones.map((phone: string, i: number) => (
    <p key={i} className="text-slate-600 leading-relaxed">{phone}</p>
  ))}
</div>
`.trim();
contact = contact.replace(phoneBlockRegex, newPhoneBlock);

// 4. Replace email block
const emailBlockRegex = /<h4 className="text-lg font-bold text-slate-800 mb-1">Email<\/h4>\s*<div className="flex flex-col gap-1">\s*<a href=\{`mailto:\$\{settings\.contact_email \|\| "camus@sogipgroup\.com"\}`\} className="text-slate-600 hover:text-amber-600 transition-colors">\s*\{settings\.contact_email \|\| "camus@sogipgroup\.com"\}\s*<\/a>\s*<\/div>/;
const newEmailBlock = `
<h4 className="text-lg font-bold text-slate-800 mb-1">Email</h4>
<div className="flex flex-col gap-1">
  {emails.map((email: string, i: number) => (
    <a key={i} href={\`mailto:\${email}\`} className="text-slate-600 hover:text-amber-600 transition-colors">
      {email}
    </a>
  ))}
</div>
`.trim();
contact = contact.replace(emailBlockRegex, newEmailBlock);

// 5. Replace Socials block
// We need to replace the whole <div className="flex gap-4">...</div> with a map over socials.
const socialsRegex = /<div className="flex gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/FadeIn>/;
const newSocials = `
                <div className="flex gap-4">
                  {socials.map((social: any, i: number) => (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} title={social.platform} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                      {social.platform.toLowerCase().includes('facebook') ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      ) : social.platform.toLowerCase().includes('linkedin') ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      ) : social.platform.toLowerCase().includes('tiktok') ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                      ) : (
                        <span className="font-bold">{social.platform.substring(0, 1).toUpperCase()}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
`;
contact = contact.replace(socialsRegex, newSocials);

fs.writeFileSync('src/pages/Contact.tsx', contact, 'utf8');
console.log('Contact.tsx updated for arrays.');
