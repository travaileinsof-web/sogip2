const fs = require('fs');
let content = fs.readFileSync('src/pages/Formations.tsx', 'utf8');

const regex = /const formationsList = \[[\s\S]*?\];\s*const categories/m;

const newCode = `
  const [formationsList, setFormationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const { api } = await import('../services/api');
        const response = await api.get('/formations');
        
        // Group by category
        const grouped = response.reduce((acc, curr) => {
          const cat = curr.category;
          if (!acc[cat]) {
            acc[cat] = {
              category: cat,
              courses: []
            };
          }
          acc[cat].courses.push({
            id: curr.id,
            title: curr.title,
            duration: curr.duration,
            price: curr.price,
            desc: curr.description,
            image: curr.image
          });
          return acc;
        }, {});
        
        setFormationsList(Object.values(grouped));
      } catch (error) {
        console.error('Erreur chargement formations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
  }, []);

  const categories`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/pages/Formations.tsx', content, 'utf8');
console.log('Replaced formationsList successfully.');
