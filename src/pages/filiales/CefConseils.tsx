import { Link } from 'react-router-dom';
import FilialePage from './FilialeLayout';
import FadeIn from '../../components/animations/FadeIn';

const HERO = {
  image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
  logo: '/images/logos/academie_sogip.jpg',
  name: 'CEF CONSEILS',
  tagline: 'Former, Conseiller, Transformer. Votre avenir professionnel commence ici.',
  accent: '#6366f1',
};

const SERVICES = [
  {
    icon: '🎯',
    title: "Conseil en Stratégie d'Entreprise",
    desc: "Définir une stratégie claire est la condition première du succès. Nos consultants seniors accompagnent dirigeants et managers dans la formulation de leur vision, l'analyse de leur environnement concurrentiel et la définition de feuilles de route opérationnelles qui créent de la valeur mesurable.",
    bullets: [
      'Diagnostic stratégique et analyse SWOT',
      'Définition de la vision et des objectifs SMART',
      "Plan stratégique sur 3 à 5 ans",
      "Accompagnement à la mise en œuvre",
      "Tableaux de bord et KPIs stratégiques",
    ],
  },
  {
    icon: '👥',
    title: 'Conseil en Ressources Humaines',
    desc: "Le capital humain est le principal actif d'une entreprise performante. Nos experts RH vous accompagnent dans l'optimisation de vos processus de recrutement, la gestion des talents, le développement des compétences et la mise en place d'une culture d'entreprise forte et engageante.",
    bullets: [
      'Audit RH et cartographie des compétences',
      'Processus de recrutement et évaluation',
      'Plans de développement des talents',
      "Politique de rémunération et avantages",
      "Gestion des conflits et médiation",
    ],
  },
  {
    icon: '💻',
    title: 'Conseil en Transformation Digitale',
    desc: "La révolution numérique transforme tous les secteurs d'activité. Nos consultants en transformation digitale vous guident dans l'adoption des technologies adaptées à votre contexte, la digitalisation de vos processus clés et le développement des compétences numériques de vos équipes.",
    bullets: [
      'Audit de maturité digitale',
      'Sélection et intégration des outils numériques',
      'Automatisation des processus (ERP, CRM)',
      "Formation des équipes aux outils digitaux",
      "Accompagnement au changement",
    ],
  },
  {
    icon: '🔍',
    title: 'Audit & Diagnostic Organisationnel',
    desc: "Avant de prescrire, il faut diagnostiquer. Nos auditeurs réalisent des analyses approfondies de votre organisation : processus, structures, gouvernance, performance — pour identifier avec précision les dysfonctionnements et les leviers d'amélioration qui auront le plus fort impact sur votre efficacité.",
    bullets: [
      'Analyse des processus métier (cartographie)',
      "Évaluation de la gouvernance et des contrôles internes",
      "Benchmarking sectoriel",
      "Rapport de recommandations priorisées",
      "Plan d'actions correctives chiffré",
    ],
  },
];

const FORMATION_CATEGORIES = [
  { emoji: '🏗️', title: 'Génie Civil, BTP & Infrastructures', color: 'bg-amber-50 border-amber-200', accent: '#f59e0b' },
  { emoji: '☀️', title: 'Énergies Renouvelables & Efficacité Énergétique', color: 'bg-orange-50 border-orange-200', accent: '#f97316' },
  { emoji: '🏠', title: 'Immobilier & Gestion Patrimoniale', color: 'bg-emerald-50 border-emerald-200', accent: '#10b981' },
  { emoji: '📈', title: 'Management & Développement Personnel', color: 'bg-blue-50 border-blue-200', accent: '#3b82f6' },
  { emoji: '💻', title: 'Digital, Data & Technologies', color: 'bg-purple-50 border-purple-200', accent: '#8b5cf6' },
  { emoji: '🛡️', title: 'QHSE & Environnement', color: 'bg-green-50 border-green-200', accent: '#22c55e' },
];

const FormationsSection = () => (
  <section className="bg-[#0a1628] py-24">
    <div className="max-w-7xl mx-auto px-6">
      <FadeIn>
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4 bg-indigo-500/20 text-indigo-300">
            CEF CONSEILS Academy
          </span>
          <h2 className="title-font text-4xl md:text-5xl font-bold text-white mb-4">
            Nos Formations <span className="text-indigo-400">Certifiantes</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Des formations professionnelles certifiantes, en ligne et hybrides, conçues pour répondre aux exigences du marché du travail moderne.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {FORMATION_CATEGORIES.map((cat, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div className={`${cat.color} border-2 rounded-2xl p-6 flex items-center justify-between gap-4 hover:scale-[1.02] transition-transform duration-300`}>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{cat.emoji}</span>
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{cat.title}</h3>
              </div>
              <Link
                to="/formations"
                className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                style={{ backgroundColor: `${cat.accent}20`, color: cat.accent, border: `1px solid ${cat.accent}40` }}
              >
                Voir →
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="text-center">
          <Link
            to="/formations"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50 text-lg"
          >
            Découvrir nos formations →
          </Link>
        </div>
      </FadeIn>
    </div>
  </section>
);

const WHY_US = [
  {
    icon: '🎓',
    title: 'Formateurs Experts',
    desc: "Nos formateurs sont des praticiens en activité, reconnus dans leur domaine, qui partagent des connaissances immédiatement applicables.",
  },
  {
    icon: '📜',
    title: 'Certifications Reconnues',
    desc: "Nos formations sont certifiantes et reconnues par les institutions professionnelles, valorisant votre CV sur le marché du travail.",
  },
  {
    icon: '🌍',
    title: 'Formats Flexibles',
    desc: "En présentiel, en ligne ou hybride — nos formations s'adaptent à votre agenda et à votre localisation pour maximiser votre apprentissage.",
  },
];

export default function CefConseils() {
  return (
    <FilialePage
      seo={{ title: 'CEF CONSEILS — Formation & Conseil Professionnel | SOGIP GROUP', description: 'CEF CONSEILS : formations certifiantes, conseil en stratégie, RH, transformation digitale et audit organisationnel.' }}
      hero={HERO}
      intro="CEF CONSEILS est la filiale formation et conseil du Groupe SOGIP. Notre mission est double : accompagner les entreprises dans leur développement stratégique et organisationnel, et former les professionnels de demain grâce à des programmes certifiants d'excellence, alignés sur les besoins réels du marché."
      services={SERVICES}
      whyUs={WHY_US}
      extra={<FormationsSection />}
      galleryCategory="academie"
    />
  );
}
