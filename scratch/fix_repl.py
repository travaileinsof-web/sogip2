import sys
with open('src/pages/admin/AdminProperties.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('ajoute(s) ', 'ajoutée(s) à')
text = text.replace('mise  jour avec succs', 'mise à jour avec succès')
text = text.replace('tes-vous sr', 'Êtes-vous sûr')
text = text.replace('Villa  \nKip', 'Villa à Kipé')
text = text.replace('Villa  Kip', 'Villa à Kipé')
text = text.replace('Dj Vendu', 'Déjà Vendu')
text = text.replace('Dj Lou', 'Déjà Loué')
text = text.replace('Surface (m)', 'Surface (m²)')
text = text.replace('Aperu', 'Aperçu')
text = text.replace("jusqu'", "jusqu'à")
text = text.replace('images  la', 'images à la')
text = text.replace('commencer ', 'commencer à')
text = text.replace('Lou', 'Loué')

with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    text2 = f.read()

text2 = text2.replace('proprit', 'propriété')
text2 = text2.replace('Proprit', 'Propriété')
text2 = text2.replace('Immobilire', 'Immobilière')
text2 = text2.replace(' Coyah', 'à Coyah')

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(text2)
