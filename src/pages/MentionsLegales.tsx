import React from 'react';
import FadeIn from '../components/animations/FadeIn';

const MentionsLegales: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 bg-white p-12 rounded-2xl shadow-sm border border-slate-100">
        <FadeIn>
          <h1 className="title-font text-4xl md:text-5xl font-bold text-blue-900 mb-8 border-b border-slate-100 pb-6">
            Mentions Légales
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <div className="prose prose-slate max-w-none prose-h2:text-blue-900 prose-h2:font-bold prose-h2:title-font prose-a:text-amber-500">
            <h2>1. Éditeur du site</h2>
            <p>
              SOGIP Group<br />
              Bluezone de Dixinn<br />
              Conakry, Guinée<br />
              Téléphone : +224 620 52 12 49<br />
              Email : contact@sogipgroup.com
            </p>

            <h2>2. Hébergement</h2>
            <p>
              Ce site est hébergé par [Nom de l'hébergeur] - [Adresse de l'hébergeur].
            </p>

            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation guinéenne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>

            <h2>4. Données personnelles</h2>
            <p>
              D'une façon générale, vous pouvez visiter notre site sur Internet sans avoir à décliner votre identité et à fournir des informations personnelles vous concernant. Cependant, nous pouvons parfois vous demander des informations, par exemple pour traiter une demande via le formulaire de contact.
            </p>

            <h2>5. Limite de responsabilité</h2>
            <p>
              L'éditeur ne saurait être tenu pour responsable des erreurs matérielles qui se seraient glissées dans les documents présents sur le site, malgré tout le soin apporté à leur publication.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default MentionsLegales;
