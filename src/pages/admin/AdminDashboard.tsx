import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

interface StatsData {
  contacts: {
    total: number;
    nouveaux: number;
    par_filiale: Array<{ filiale: string; total: number }>;
  };
  media: {
    total: number;
  };
  formations: {
    actives: number;
  };
  activite_recente: Array<{
    id: number;
    nom: string;
    prenom: string;
    sujet: string;
    filiale: string;
    created_at: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        if (response.success) {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Chargement des statistiques...</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    { title: 'Contacts Nouveaux', value: statsData?.contacts.nouveaux || 0, icon: <MessageSquare size={24} />, color: 'bg-green-500' },
    { title: 'Total Contacts', value: statsData?.contacts.total || 0, icon: <Users size={24} />, color: 'bg-blue-500' },
    { title: 'Médias Uploadés', value: statsData?.media.total || 0, icon: <ImageIcon size={24} />, color: 'bg-purple-500' },
    { title: 'Formations Actives', value: statsData?.formations.actives || 0, icon: <FileText size={24} />, color: 'bg-sogip-secondary' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
              <div className={`${stat.color} p-4 rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Derniers Messages Contacts</h3>
            <div className="space-y-4">
              {statsData?.activite_recente && statsData.activite_recente.length > 0 ? (
                statsData.activite_recente.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-sogip-primary/10 text-sogip-primary flex items-center justify-center font-bold flex-shrink-0">
                      {msg.nom.charAt(0)}{msg.prenom.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{msg.nom} {msg.prenom} <span className="text-xs font-normal bg-gray-200 px-2 py-0.5 rounded-full ml-2">{msg.filiale}</span></p>
                      <p className="text-xs text-gray-500 mb-1">{new Date(msg.created_at).toLocaleString('fr-FR')}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{msg.sujet}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucun message récent.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacts par filiale</h3>
            <div className="space-y-4">
               {statsData?.contacts.par_filiale && statsData.contacts.par_filiale.length > 0 ? (
                 statsData.contacts.par_filiale.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700 capitalize">{item.filiale === 'groupe' ? 'SOGIP Group' : item.filiale}</span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">{item.total}</span>
                    </div>
                 ))
               ) : (
                 <p className="text-gray-500 text-sm">Aucune donnée disponible.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
