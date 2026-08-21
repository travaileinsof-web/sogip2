import FilialePage from './FilialeLayout';
import PropertiesList from '../../components/immobilier/PropertiesList';

const HERO = {
  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
  logo: '/images/logos/leproprio.jpg',
  name: 'SOGIP IMMO â€” LePropio',
  tagline: "L'immobilier transparent, au service de vos ambitions",
  accent: '#10b981',
};

const SERVICES = [
  {
    icon: 'ðŸ¤',
    title: 'Vente & Achat Sans Commission',
    desc: "Avec LePropio, rÃ©volutionnez votre expÃ©rience immobiliÃ¨re. Notre modÃ¨le unique supprime les commissions d'agence traditionnelles, vous permettant de rÃ©aliser des Ã©conomies significatives sur chaque transaction. Nous mettons directement en relation vendeurs et acheteurs dans la transparence totale, en garantissant des annonces vÃ©rifiÃ©es et sÃ©curisÃ©es.",
    bullets: [
      '0% de commission pour les vendeurs',
      'Mise en relation directe vendeur/acheteur',
      'Annonces vÃ©rifiÃ©es et certifiÃ©es',
      'Visites accompagnÃ©es par nos conseillers',
      'Processus 100% transparent et documentÃ©',
    ],
  },
  {
    icon: 'ðŸ“Š',
    title: 'Ã‰valuation ImmobiliÃ¨re',
    desc: "Une Ã©valuation juste et prÃ©cise est la clÃ© d'une transaction rÃ©ussie. Nos experts immobiliers certifiÃ©s utilisent des mÃ©thodes d'Ã©valuation reconnues â€” mÃ©thode comparative, mÃ©thode par le revenu, mÃ©thode du coÃ»t â€” pour dÃ©terminer la valeur rÃ©elle de votre bien sur le marchÃ© actuel, en tenant compte des spÃ©cificitÃ©s locales.",
    bullets: [
      'Analyse comparative du marchÃ© local',
      "Rapport d\'Ã©valuation certifiÃ© et opposable",
      'Prise en compte des spÃ©cificitÃ©s du quartier',
      'Actualisation aux prix du marchÃ© en temps rÃ©el',
      'DÃ©lai de rÃ©ponse sous 48h',
    ],
  },
  {
    icon: 'âš–ï¸',
    title: 'Accompagnement Juridique',
    desc: "L'aspect juridique de l'immobilier peut Ãªtre complexe et risquÃ©. Notre Ã©quipe de juristes spÃ©cialisÃ©s vous accompagne Ã  chaque Ã©tape : vÃ©rification des titres fonciers, rÃ©daction des actes, purge des hypothÃ¨ques, accompagnement chez le notaire. Votre sÃ©curitÃ© juridique est notre prioritÃ© absolue pour des transactions sans mauvaise surprise.",
    bullets: [
      'VÃ©rification et purification des titres fonciers',
      'RÃ©daction et sÃ©curisation des actes de vente',
      'Purge des hypothÃ¨ques et servitudes',
      'Accompagnement notarial complet',
      'Conseil continu en droit immobilier',
    ],
  },
  {
    icon: 'ðŸŽ¯',
    title: 'Coaching Immobilier',
    desc: "Investir dans l'immobilier demande des connaissances spÃ©cifiques que peu de gens possÃ¨dent. Nos coachs immobiliers certifiÃ©s vous transmettent leur expertise Ã  travers des sessions personnalisÃ©es : stratÃ©gie d'investissement, analyse de rentabilitÃ©, gestion de patrimoine et fiscalitÃ© immobiliÃ¨re pour vous permettre de prendre des dÃ©cisions Ã©clairÃ©es.",
    bullets: [
      "StratÃ©gie d'investissement personnalisÃ©e",
      "Analyse et calcul de rentabilitÃ© locative",
      'Optimisation fiscale et patrimoniale',
      'Gestion de portefeuille immobilier',
      'Sessions individuelles ou en groupe',
    ],
  },
  {
    icon: 'ðŸ¡',
    title: 'Mise en Valeur des PropriÃ©tÃ©s',
    desc: "La premiÃ¨re impression est dÃ©cisive dans une transaction immobiliÃ¨re. Notre Ã©quipe de home staging transforme votre bien pour qu'il sÃ©duise immÃ©diatement les acheteurs ou locataires potentiels. Photographie professionnelle, visite virtuelle 360Â°, optimisation des espaces â€” nous maximisons l'attractivitÃ© et la valeur perÃ§ue de votre propriÃ©tÃ©.",
    bullets: [
      'Home staging professionnel des espaces',
      'Photographie HD et prises de vue drone',
      'Visite virtuelle 360Â° interactive',
      'Optimisation et dÃ©personnalisation des espaces',
      'Conseils dÃ©co et rÃ©amÃ©nagement',
    ],
  },
  {
    icon: 'ðŸ”‘',
    title: 'Gestion Locative',
    desc: "PropriÃ©taire bailleur, confiez-nous la gestion complÃ¨te de votre bien. De la recherche de locataires solvables Ã  la gestion des rÃ©parations, en passant par la comptabilitÃ© et les dÃ©marches administratives â€” nous gÃ©rons tout pour vous permettre de profiter sereinement de vos revenus locatifs sans aucune contrainte.",
    bullets: [
      'SÃ©lection rigoureuse des locataires (solvabilitÃ©)',
      'Encaissement et virement des loyers',
      'Gestion des travaux et rÃ©parations',
      'Suivi des baux et renouvellements',
      'Reporting mensuel dÃ©taillÃ© au propriÃ©taire',
    ],
  },
];

const WHY_US = [
  {
    icon: 'ðŸ’Ž',
    title: 'Transparence Totale',
    desc: 'Notre modÃ¨le sans commission et notre communication directe entre parties garantissent une totale transparence Ã  chaque Ã©tape de votre transaction.',
  },
  {
    icon: 'ðŸ›¡ï¸',
    title: 'SÃ©curitÃ© Juridique',
    desc: 'Des juristes spÃ©cialisÃ©s vÃ©rifient chaque transaction pour vous protÃ©ger des vices cachÃ©s, litiges de propriÃ©tÃ© et autres risques juridiques.',
  },
  {
    icon: 'ðŸ“±',
    title: 'Accompagnement PersonnalisÃ©',
    desc: "Un conseiller dÃ©diÃ© vous accompagne de la premiÃ¨re visite jusqu'Ã  la remise des clÃ©s, disponible 6j/7 pour rÃ©pondre Ã  toutes vos questions.",
  },
];

export default function SogipImmo() {
  return (
    <FilialePage
      seo={{ title: "SOGIP IMMO â€” LePropio | Immobilier sans commission | SOGIP GROUP", description: "LePropio rÃ©volutionne l'immobilier en GuinÃ©e : vente sans commission, Ã©valuation, accompagnement juridique et gestion locative." }}
      hero={HERO}
      intro={"LePropio est la filiale immobiliÃ¨re du Groupe SOGIP. Notre mission : rendre l'immobilier accessible, transparent et rentable pour tous. En supprimant les intermÃ©diaires coÃ»teux et en plaÃ§ant la technologie au service de chaque transaction, nous transformons durablement le marchÃ© immobilier guinÃ©en."}
      services={SERVICES}
      whyUs={WHY_US}
      galleryCategory="immo"
      extra={<PropertiesList />}
    />
  );
}

