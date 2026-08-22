import sys
import os

def fix_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    text = text.replace('TǸlǸphone', 'Téléphone')
    text = text.replace('wa.me/224610111100', 'wa.me/224620521249')
    text = text.replace('wa.me/22462000000', 'wa.me/224620521249')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix_file('src/components/immobilier/PropertiesList.tsx')
print("Fix applied")
