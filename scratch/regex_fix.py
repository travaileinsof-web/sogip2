import re

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Tlphone
text = re.sub(r'T.l.phone', 'Téléphone', text)
# Fix Numro
text = re.sub(r'Num.ro', 'Numéro', text)
# Fix intress
text = re.sub(r'int.ress.', 'intéressé', text)
# Fix Dtails
text = re.sub(r'D.tails', 'Détails', text)
# Fix redirig
text = re.sub(r'redirig.', 'redirigé', text)
# Fix immobilire
text = re.sub(r'immobili.re', 'immobilière', text)

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed replacement chars using regex")
