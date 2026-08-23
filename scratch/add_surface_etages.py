import re

with open('src/pages/admin/AdminProperties.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Surface (m²)
text = re.sub(r'Surface \(m.\) - Optionnel', 'Surface (m²) - Optionnel', text)
text = re.sub(r'Surface \(m.*\) - Optionnel', 'Surface (m²) - Optionnel', text)

# Add étages to AdminProperties.tsx specs
# Currently we have a block for specs. Let's find it.
# We will just add an input for `etages` inside the specs block or before it?
# In AdminProperties.tsx, where are the number inputs for chambres etc?
# Let's just find "Chambres</label>" and add it there.
etages_html = """            <div><label className="text-xs text-gray-500">Étages (ex: R+2)</label><input type="text" name="etages" value={formData.specs?.etages || ''} onChange={handleSpecChange} className="w-full border rounded p-2" placeholder="R+2" /></div>\n"""
if 'name="etages"' not in text:
    text = text.replace('<div><label className="text-xs text-gray-500">Chambres</label>', etages_html + '            <div><label className="text-xs text-gray-500">Chambres</label>')

with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(text)


with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    plist = f.read()

# Import Maximize (for surface) and Layers (for étages) from lucide-react if needed
if 'Maximize' not in plist:
    plist = re.sub(r'import \{([^}]+)\} from "lucide-react"', r'import {\1, Maximize, Layers} from "lucide-react"', plist)

# Display Surface and Etages in the modal
surface_html = """
              {property.area && <div className="flex items-center gap-1.5"><Maximize size={16} /> {property.area} m²</div>}
              {specs.etages && <div className="flex items-center gap-1.5"><Layers size={16} /> {specs.etages}</div>}"""

# Insert after property.type ... wait, where are the specs displayed?
# We have a block with `{specs.chambres && ... }`
if 'property.area &&' not in plist:
    # We will insert it just before specs.chambres
    plist = re.sub(r'(\{specs\.chambres &&)', surface_html + r'\n              \1', plist)

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(plist)

print("Added surface and etages")
