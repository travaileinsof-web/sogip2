import FilialePage from './FilialeLayout';
import PropertiesList from '../../components/immobilier/PropertiesList';

const HERO = {
  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
  logo: '/images/logos/leproprio.jpg',
  name: 'SOGIP IMMO — LePropio',
  tagline: "L'immobilier transparent, au service de vos ambitions",
  accent: '#10b981',
};

const SERVICES = [
  {
    icon: '🤝',
    title: 'Vente & Achat Sans Commission',
    desc: "Avec LePropio, révolutionnez votre expérience immobilière. Notre modèle unique supprime les commissions d'agence traditionnelles, vous permettant de réaliser des économies significatives sur chaque transaction. Nous mettons directement en relation vendeurs et acheteurs dans la transparence totale, en garantissant des annonces vérifiées et sécurisées.",
    bullets: [
      '0% de commission pour les vendeurs',
      'Mise en relation directe vendeur/acheteur',
      'Annonces vérifiées et certifiées',
      'Visites accompagnées par nos conseillers',
      'Processus 100% transparent et documenté',
    ],
  },
  {
    icon: '📊',
    title: 'Évaluation Immobilière',
    desc: "Une évaluation juste et précise est la clé d'une transaction réussie. Nos experts immobiliers certifiés utilisent des méthodes d'évaluation reconnues — méthode comparative, méthode par le revenu, méthode du coût — pour déterminer la valeur réelle de votre bien sur le marché actuel, en tenant compte des spécificités locales.",
    bullets: [
      'Analyse comparative du marché local',
      "Rapport d'évaluation certifié et opposable",
      'Prise en compte des spécificités du quartier',
      'Actualisation aux prix du marché en temps réel',
      'Délai de réponse sous 48h',
    ],
  },
  {
    icon: '⚖️',
    title: 'Accompagnement Juridique',
    desc: "L'aspect juridique de l'immobilier peut être complexe et risqué. Notre équipe de juristes spécialisés vous accompagne à chaque étape : vérification des titres fonciers, rédaction des actes, purge des hypothèques, accompagnement chez le notaire. Votre sécurité juridique est notre priorité absolue pour des transactions sans mauvaise surprise.",
    bullets: [
      'Vérification et purification des titres fonciers',
      'Rédaction et sécurisation des actes de vente',
      'Purge des hypothèques et servitudes',
      'Accompagnement notarial complet',
      'Conseil continu en droit immobilier',
    ],
  },
  {
    icon: '🎯',
    title: 'Coaching Immobilier',
    desc: "Investir dans l'immobilier demande des connaissances spécifiques que peu de gens possèdent. Nos coachs immobiliers certifiés vous transmettent leur expertise à travers des sessions personnalisées : stratégie d'investissement, analyse de rentabilité, gestion de patrimoine et fiscalité immobilière pour vous permettre de prendre des décisions éclairées.",
    bullets: [
      'Stratégie d'investissement personnalisée',
      'Analyse et calcul de rentabilité locative',
      'Optimisation fiscale et patrimoniale',
      'Gestion de portefeuille immobilier',
      'Sessions individuelles ou en groupe',
    ],
  },
  {
    icon: '🏘️',
    title: 'Mise en Valeur des Propriétés',
    desc: "La première impression est décisive dans une transaction immobilière. Notre équipe de home staging transforme votre bien pour qu'il séduise immédiatement les acheteurs ou locataires potentiels. Photographie professionnelle, visite virtuelle 360°, optimisation des espaces — nous maximisons l'attractivité et la valeur perçue de votre propriété.",
    bullets: [
      'Home staging professionnel des espaces',
      'Photographie HD et prises de vue drone',
      'Visite virtuelle 360° interactive',
      'Optimisation et dépersonnalisation des espaces',
      'Conseils déco et réaménagement',
    ],
  },
  {
    icon: '🔑',
    title: 'Gestion Locative',
    desc: "Propriétaire bailleur, confiez-nous la gestion complète de votre bien. De la recherche de locataires solvables à la gestion des réparations, en passant par la comptabilité et les démarches administratives — nous gérons tout pour vous permettre de profiter sereinement de vos revenus locatifs sans aucune contrainte.",
    bullets: [
      'Sélection rigoureuse des locataires (solvabilité)',
      'Encaissement et virement des loyers',
      'Gestion des travaux et réparations',
      'Suivi des baux et renouvellements',
      'Reporting mensuel détaillé au propriétaire',
    ],
  },
];

const FEATURES = [
  {
    icon: '💎',
    title: 'Transparence Totale',
    desc: "Notre modèle sans commission et notre communication directe entre parties garantissent une totale transparence à chaque étape de votre transaction.",
  },
  {
    icon: '🛡️',
    title: 'Sécurité Juridique',
    desc: "Des juristes spécialisés vérifient chaque transaction pour vous protéger des vices cachés, litiges de propriété et autres risques juridiques.",
  },
  {
    icon: '📱',
    title: 'Accompagnement Personnalisé',
    desc: "Un conseiller dédié vous accompagne de la première visite jusqu'à la remise des clés, disponible 6j/7 pour répondre à toutes vos questions.",
  },
];

const PROPERTIES_SECTION = (
  <div className="bg-gray-50 py-20">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="title-font text-4xl font-bold text-gray-900 mb-6">Nos Offres Immobilières</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Découvrez notre sélection de biens immobiliers vérifiés et certifiés. Que ce soit pour acheter, vendre ou louer, nous vous accompagnons à chaque étape.
        </p>
      </div>
      <PropertiesList />
    </div>
  </div>
);

export default function SogipImmo() {
  return (
    <FilialePage
      hero={HERO}
      services={SERVICES}
      features={FEATURES}
      extra={PROPERTIES_SECTION}
    />
  );
}
