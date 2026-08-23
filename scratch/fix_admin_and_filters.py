import sys

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
    'Ǹ': 'é',
    'ǟ': 'é',
    'o"': '-',
    'tǦte': 'tête',
    'DǸcouvrez': 'Découvrez',
    'Ǹquipe': 'équipe',
    'personnalisǸ': 'personnalisé',
    'RǸalisations': 'Réalisations',
    'l\\\'immobilier': "l'immobilier"
}

for bad, good in replacements.items():
    text = text.replace(bad, good)

# Fix specific bugs
text = text.replace('DǸj Vendu', 'Déjà Vendu')
text = text.replace('DǸj LouǸ', 'Déjà Loué')
text = text.replace('Dj Vendu', 'Déjà Vendu')
text = text.replace('Dj Lou', 'Déjà Loué')

with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# Also add Bureau and Commerce to PropertiesList.tsx filters
with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    plist = f.read()

filters_old = """            <option value="Immeuble">Immeuble</option>
            <option value="Tous">Toutes (Vente / Location)</option>"""

filters_new = """            <option value="Immeuble">Immeuble</option>
            <option value="Bureau">Bureau</option>
            <option value="Commerce">Commerce / Boutique</option>
            <option value="Tous">Toutes (Vente / Location)</option>"""

plist = plist.replace(filters_old, filters_new)

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(plist)

print("Fixed AdminProperties encoding and added Bureau/Commerce to filters")
