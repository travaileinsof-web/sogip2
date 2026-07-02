import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  sujet: string;
  filiale: string;
  statut: string;
  created_at: string;
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/admin/contacts');
      if (response.success) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/admin/contacts/${id}/read`, {});
      fetchContacts();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleStatusChange = async (id: number, statut: string) => {
     try {
       await api.put(`/admin/contacts/${id}/status`, { statut });
       fetchContacts();
     } catch (error) {
       console.error('Failed to change status', error);
     }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact', error);
    }
  };

  const viewDetails = async (contact: Contact) => {
    if (contact.statut === 'nouveau') {
      await markAsRead(contact.id);
    }
    
    try {
      const response = await api.get(`/admin/contacts/${contact.id}`);
      if (response.success) {
        setSelectedContact(response.data);
      }
    } catch(e) {
      console.error('Failed to load details', e);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Liste des messages */}
        <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col h-[600px]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">Boîte de réception</h3>
          </div>
          
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {contacts.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Aucun message.</p>
            ) : (
              contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  onClick={() => viewDetails(contact)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${contact.statut === 'nouveau' ? 'bg-blue-50/50 border-l-4 border-sogip-primary' : 'border-l-4 border-transparent'} ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate pr-2">
                      {contact.nom} {contact.prenom}
                    </h4>
                    <span className="text-xs text-gray-500 shrink-0">
                      {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className={`text-xs ${contact.statut === 'nouveau' ? 'font-semibold text-gray-800' : 'text-gray-500'} truncate`}>
                    {contact.sujet}
                  </p>
                  <div className="mt-2 text-xs">
                     <span className="px-2 py-0.5 bg-gray-200 rounded-full">{contact.filiale}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Détail du message */}
        <div className="w-full md:w-2/3 flex flex-col h-[600px] bg-gray-50/50">
          {selectedContact ? (
            <>
              <div className="px-8 py-6 border-b border-gray-100 bg-white flex justify-between items-start shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedContact.sujet}</h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(selectedContact.created_at).toLocaleString('fr-FR')}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-md font-medium capitalize">{selectedContact.filiale}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select 
                    value={selectedContact.statut}
                    onChange={(e) => {
                      handleStatusChange(selectedContact.id, e.target.value);
                      setSelectedContact({...selectedContact, statut: e.target.value});
                    }}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-sogip-primary focus:ring focus:ring-sogip-primary focus:ring-opacity-50"
                  >
                    <option value="lu">Lu</option>
                    <option value="traite">Traité</option>
                    <option value="archive">Archivé</option>
                  </select>
                  <button onClick={() => handleDelete(selectedContact.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Supprimer">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-sogip-primary/10 flex items-center justify-center text-sogip-primary font-bold text-lg">
                        {selectedContact.nom.charAt(0)}{selectedContact.prenom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedContact.nom} {selectedContact.prenom}</p>
                        <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                          <a href={`mailto:${selectedContact.email}`} className="flex items-center hover:text-sogip-primary"><Mail size={14} className="mr-1" /> {selectedContact.email}</a>
                          {selectedContact.telephone && (
                            <a href={`tel:${selectedContact.telephone}`} className="flex items-center hover:text-sogip-primary"><Phone size={14} className="mr-1" /> {selectedContact.telephone}</a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {/* Hack to avoid ts error on message if we didn't type it in Contact interface. Assume it exists when fetching details */}
                    {(selectedContact as any).message || 'Aucun contenu.'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Mail size={48} className="mb-4 text-gray-300" />
              <p>Sélectionnez un message pour l'afficher</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
