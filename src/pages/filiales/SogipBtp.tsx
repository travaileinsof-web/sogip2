import FilialePage from './FilialeLayout';

const HERO = {
  image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
  logo: '/images/logos/sogip_btp_new.jpg',
  name: 'SOGIP BTP',
  tagline: "L'excellence dans la construction et les travaux publics",
  accent: '#f59e0b',
};

const SERVICES = [
  {
    icon: '🏢',
    title: 'Constructions Résidentielles & Commerciales',
    desc: "De la villa individuelle aux complexes commerciaux, SOGIP BTP maîtrise l'ensemble du cycle de construction. Nos architectes et ingénieurs garantissent des bâtiments conformes aux normes parasismiques et aux dernières réglementations en vigueur, avec des matériaux de haute qualité soigneusement sélectionnés pour chaque type de structure.",
    bullets: [
      'Conception architecturale sur mesure',
      'Respect des normes parasismiques internationales',
      'Matériaux certifiés et durables',
      'Suivi de chantier en temps réel',
      'Livraison clé en main garantie',
    ],
  },
  {
    icon: '🌉',
    title: 'Travaux de Génie Civil',
    desc: "SOGIP BTP intervient sur les grands ouvrages d'infrastructure qui structurent le territoire. Ponts, tunnels, barrages, fondations spéciales — nos équipes d'ingénieurs expérimentés relèvent les défis techniques les plus complexes avec rigueur, précision et le respect absolu des normes de sécurité.",
    bullets: [
      "Ouvrages d'art (ponts, viaducs, dalots)",
      'Fondations spéciales et deep drilling',
      'Terrassement et excavation mécanisés',
      'Calcul aux éléments finis (FEM)',
      'Contrôle géotechnique et auscultation',
    ],
  },
  {
    icon: '🛣️',
    title: 'Voiries & Aménagements Urbains',
    desc: "La qualité d'une ville se mesure aussi à la qualité de ses voies de circulation. SOGIP BTP conçoit et réalise des axes routiers, des carrefours, des zones piétonnes et des aménagements paysagers qui améliorent durablement le cadre de vie des populations et fluidifient les déplacements.",
    bullets: [
      'Routes bitumées, pavées et en terre stabilisée',
      'Signalisation horizontale et verticale',
      'Éclairage public LED et solaire',
      "Réseaux d'assainissement pluviaux",
      'Espaces verts et mobilier urbain',
    ],
  },
  {
    icon: '🔨',
    title: 'Réhabilitation & Rénovation',
    desc: "Le patrimoine bâti existant mérite une seconde vie. Notre équipe spécialisée en réhabilitation intervient sur des bâtiments anciens, dégradés ou inadaptés pour les remettre aux standards modernes tout en préservant leur caractère architectural et leur valeur patrimoniale.",
    bullets: [
      'Diagnostic structurel préalable complet',
      'Renforcement par injection et béton projeté',
      'Mise aux normes électriques et plomberie',
      'Isolation thermique et acoustique',
      'Ravalement de façade et étanchéité',
    ],
  },
  {
    icon: '🌾',
    title: 'Aménagement de Bas-Fonds Agricoles',
    desc: "La valorisation des zones humides et bas-fonds représente un enjeu stratégique pour la sécurité alimentaire. SOGIP BTP réalise des ouvrages hydrauliques et des aménagements qui transforment ces terres en zones agricoles productives et durables, au bénéfice des communautés locales.",
    bullets: [
      'Études hydrologiques et topographiques',
      "Canaux d'irrigation et systèmes de drainage",
      'Diguettes et casiers rizicoles',
      "Pistes rurales d'accès tout-temps",
      'Formation des utilisateurs et associations',
    ],
  },
  {
    icon: '📐',
    title: 'Études & Ingénierie',
    desc: "En amont de chaque projet, notre bureau d'études réalise des études complètes : faisabilité, avant-projets sommaires et détaillés, dossiers d'appel d'offres, suivi et contrôle des travaux. Une expertise pluridisciplinaire qui garantit la réussite de votre projet de A à Z.",
    bullets: [
      'Études de faisabilité technique et économique',
      'Plans architecturaux et métrés détaillés',
      "Dossiers d'appel d'offres (DAO/DAAO)",
      'Contrôle de conformité et récolement',
      'Management de projet et reporting client',
    ],
  },
];

const WHY_US = [
  {
    icon: '🏆',
    title: 'Expertise Reconnue',
    desc: "Plus de 10 ans d'expérience dans les travaux de construction et d'infrastructure sur le territoire guinéen et dans la sous-région.",
  },
  {
    icon: '⚙️',
    title: 'Équipements Modernes',
    desc: "Un parc matériel régulièrement renouvelé et des équipes formées aux dernières technologies de construction pour des chantiers efficaces.",
  },
  {
    icon: '🤝',
    title: 'Engagement Qualité',
    desc: 'Chaque projet est suivi par un ingénieur responsable de la qualité, garantissant le respect des normes et des délais contractuels.',
  },
];

export default function SogipBtp() {
  return (
    <FilialePage
      seo={{ title: 'SOGIP BTP — Construction & Travaux Publics | SOGIP GROUP', description: "SOGIP BTP : construction résidentielle, génie civil, voiries, réhabilitation et aménagements agricoles en Guinée." }}
      hero={HERO}
      intro="SOGIP BTP est le pôle construction du Groupe SOGIP. Fort d'une équipe pluridisciplinaire d'ingénieurs, d'architectes et de techniciens expérimentés, nous intervenons sur l'ensemble du spectre de la construction : du bâtiment individuel aux grands ouvrages d'infrastructure, en passant par les aménagements urbains et ruraux."
      services={SERVICES}
      whyUs={WHY_US}
    />
  );
}
