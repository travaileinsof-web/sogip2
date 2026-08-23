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
    '': 'é',
    'o"': '-',
    'tǦte': 'tête',
    'DǸcouvrez': 'Découvrez',
    'Ǹquipe': 'équipe',
    'personnalisǸ': 'personnalisé',
    'RǸalisations': 'Réalisations',
    'l\\\'immobilier': "l'immobilier",
    ' ': 'à '
}

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for bad, good in replacements.items():
                    new_content = new_content.replace(bad, good)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {path}")
            except Exception as e:
                pass
