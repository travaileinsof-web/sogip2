import sys
import os

def fix_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    replacements = {
        'ÃƒÂ©': 'é',
        'ÃƒÂ¨': 'è',
        'ÃƒÂ': 'à',
        'Ã‚Â²': '²',
        'Ã©': 'é',
        'Ã¨': 'è',
        'Ã ': 'à',
        'Ãª': 'ê',
        'Ã¢': 'â',
        'Ã®': 'î',
        'Ã¯': 'ï',
        'Ã´': 'ô',
        'Ã»': 'û',
        'Ã§': 'ç',
        'Ãœ': 'Ü',
        'Ã€': 'À',
        'Ã‰': 'É',
        'Ãˆ': 'È',
        'ÃŠ': 'Ê',
        'Ã‹': 'Ë',
        'ÃŽ': 'Î',
        'Ã ': 'Ï',
        'Ã”': 'Ô',
        'Ã–': 'Ö',
        'Ã™': 'Ù',
        'Ãš': 'Ú',
        'Ã›': 'Û',
        'Ãœ': 'Ü',
        'Ã‡': 'Ç',
        'Ã': 'à',
        'Ǹ': 'é',
        'ǟ': 'à',
        'mǦme': 'même',
    }
    
    for bad, good in replacements.items():
        text = text.replace(bad, good)
        
    text = text.replace('Dàjà', 'Déjà')
    text = text.replace('Gàrez', 'Gérez')
    text = text.replace('immobiliàres', 'immobilières')
    text = text.replace('dàtaillàe', 'détaillée')
    text = text.replace('sàlectionner', 'sélectionner')
    text = text.replace('màme', 'même')
    text = text.replace('immàdiatement', 'immédiatement')
    text = text.replace('dàcochà', 'décoché')
    text = text.replace('sauvegardàe', 'sauvegardée')
    text = text.replace('Tàlàphone', 'Téléphone')
    text = text.replace('Dàcrivez', 'Décrivez')
    text = text.replace('ràyer', 'réessayer')
    text = text.replace('spàcifique', 'spécifique')
    text = text.replace('intàressà', 'intéressé')
    text = text.replace('àquipe', 'équipe')
    text = text.replace('tràs', 'très')
    text = text.replace('envoyàe', 'envoyée')

    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix_file('src/pages/admin/AdminProperties.tsx')
fix_file('src/components/immobilier/PropertiesList.tsx')
print("Fix applied")

fix_file('src/pages/filiales/SogipImmo.tsx')
