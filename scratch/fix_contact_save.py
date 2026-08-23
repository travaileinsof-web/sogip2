import sys
import re

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add email field to the form
email_field = """<div><label className="block text-sm font-medium text-gray-700 mb-1">Votre Email *</label><input required type="email" value={contactForm.email} onChange={e => setContactForm(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="jean@email.com" /></div>"""

# Find the phone field to insert email after it
phone_field = """<div><label className="block text-sm font-medium text-gray-700 mb-1">Votre Numéro de Téléphone *</label><input required type="tel" value={contactForm.phone} onChange={e => setContactForm(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+224 620 00 00 00" /></div>"""

# Wait, the phone field might have corrupted characters in the source string. I will use regex.
pattern_phone = r'(<div><label.*?Votre Numéro de Téléphone \*.*?</label><input.*?contactForm\.phone.*?/></div>)'
# actually the file has corrupted characters if I didn't fix them. Let's fix them first.

text = text.replace('intǸressǸ(e)', 'intéressé(e)')
text = text.replace('TǸlǸphone', 'Téléphone')
text = text.replace('NumǸro', 'Numéro')
text = text.replace('redirigǸ', 'redirigé')
text = text.replace('immobilires', 'immobilières')

# Now insert email field
pattern_phone2 = r'(<div><label.*?Votre Numéro de Téléphone \*.*?</label><input.*?contactForm\.phone.*?/></div>)'
if re.search(pattern_phone2, text):
    text = re.sub(pattern_phone2, r'\1\n                  ' + email_field, text)
else:
    print("Could not find phone field to insert email.")

# Fix submit contact
new_submit = """  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Envoyer les infos dans la boite du dashboard admin
      const names = contactForm.name.split(' ');
      const nom = names.length > 1 ? names.slice(1).join(' ') : contactForm.name;
      const prenom = names[0];
      
      await api.post('/contacts', {
        nom: nom,
        prenom: prenom,
        email: contactForm.email || 'non.renseigne@email.com',
        telephone: contactForm.phone,
        sujet: 'Intérêt pour une offre immobilière (Le Proprio)',
        filiale: 'SOGIP IMMO',
        message: contactForm.message
      });
      
    } catch (error) {
      console.error('Erreur lors de l\\'envoi au dashboard', error);
    }

    // 2. Rediriger vers WhatsApp
    const whatsappMessage = `*Nouvelle Demande SOGIP IMMO*\\nNom: ${contactForm.name}\\nEmail: ${contactForm.email}\\nTéléphone: ${contactForm.phone}\\n\\n${contactForm.message}`;
    const whatsappLink = `https://wa.me/224620521249?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
    setShowContactModal(false);
  };"""

text = re.sub(r'const submitContact = async \(e: React\.FormEvent\) => \{.*?setShowContactModal\(false\);\s*\};', new_submit, text, flags=re.DOTALL)

with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed submitContact and added Email field.")
