import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Upload, Trash2, Image as ImageIcon, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { api, BACKEND_URL } from '../../services/api';

interface Media {
  id: number;
  filename: string;
  filepath: string;
  type: string;
  size: number;
  created_at: string;
}

const AdminMedia: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await api.get('/admin/media');
      if (response.success) {
        setMedias(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch media', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des médias.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      // Pour l'upload de fichier, on doit utiliser fetch directement car Axios ou notre utilitaire api.post
      // a besoin d'être configuré pour les FormData s'il stringify le body
      const token = localStorage.getItem('sogip_admin_token');
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Fichier importé avec succès.' });
        fetchMedia();
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'import.' });
      }
    } catch (error) {
      console.error('Upload failed', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'import du fichier.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce média ?')) return;
    try {
      await api.delete(`/admin/media/${id}`);
      fetchMedia();
      setMessage({ type: 'success', text: 'Média supprimé avec succès.' });
    } catch (error) {
      console.error('Delete failed', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiée dans le presse-papier !');
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Médiathèque</h3>
          <div className="flex items-center space-x-4">
             <button onClick={fetchMedia} className="text-gray-500 hover:text-sogip-primary" title="Rafraîchir">
               <RefreshCw size={20} />
             </button>
             <label className="cursor-pointer px-4 py-2 bg-sogip-primary text-white rounded-md hover:bg-blue-900 transition-colors flex items-center text-sm font-medium">
               <Upload size={18} className="mr-2" />
               {uploading ? 'Import...' : 'Importer un fichier'}
               <input 
                 type="file" 
                 className="hidden" 
                 ref={fileInputRef}
                 onChange={handleFileUpload}
                 accept="image/*,application/pdf"
               />
             </label>
          </div>
        </div>
        
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-md flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
             <AlertCircle className="w-5 h-5 mr-2" />
             {message.text}
          </div>
        )}

        <div className="p-6">
          {medias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ImageIcon size={48} className="mb-4 text-gray-300" />
              <p>Aucun média trouvé dans la bibliothèque.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {medias.map((media) => (
                <div key={media.id} className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square flex items-center justify-center bg-gray-100 overflow-hidden">
                    {media.type.startsWith('image/') ? (
                       <img src={`${BACKEND_URL}${media.filepath}`} alt={media.filename} className="w-full h-full object-cover" />
                    ) : (
                       <div className="text-gray-400 flex flex-col items-center">
                         <FileText size={40} />
                         <span className="text-xs mt-2 uppercase">{media.type.split('/')[1] || 'FILE'}</span>
                       </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 truncate" title={media.filename}>{media.filename}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatSize(media.size)}</p>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3">
                    <button 
                      onClick={() => copyToClipboard(`${BACKEND_URL}${media.filepath}`)}
                      className="px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded hover:bg-gray-100"
                    >
                      Copier l'URL
                    </button>
                    <button 
                      onClick={() => handleDelete(media.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
