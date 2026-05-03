import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function GunplaForm({ gunpla, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    model_name: '',
    grade: 'HG',
    series: '',
    status: 'Backlog',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (gunpla) {
      setFormData({
        model_name: gunpla.model_name || '',
        grade: gunpla.grade || 'HG',
        series: gunpla.series || '',
        status: gunpla.status || 'Backlog',
        image_url: gunpla.image_url || ''
      });
    }
  }, [gunpla]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = formData.image_url;

    if (imageFile) {
      setIsUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      try {
        const { error: uploadError, data } = await supabase.storage
          .from('gunpla-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gunpla-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload image. Make sure the bucket is public and allows uploads.');
        setIsUploading(false);
        return; // Stop submission on failure
      }
    }

    onSubmit({ ...formData, image_url: finalImageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gunpla-primary p-6 w-full max-w-lg border-4 border-gunpla-secondary shadow-[8px_8px_0px_rgba(220,38,38,1)] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-2">
          <h2 className="text-2xl font-bold text-gunpla-dark flex items-center gap-2">
            <span className="w-2 h-6 bg-gunpla-accent-yellow inline-block"></span>
            {gunpla ? 'UPDATE DATA' : 'REGISTER NEW KIT'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gunpla-accent-red transition-colors" disabled={isUploading}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gunpla-dark font-medium mb-1 uppercase text-xs tracking-wider">Model Name *</label>
            <input type="text" name="model_name" value={formData.model_name} onChange={handleChange} required className="w-full border-2 border-gray-300 p-2 focus:border-gunpla-secondary focus:outline-none" disabled={isUploading} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gunpla-dark font-medium mb-1 uppercase text-xs tracking-wider">Grade *</label>
              <select name="grade" value={formData.grade} onChange={handleChange} required className="w-full border-2 border-gray-300 p-2 focus:border-gunpla-secondary focus:outline-none" disabled={isUploading}>
                <option value="SD">SD</option>
                <option value="HG">HG</option>
                <option value="RG">RG</option>
                <option value="MG">MG</option>
                <option value="PG">PG</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gunpla-dark font-medium mb-1 uppercase text-xs tracking-wider">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required className="w-full border-2 border-gray-300 p-2 focus:border-gunpla-secondary focus:outline-none" disabled={isUploading}>
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gunpla-dark font-medium mb-1 uppercase text-xs tracking-wider">Series (e.g., UC, CE, AD)</label>
            <input type="text" name="series" value={formData.series} onChange={handleChange} className="w-full border-2 border-gray-300 p-2 focus:border-gunpla-secondary focus:outline-none" disabled={isUploading} />
          </div>

          <div className="border-2 border-dashed border-gray-300 p-4 relative hover:border-gunpla-secondary transition-colors group bg-gray-50">
            <label className="block text-gunpla-dark font-medium mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
              <UploadCloud size={16} /> Kit Image Upload
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-bold file:bg-gunpla-secondary file:text-white hover:file:bg-blue-800 file:transition-colors file:cursor-pointer cursor-pointer"
              disabled={isUploading}
            />
            {formData.image_url && !imageFile && (
              <p className="text-xs text-green-600 mt-2 font-medium">Currently has an image saved.</p>
            )}
            {imageFile && (
              <p className="text-xs text-gunpla-secondary mt-2 font-medium">Selected: {imageFile.name}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-100 uppercase transition-colors" disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-gunpla-secondary text-gunpla-primary font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-[4px_4px_0px_rgba(29,78,216,1)] active:translate-y-1 active:shadow-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUploading}>
              {isUploading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
