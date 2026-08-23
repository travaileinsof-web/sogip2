import re

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(
    r'(<option value="Immeuble">Immeuble</option>)',
    r'\1\n            <option value="Bureau">Bureau</option>\n            <option value="Commerce">Commerce / Boutique</option>',
    text
)

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added Bureau and Commerce to properties filters")
