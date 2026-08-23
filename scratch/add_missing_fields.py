import sys

with open('src/pages/admin/AdminProperties.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# For Terrain
terrain_options = """          <label className="flex items-center space-x-2"><input type="checkbox" name="bord_route" checked={formData.specs?.bord_route || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Bordure de route</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="titre_foncier" checked={formData.specs?.titre_foncier || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Titre Foncier</span></label>"""

terrain_options_new = """          <label className="flex items-center space-x-2"><input type="checkbox" name="bord_route" checked={formData.specs?.bord_route || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Bordure de route</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="cloture" checked={formData.specs?.cloture || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Clôturé</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="electrifie" checked={formData.specs?.electrifie || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Zone électrifiée</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="titre_foncier" checked={formData.specs?.titre_foncier || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Titre Foncier</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="documents_ok" checked={formData.specs?.documents_ok || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Documents au point</span></label>"""

text = text.replace(terrain_options, terrain_options_new)

# For Maison / Villa / Appartement
maison_options = """          <div className="flex gap-4 flex-wrap mt-2">
            <label className="flex items-center space-x-2"><input type="checkbox" name="forage" checked={formData.specs?.forage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Forage (Eau)</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="groupe_electro" checked={formData.specs?.groupe_electro || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Groupe électrogène</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="gardiennage" checked={formData.specs?.gardiennage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Gardiennage</span></label>
          </div>"""

# Wait, in the source code it had "Groupe %lectrogne", I'll just use regex.
import re
text = re.sub(
    r'<div className="flex gap-4 flex-wrap mt-2">.*?Gardiennage</span></label>\s*</div>',
    """<div className="flex gap-4 flex-wrap mt-2">
            <label className="flex items-center space-x-2"><input type="checkbox" name="forage" checked={formData.specs?.forage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Forage (Eau)</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="electricite" checked={formData.specs?.electricite || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Électricité</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="groupe_electro" checked={formData.specs?.groupe_electro || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Groupe électrogène</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="gardiennage" checked={formData.specs?.gardiennage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Gardiennage</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="chauffage_eau" checked={formData.specs?.chauffage_eau || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Chauffe-eau</span></label>
          </div>""",
    text,
    flags=re.DOTALL
)

with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    plist = f.read()

# Add to PropertiesList.tsx display icons
# find the icon blocks
new_icons = """              {specs.chauffage_eau && <div className="flex items-center gap-1.5"><Thermometer size={16} /> Chauffe-eau</div>}
              {specs.electricite && <div className="flex items-center gap-1.5"><Zap size={16} /> Électricité</div>}
              {specs.cloture && <div className="flex items-center gap-1.5"><Shield size={16} /> Clôturé</div>}
              {specs.electrifie && <div className="flex items-center gap-1.5"><Zap size={16} /> Zone Électrifiée</div>}
              {specs.documents_ok && <div className="flex items-center gap-1.5"><FileCheck size={16} /> Documents au point</div>}
"""
# insert before "</div>" of the spec block
# I will use regex
plist = re.sub(
    r'(\{specs\.titre_foncier && <div.*?Titre Foncier</div>\})',
    r'\1\n' + new_icons,
    plist
)

# Wait, import Zap, Thermometer, Shield, FileCheck
import_lucide = r'import \{([^}]+)\} from "lucide-react"'
lucide_match = re.search(import_lucide, plist)
if lucide_match:
    imports = lucide_match.group(1)
    if 'Zap' not in imports:
        plist = plist.replace(imports, imports + ', Zap, Thermometer, Shield, FileCheck')

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(plist)

print("Added missing fields")
