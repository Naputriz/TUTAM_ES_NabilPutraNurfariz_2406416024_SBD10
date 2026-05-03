import React, { useState, useEffect } from 'react';
import axios from '../api';
import GunplaCard from '../components/GunplaCard';
import { Globe } from 'lucide-react';

export default function GlobalFeed() {
  const [gunplas, setGunplas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalGunplas = async () => {
      try {
        const res = await axios.get('/api/gunpla');
        setGunplas(res.data);
      } catch (err) {
        console.error('Failed to fetch global feed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalGunplas();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gunpla-dark uppercase tracking-tighter mb-2 flex items-center gap-3">
          <span className="w-3 h-10 bg-gunpla-accent-yellow inline-block"></span>
          Global Feed
        </h1>
        <p className="text-gray-600 font-medium flex items-center gap-2">
          <Globe size={18} className="text-gunpla-secondary" />
          View collections from pilots all over the world
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-12 h-12 border-4 border-gunpla-secondary border-t-gunpla-accent-red rounded-full"></div>
        </div>
      ) : gunplas.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 p-12 text-center text-gray-500">
          <p className="text-xl font-bold uppercase mb-2">No Data Found</p>
          <p>The global network is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gunplas.map(gunpla => (
            <GunplaCard 
              key={gunpla.id} 
              gunpla={gunpla} 
              isOwner={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
