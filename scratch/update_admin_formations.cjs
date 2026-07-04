const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminFormations.tsx', 'utf8');

// 1. Add Upload icon import
content = content.replace(/import { Plus, Trash2, Edit2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';/, "import { Plus, Trash2, Edit2, CheckCircle, XCircle, AlertCircle, Upload } from 'lucide-react';");

// 2. Add currency state and logic inside component
const componentStart = /const AdminFormations: React\.FC = \(\) => {/;
const stateInsert = `
  const [inputCurrency, setInputCurrency] = useState('EUR');
  const [inputValue, setInputValue] = useState<number | string>('');

  const RATES: Record<string, number> = { EUR: 1, USD: 1.08, FCFA: 655, GNF: 9300 };

  useEffect(() => {
    if (formData.price !== undefined) {
      setInputValue(Math.round(formData.price * RATES[inputCurrency]));
    } else {
      setInputValue('');
    }
  }, [inputCurrency, formData.price]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputValue(e.target.value);
    if (!isNaN(val)) {
      setFormData(prev => ({ ...prev, price: Math.round(val / RATES[inputCurrency]) }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMessage({ type: 'success', text: 'Upload en cours...' });
    const fd = new FormData();
    fd.append('image', file);
    
    try {
      const response = await api.post('/admin/upload', fd);
      setFormData(prev => ({ ...prev, image: response.url }));
      setMessage({ type: 'success', text: 'Image importée avec succès !' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\\'upload de l\\'image.' });
    }
  };
`;
content = content.replace(componentStart, 'const AdminFormations: React.FC = () => {' + stateInsert);

// 3. Replace price input
const priceInputRegex = /<div className="col-span-1">\s*<label className="block text-sm font-medium text-gray-700 mb-1">Prix \(GNF\/XOF\)<\/label>\s*<input required type="number" name="price" value=\{formData\.price \|\| 0\} onChange=\{handleInputChange\} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" \/>\s*<\/div>/;
const newPriceInput = `
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <div className="flex gap-2">
                  <input required type="number" value={inputValue} onChange={handlePriceChange} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Montant" />
                  <select value={inputCurrency} onChange={(e) => setInputCurrency(e.target.value)} className="w-24 px-2 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500">
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="FCFA">FCFA</option>
                    <option value="GNF">GNF</option>
                  </select>
                </div>
                {formData.price !== undefined && inputCurrency !== 'EUR' && (
                  <p className="text-xs text-gray-500 mt-1">Sauvegardé en base : {formData.price} EUR</p>
                )}
              </div>
`;
content = content.replace(priceInputRegex, newPriceInput);

// 4. Replace image input
const imageInputRegex = /<div className="col-span-2">\s*<label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image \(unsplash\/etc\)<\/label>\s*<input required type="text" name="image" value=\{formData\.image \|\| ''\} onChange=\{handleInputChange\} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" \/>\s*<\/div>/;
const newImageInput = `
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image de la formation</label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} alt="Aperçu" className="h-16 w-16 object-cover rounded-lg shadow-sm" />}
                  <div className="flex-1">
                    <input type="text" name="image" value={formData.image || ''} onChange={handleInputChange} placeholder="URL de l'image (ou utilisez le bouton d'import)" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2" />
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Upload size={16} />
                      <span>Importer une image depuis votre appareil</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              </div>
`;
content = content.replace(imageInputRegex, newImageInput);

fs.writeFileSync('src/pages/admin/AdminFormations.tsx', content, 'utf8');
console.log('AdminFormations.tsx updated.');
