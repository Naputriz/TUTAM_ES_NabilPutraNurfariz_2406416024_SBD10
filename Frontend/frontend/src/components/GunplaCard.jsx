import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function GunplaCard({ gunpla, isOwner, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Backlog': return 'bg-gray-200 text-gray-800 border-gray-400';
      case 'In Progress': return 'bg-gunpla-accent-yellow/20 text-yellow-800 border-gunpla-accent-yellow';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getGradeBadgeColor = (grade) => {
    switch(grade) {
      case 'HG': return 'bg-blue-100 text-blue-800';
      case 'RG': return 'bg-red-100 text-red-800';
      case 'MG': return 'bg-yellow-100 text-yellow-800';
      case 'PG': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gunpla-primary border-2 border-gunpla-secondary shadow-[6px_6px_0px_rgba(29,78,216,1)] rounded-sm overflow-hidden flex flex-col hover:translate-y-[-2px] transition-transform">
      <div className="relative h-64 bg-gray-100 border-b-2 border-gunpla-secondary flex items-center justify-center p-2">
        {gunpla.image_url ? (
          <img src={gunpla.image_url} alt={gunpla.model_name} className="w-full h-full object-contain" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold uppercase tracking-widest">
            No Image Data
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-sm border ${getGradeBadgeColor(gunpla.grade)}`}>
          {gunpla.grade}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-xl text-gunpla-dark mb-1">{gunpla.model_name}</h3>
        <p className="text-sm text-gray-600 font-medium mb-3">Series: {gunpla.series || 'Unknown'}</p>
        
        {gunpla.username && (
          <p className="text-sm text-gunpla-secondary font-bold mb-3 border-l-2 border-gunpla-secondary pl-2">
            Builder: {gunpla.username}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-bold uppercase border ${getStatusColor(gunpla.status)}`}>
            {gunpla.status}
          </span>
          
          {isOwner && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(gunpla)} className="p-1.5 text-gunpla-secondary hover:bg-blue-100 rounded-sm transition-colors" title="Edit">
                <Pencil size={18} />
              </button>
              <button onClick={() => onDelete(gunpla.id)} className="p-1.5 text-gunpla-accent-red hover:bg-red-100 rounded-sm transition-colors" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
