import sys

with open('scratch/rewrite_admin_properties.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix apostrophes in the string
text = text.replace("'Modifier l\\'Offre'", '"Modifier l\'Offre"')
text = text.replace("'Changer l\\'image principale'", '"Changer l\'image principale"')
text = text.replace("'Sélectionner l\\'image principale'", '"Sélectionner l\'image principale"')
text = text.replace("'Enregistrer l\\'offre'", '"Enregistrer l\'offre"')

with open('scratch/rewrite_admin_properties.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed rewrite_admin_properties.py")
