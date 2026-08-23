import os

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

for root, dirs, files in os.walk('src/pages/filiales'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for bad, good in replacements.items():
                    if bad: # prevent empty string
                        new_content = new_content.replace(bad, good)
                
                # Specifically replace the non-breaking bad char that looks like ' '
                bad_space = bytes([0xc3, 0x82, 0xc2, 0x81]).decode('utf-8', errors='ignore')
                new_content = new_content.replace(bad_space, 'à')

                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {path}")
            except Exception as e:
                pass
