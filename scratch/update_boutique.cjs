const fs = require('fs');

let content = fs.readFileSync('src/pages/Boutique.tsx', 'utf8');

// 1. Add currency state and rates
const componentStart = /const Boutique: React\.FC = \(\) => {/;
const stateInsert = `
  const [currency, setCurrency] = useState('GNF');
  const RATES: Record<string, number> = { EUR: 1, USD: 1.08, FCFA: 655, GNF: 9300 };
`;
content = content.replace(componentStart, 'const Boutique: React.FC = () => {' + stateInsert);

// 2. Add currency selector above products grid
const titleRegex = /<h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">\s*Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Produits<\/span>\s*<\/h1>\s*<p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">\s*Découvrez nos équipements d'énergies renouvelables ultra-qualitatifs pour répondre à tous vos besoins en autonomie énergétique\.\s*<\/p>\s*<\/FadeIn>\s*<\/div>/;

const newTitleBlock = `
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Produits</span>
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Découvrez nos équipements d'énergies renouvelables ultra-qualitatifs pour répondre à tous vos besoins en autonomie énergétique.
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-slate-500 font-medium">Afficher les prix en :</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm"
            >
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
              <option value="FCFA">FCFA</option>
              <option value="GNF">GNF</option>
            </select>
          </div>
        </FadeIn>
      </div>
`;
content = content.replace(titleRegex, () => newTitleBlock);

// 3. Add price to product cards
const cardContentRegex = /<h3 className="text-xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-amber-500 transition-colors">\s*\{product\.title\}\s*<\/h3>/;
const newCardContent = `
                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-500 transition-colors">
                    {product.title}
                  </h3>
                  <div className="mb-4 text-lg font-extrabold text-amber-600">
                    {product.price ? (
                      currency === 'EUR' ? \`\${product.price} €\` : 
                      currency === 'USD' ? \`\${Math.round(product.price * RATES.USD)} $\` : 
                      currency === 'FCFA' ? \`\${product.price * RATES.FCFA} FCFA\` : 
                      \`\${product.price * RATES.GNF} GNF\`
                    ) : 'Prix sur demande'}
                  </div>
`;
content = content.replace(cardContentRegex, () => newCardContent);

fs.writeFileSync('src/pages/Boutique.tsx', content, 'utf8');
console.log('Boutique.tsx updated without replace issue.');
