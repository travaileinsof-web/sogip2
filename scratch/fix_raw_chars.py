import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just fix all typical broken characters that are in the output
    # `Ǹ` is definitely `é`
    content = content.replace('Ǹ', 'é')
    content = content.replace('Ǧ', 'ê')
    content = content.replace('ǯ', 'û')
    
    # We saw `%valuation` which means `\ufffd%valuation` or something similar
    content = re.sub(r'.%valuation', 'Évaluation', content)
    content = re.sub(r'.\?\"', '—', content)
    
    # also `Immobilire`
    content = re.sub(r'Immobili.re', 'Immobilière', content)
    content = re.sub(r'mod.le', 'modèle', content)
    content = re.sub(r'cr.ativit.', 'créativité', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('src/pages/filiales'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

print("Fixed raw characters.")
