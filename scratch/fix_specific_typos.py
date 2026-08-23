import sys

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'Tlphone': 'Téléphone',
    'redirigǸ': 'redirigé',
    'T\ufffdl\ufffdphone': 'Téléphone'
}

for bad, good in replacements.items():
    text = text.replace(bad, good)

# also let's just make sure we replace the mangled text if it's literally that
text = text.replace('T\xef\xbf\xbdl\xef\xbf\xbdphone', 'Téléphone')

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed specific typos in PropertiesList.tsx")
