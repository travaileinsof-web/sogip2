import re

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'm\ufffd', 'm²', text)
text = re.sub(r'm\xef\xbf\xbd', 'm²', text)

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed m² in PropertiesList.tsx")
