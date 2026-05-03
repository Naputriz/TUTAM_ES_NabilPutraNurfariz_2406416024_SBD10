import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GunplaCard from '../components/GunplaCard';
import GunplaForm from '../components/GunplaForm';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const [gunplas, setGunplas] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGunpla, setEditingGunpla] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchGunplas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/gunpla/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGunplas(res.data);
    } catch (err) {
      console.error('Failed to fetch gunplas', err);
    }
  };

  useEffect(() => {
    fetchGunplas();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingGunpla) {
        await axios.put(`/api/gunpla/${editingGunpla.id}`, formData, config);
      } else {
        await axios.post('/api/gunpla', formData, config);
      }
      
      setIsFormOpen(false);
      setEditingGunpla(null);
      fetchGunplas();
    } catch (err) {
      console.error('Failed to save gunpla', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this kit?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/gunpla/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGunplas();
      } catch (err) {
        console.error('Failed to delete gunpla', err);
      }
    }
  };

  const openEditForm = (gunpla) => {
    setEditingGunpla(gunpla);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingGunpla(null);
    setIsFormOpen(true);
  };

  // Stats
  const backlogCount = gunplas.filter(g => g.status === 'Backlog').length;
  const inProgressCount = gunplas.filter(g => g.status === 'In Progress').length;
  const completedCount = gunplas.filter(g => g.status === 'Completed').length;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gunpla-dark uppercase tracking-tighter mb-2 flex items-center gap-3">
            <span className="w-3 h-10 bg-gunpla-secondary inline-block"></span>
            Personal Archive
          </h1>
          <p className="text-gray-600 font-medium">Welcome back, Pilot {user?.username}</p>
        </div>
        
        <button 
          onClick={openCreateForm}
          className="bg-gunpla-accent-red text-gunpla-primary px-6 py-3 font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-red-700 transition-colors shadow-[4px_4px_0px_rgba(29,78,216,1)] active:translate-y-1 active:shadow-none"
        >
          <Plus size={20} />
          Register New Kit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-200 p-4 border-l-4 border-gray-500 font-bold flex justify-between items-center">
          <span className="uppercase text-gray-700">Backlog</span>
          <span className="text-2xl text-gunpla-dark">{backlogCount}</span>
        </div>
        <div className="bg-gunpla-accent-yellow/20 p-4 border-l-4 border-gunpla-accent-yellow font-bold flex justify-between items-center">
          <span className="uppercase text-yellow-800">In Progress</span>
          <span className="text-2xl text-gunpla-dark">{inProgressCount}</span>
        </div>
        <div className="bg-green-100 p-4 border-l-4 border-green-500 font-bold flex justify-between items-center">
          <span className="uppercase text-green-800">Completed</span>
          <span className="text-2xl text-gunpla-dark">{completedCount}</span>
        </div>
      </div>

      {gunplas.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 p-12 text-center text-gray-500">
          <p className="text-xl font-bold uppercase mb-2">No Data Found</p>
          <p>Your archive is empty. Start by registering a new kit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gunplas.map(gunpla => (
            <GunplaCard 
              key={gunpla.id} 
              gunpla={gunpla} 
              isOwner={true}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <GunplaForm 
          gunpla={editingGunpla} 
          onSubmit={handleCreateOrUpdate} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
