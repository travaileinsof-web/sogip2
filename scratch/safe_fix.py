import sys
import re

with open('src/pages/admin/AdminProperties.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ã ': 'à',
    'Ã¢': 'â',
    'Ãª': 'ê',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã»': 'û',
    'Ã§': 'ç',
    'Ã‰': 'É',
    'Ãˆ': 'È',
    'Ã€': 'À',
    'DǸj Vendu': 'Déjà Vendu',
    'DǸj LouǸ': 'Déjà Loué',
    'Dj Vendu': 'Déjà Vendu',
    'Dj Lou': 'Déjà Loué',
    'Ǹ': 'é',
    'ǟ': 'é',
    'tǦte': 'tête',
    'DǸcouvrez': 'Découvrez',
    'Ǹquipe': 'équipe',
    'personnalisǸ': 'personnalisé',
    'RǸalisations': 'Réalisations',
    'l\\\'immobilier': "l'immobilier"
}

for bad, good in replacements.items():
    text = text.replace(bad, good)

# also fix properties that were mangled by PowerShell, wait, restoring from git means we restore to the point right BEFORE my broken script!
# the git tree has the state right after I committed the missing fields.
with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    plist = f.read()

if '<option value="Bureau">Bureau</option>' not in plist:
    plist = re.sub(
        r'(<option value="Immeuble">Immeuble</option>)',
        r'\1\n            <option value="Bureau">Bureau</option>\n            <option value="Commerce">Commerce / Boutique</option>',
        plist
    )

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(plist)

print("Safely fixed AdminProperties and PropertiesList")
