import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import FadeIn from '../components/animations/FadeIn';
import { usePageData } from '../hooks/usePageData';
import { sanitizeHtml } from '../utils/sanitize';

const parseArray = (str: any, defaultArr: any[]) => {
  if (!str) return defaultArr;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [str];
  } catch {
    return [str];
  }
};

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  useEffect(() => {
    import('../services/api').then(({ api }) => {
      api.get('/settings').then(res => setSettings(res)).catch(console.error);
    });
  }, []);

  
  const emails = parseArray(settings.contact_emails || settings.contact_email, ['camus@sogipgroup.com', 'sogipinfos@sogipgroup.com']);
  const phones = parseArray(settings.contact_phones || settings.contact_phone, ['+224 620 52 12 49']);
  const socials = parseArray(settings.socials, [
    { platform: 'Facebook', url: settings.social_facebook || data?.info?.facebook || "https://facebook.com/SogipGroup" },
    { platform: 'LinkedIn', url: settings.social_linkedin || data?.info?.linkedin || "https://linkedin.com/company/sogipgroup" },
    { platform: 'TikTok', url: settings.social_tiktok || data?.info?.tiktok || "https://tiktok.com/@sogipgroup" }
  ]).filter((s: any) => s.url);
const { data } = usePageData('contact');
  const [formState, setFormState] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    filiale: 'SOGIP Group',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await api.post('/contacts', formState);
      
      if (response.success) {
        setSubmitStatus('success');
        setFormState({ nom: '', prenom: '', email: '', telephone: '', sujet: '', filiale: 'SOGIP Group', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du contact:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-32">
      {/* Header */}
      <section className="relative pt-32 pb-24 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h1 
              className="title-font text-5xl md:text-6xl font-bold mb-6 text-blue-900 text-center"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.hero?.titre || `Entrons en <span className="text-amber-500">Contact</span>`) }}
            />
            <p className="text-center text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              {data?.hero?.sous_titre || "Une question sur nos services ? Un projet à nous confier ? Notre équipe est à votre écoute pour matérialiser vos ambitions."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 lg:px-12 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Informations de contact */}
          <FadeIn delay={0.1} className="space-y-10">
            <div>
              <h2 className="title-font text-3xl font-bold text-blue-900 mb-6">{data?.info?.titre || "Nos Coordonnées"}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {data?.info?.desc || "N'hésitez pas à nous contacter pour toute demande de renseignement. Nous vous répondrons dans les plus brefs délais."}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Siège Social</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {settings.contact_address || data?.info?.adresse || "Bluezone de Dixinn, Conakry, Guinée"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Téléphone</h4>
<div className="flex flex-col gap-1">
  {phones.map((phone: string, i: number) => (
    <p key={i} className="text-slate-600 leading-relaxed">{phone}</p>
  ))}
</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Email</h4>
<div className="flex flex-col gap-1">
  {emails.map((email: string, i: number) => (
    <a key={i} href={`mailto:${email}`} className="text-slate-600 hover:text-amber-600 transition-colors">
      {email}
    </a>
  ))}
</div>
                </div>
              </div>

              {/* Réseaux Sociaux */}
              <div className="flex items-start gap-4 pt-6 border-t border-slate-100">
                
                <div className="flex gap-4">
                  {socials.map((social: any, i: number) => (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} title={social.platform} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                      {social.platform.toLowerCase().includes('facebook') ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      ) : social.platform.toLowerCase().includes('linkedin') ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      ) : social.platform.toLowerCase().includes('tiktok') ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                      ) : (
                        <span className="font-bold">{social.platform.substring(0, 1).toUpperCase()}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>


          {/* Formulaire */}
          <FadeIn delay={0.2}>
            <div className="bg-white p-10 rounded-2xl shadow-luxury">
              <h3 className="title-font text-3xl font-bold text-blue-900 mb-8">Envoyez-nous un message</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-8 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <p>Votre message a été envoyé avec succès. Notre équipe vous contactera rapidement.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
                  <p>Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter par téléphone.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                    <input 
                      type="text" 
                      name="prenom"
                      value={formState.prenom}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                    <input 
                      type="text" 
                      name="nom"
                      value={formState.nom}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      name="telephone"
                      value={formState.telephone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="+224 620 52 12 49"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pôle concerné</label>
                    <select
                      name="filiale"
                      value={formState.filiale}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="SOGIP Group">SOGIP Group (Général)</option>
                      <option value="GCB BTP">GCB BTP</option>
                      <option value="SOGIP IMMOBILIER">SOGIP Immobilier</option>
                      <option value="SOGIP ENERGIE">SOGIP Énergie</option>
                      <option value="SOGIP ACADEMY">SOGIP Academy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sujet</label>
                    <input 
                      type="text" 
                      name="sujet"
                      value={formState.sujet}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Demande de devis"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 text-white font-bold rounded-full px-6 py-4 hover:bg-amber-400 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <span>Envoyer le message</span>
                  )}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Contact;
