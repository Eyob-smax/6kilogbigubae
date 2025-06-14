import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Admin } from '../../types';
// Adjust the path as necessary

interface AdminFormProps {
  mode: 'add' | 'edit';
  initialData: Admin | null;
  onSave: (data: Admin) => void;
  onCancel: () => void;
}

const AdminForm = ({ mode, initialData, onSave, onCancel }: AdminFormProps) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Admin>({
    studentId: '',
    adminUsername: '',
    adminPassword: '',
    isSuperAdmin: false,
  });
  
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        ...initialData,
        adminPassword: initialData.adminPassword || '',
      });
    }
  }, [mode, initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {mode === 'add' ? 'Add Admin' : 'Edit Admin'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.admin.studentId')}
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="e.g., AAU/1234/12"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.admin.adminUsername')}
          </label>
          <input
            type="text"
            name="adminUsername"
            value={formData.adminUsername}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="e.g., john_admin"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.admin.adminPassword')}
          </label>
          <input
            type="password"
            name="adminPassword"
            value={formData.adminPassword}
            onChange={handleChange}
            required={mode === 'add'}
            className="input-field"
            placeholder={mode === 'edit' ? 'Leave blank to keep current' : 'Enter password'}
          />
          {mode === 'edit' && (
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to keep the current password.
            </p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isSuperAdmin"
            checked={formData.isSuperAdmin}
            onChange={handleChange}
            className="h-4 w-4 text-liturgical-blue focus:ring-liturgical-blue border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Super Admin (can manage other admins)
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('forms.cancel')}
          </button>
          <button 
            type="submit"
            className="btn-primary"
          >
            {t('forms.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;