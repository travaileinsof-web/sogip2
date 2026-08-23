import sys

with open('src/pages/admin/AdminProperties.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('name="groupe_electr- checked', 'name="groupe_electro" checked')

with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed typo in AdminProperties.tsx")
