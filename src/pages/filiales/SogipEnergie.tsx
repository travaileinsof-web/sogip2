import { Link } from 'react-router-dom';
import FilialePage from './FilialeLayout';
import FadeIn from '../../components/animations/FadeIn';

const ProduitsSection = () => (
  <section className="bg-orange-50 py-24 border-y border-orange-100">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <FadeIn>
        <h2 className="title-font text-4xl font-bold text-slate-800 mb-6">
          Nos Équipements & Produits Solaires
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-12">
          Découvrez notre gamme complète d'équipements solaires (panneaux, onduleurs, batteries) de haute qualité pour vos projets d'énergie renouvelable.
        </p>
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 text-lg"
        >
          Découvrir nos produits →
        </Link>
      </FadeIn>
    </div>
  </section>
);
const HERO = {
  image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200',
  logo: '/images/logos/soleil_guinee_transparent.png',
  name: 'SOGIP ÉNERGIE — Soleil Guinée',
  tagline: "L'énergie solaire, propre et accessible pour tous",
  accent: '#f97316',
};

const SERVICES = [
  {
    icon: '🔬',
    title: 'Études Énergétiques',
    desc: "Avant toute installation, une étude approfondie s'impose. Nos ingénieurs énergéticiens réalisent un audit complet de vos besoins : consommation actuelle, potentiel solaire du site, contraintes techniques et budgétaires. Cette étude est la fondation indispensable d'une installation performante, économique et rentable sur le long terme.",
    bullets: [
      'Audit complet de consommation électrique',
      "Évaluation du potentiel solaire (ensoleillement)",
      "Analyse des ombrages et orientation optimale",
      "Rapport de faisabilité technico-économique",
      "Calcul du retour sur investissement (ROI)",
    ],
  },
  {
    icon: '📐',
    title: 'Dimensionnement Solaire',
    desc: "Un système solaire mal dimensionné engendre gaspillage ou sous-production. Nos ingénieurs calculent avec précision la puissance des panneaux, la capacité des batteries et les onduleurs adaptés à votre situation réelle : puissance consommée, heures d'ensoleillement locales, autonomie souhaitée et budget disponible.",
    bullets: [
      'Calcul précis de la puissance crête (Wc)',
      'Dimensionnement du parc batteries (Wh)',
      'Sélection des onduleurs hybrides et MPPT',
      'Simulation de production annuelle (kWh)',
      'Optimisation du schéma de câblage DC/AC',
    ],
  },
  {
    icon: '📦',
    title: "Fourniture d'Équipements",
    desc: "Soleil Guinée sélectionne rigoureusement ses équipements parmi les meilleurs fabricants mondiaux. Panneaux monocristallins haute performance, onduleurs hybrides de dernière génération, batteries lithium-ion LiFePO4 longue durée — nous garantissons la qualité, les certifications et la disponibilité des pièces de rechange.",
    bullets: [
      'Panneaux monocristallins certifiés IEC/TÜV',
      'Onduleurs hybrides hors-réseau et on-grid',
      'Batteries lithium LiFePO4 (10+ ans de durée de vie)',
      'Régulateurs MPPT et PWM haute performance',
      'Structures de fixation et câblage certifiés',
    ],
  },
  {
    icon: '🔧',
    title: 'Installation & Mise en Service',
    desc: "L'installation est réalisée par nos techniciens certifiés selon les normes internationales de sécurité électrique. De la pose des panneaux sur toiture ou au sol, au câblage DC/AC, jusqu'aux tests de mise en service et à la formation complète des utilisateurs — chaque étape est documentée, certifiée et garantie.",
    bullets: [
      'Pose certifiée selon normes IEC/CEI 60364',
      'Câblage DC et AC sécurisé et protégé',
      'Tests de performance et de sécurité',
      'Formation des utilisateurs à la gestion du système',
      'Documentation technique et certificats de conformité',
    ],
  },
  {
    icon: '⚙️',
    title: 'Paramétrage & Assistance Technique',
    desc: "Une installation solaire performante nécessite un paramétrage optimal. Nos techniciens configurent les onduleurs, les régulateurs de charge et les systèmes de monitoring en ligne pour extraire le maximum d'énergie de votre installation. Notre support technique est disponible pour répondre à toutes vos questions rapidement.",
    bullets: [
      'Configuration précise des onduleurs et MPPT',
      'Mise en place du monitoring en ligne (Wi-Fi/4G)',
      'Formation au tableau de bord de production',
      'Support téléphonique réactif 6j/7',
      'Mise à jour des firmwares et logiciels',
    ],
  },
  {
    icon: '🛡️',
    title: 'Maintenance & Suivi',
    desc: "Pour maximiser la durée de vie et les performances de votre installation, Soleil Guinée propose des contrats de maintenance adaptés à chaque client. Nettoyage des panneaux, vérification des connexions, contrôle des performances, remplacement des pièces défectueuses — votre système est entre de bonnes mains pour des années.",
    bullets: [
      'Nettoyage périodique des panneaux solaires',
      'Vérification des connexions et câblages',
      "Analyse des courbes de production (détection d'anomalies)",
      'Remplacement de pièces sous garantie',
      'Rapport de maintenance trimestriel détaillé',
    ],
  },
];

const WHY_US = [
  {
    icon: '☀️',
    title: 'Expertise Solaire Locale',
    desc: "Nos ingénieurs connaissent parfaitement les conditions d'ensoleillement guinéennes et les contraintes locales pour des installations parfaitement adaptées.",
  },
  {
    icon: '🏅',
    title: 'Équipements Certifiés',
    desc: 'Nous travaillons exclusivement avec des marques certifiées IEC/TÜV, garantissant des performances durables et un retour sur investissement optimisé.',
  },
  {
    icon: '🌿',
    title: 'Impact Environnemental',
    desc: "Chaque installation Soleil Guinée contribue à réduire les émissions de CO₂ et à l'indépendance énergétique de la Guinée, pour un avenir plus vert.",
  },
];

export default function SogipEnergie() {
  return (
    <FilialePage
      seo={{ title: 'SOGIP ÉNERGIE — Soleil Guinée | Énergie Solaire | SOGIP GROUP', description: "Soleil Guinée : études énergétiques, dimensionnement, fourniture et installation de systèmes solaires photovoltaïques en Guinée." }}
      hero={HERO}
      intro="Soleil Guinée est la filiale énergie du Groupe SOGIP, dédiée au développement des énergies renouvelables en Guinée et dans la sous-région. Face aux défis énergétiques actuels, nous proposons des solutions solaires clé en main, économiques et durables, adaptées aussi bien aux ménages qu'aux entreprises et institutions."
      services={SERVICES}
      whyUs={WHY_US}
      extra={<ProduitsSection />}
    />
  );
}
