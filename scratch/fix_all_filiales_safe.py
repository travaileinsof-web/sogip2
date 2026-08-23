import os

words = {
    'r\ufffdvolutionnez': 'révolutionnez',
    'exp\ufffdrience': 'expérience',
    'immobili\ufffdre': 'immobilière',
    'mod\ufffdle': 'modèle',
    'r\ufffdaliser': 'réaliser',
    '\ufffdconomies': 'économies',
    'v\ufffdrifi\ufffdes': 'vérifiées',
    's\ufffdcuris\ufffdes': 'sécurisées',
    '\ufffdvaluation': 'évaluation',
    'cl\ufffd': 'clé',
    'r\ufffdussie': 'réussie',
    'certifi\ufffds': 'certifiés',
    'm\ufffdthode': 'méthode',
    'co\ufffdt': 'coût',
    'sp\ufffdcificit\ufffds': 'spécificités',
    '\ufffdtre': 'être',
    'risqu\ufffd': 'risqué',
    '\ufffdquipe': 'équipe',
    'sp\ufffdcialis\ufffds': 'spécialisés',
    'hypoth\ufffdques': 'hypothèques',
    's\ufffdcurit\ufffd': 'sécurité',
    'priorit\ufffd': 'priorité',
    'sp\ufffdcifiques': 'spécifiques',
    'poss\ufffddent': 'possèdent',
    'personnalis\ufffdes': 'personnalisées',
    'strat\ufffdgie': 'stratégie',
    'rentabilit\ufffd': 'rentabilité',
    'd\ufffdcisions': 'décisions',
    '\ufffdclair\ufffdes': 'éclairées',
    'Propri\ufffdt\ufffds': 'Propriétés',
    'premi\ufffdre': 'première',
    'd\ufffdcisive': 'décisive',
    'imm\ufffddiatement': 'immédiatement',
    'attractivit\ufffd': 'attractivité',
    'per\ufffdue': 'perçue',
    'propri\ufffdt\ufffd': 'propriété',
    'Propri\ufffdtaire': 'Propriétaire',
    'compl\ufffdte': 'complète',
    'r\ufffdparations': 'réparations',
    'comptabilit\ufffd': 'comptabilité',
    'd\ufffdmarches': 'démarches',
    'g\ufffdrons': 'gérons',
    'S\ufffdcurit\ufffd': 'Sécurité',
    'v\ufffdrifient': 'vérifient',
    'prot\ufffdger': 'protéger',
    'cach\ufffds': 'cachés',
    'Personnalis\ufffd': 'Personnalisé',
    'd\ufffddi\ufffd': 'dédié',
    'cl\ufffds': 'clés',
    'r\ufffdpondre': 'répondre',
    
    # others
    'Ǹ': 'é',
    '%valuation': 'Évaluation',
    'coǯt': 'coût',
    'Ǧtre': 'être',
    '360': '360°',
    'perue': 'perçue',
    'immobilire': 'immobilière',
    'modle': 'modèle',
    'hypothques': 'hypothèques',
    'possdent': 'possèdent',
    'premire': 'première',
    'complte': 'complète',
    'reconnues ?" mǸthode comparative': 'reconnues — méthode comparative',
    'reconnues ?" m\ufffdthode comparative': 'reconnues — méthode comparative',
    'reconnues ?" méthode comparative': 'reconnues — méthode comparative',
    'coǯt ?" pour': 'coût — pour',
    'coût ?" pour': 'coût — pour',
    'espaces ?" nous': 'espaces — nous',
    'administratives ?" nous': 'administratives — nous',
    'l\\\'immobilier': "l'immobilier",
    
    # a avec accent
    '\ufffd chaque': 'à chaque',
    '\ufffd travers': 'à travers',
    '\ufffd toutes': 'à toutes',
    '\ufffd la gestion': 'à la gestion',
    'jusqu\'\ufffd': 'jusqu\'à',
    
    ' chaque Ǹtape': 'à chaque étape',
    ' travers': 'à travers',
    ' la gestion': 'à la gestion',
    'jusqu\' ': 'jusqu\'à '
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    for bad, good in words.items():
        new_content = new_content.replace(bad, good)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

import os
for root, dirs, files in os.walk('src/pages/filiales'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

print("All encoding fixed without breaking TS syntax.")
