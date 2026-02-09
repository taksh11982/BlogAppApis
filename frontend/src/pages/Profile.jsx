import { useState } from 'react';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    about: user?.about || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        about: formData.about,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await userAPI.update(user.id, updateData);
      updateUser(response.data);
      toast.success('Profile updated successfully');
      setEditing(false);
      setFormData({ ...formData, password: '' });
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 px-6 py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl font-bold text-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-primary-100">{user?.email}</p>
          </div>

          {/* Profile Form */}
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-600"
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-600"
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={4}
                  className="input-field disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                />
              </div>

              {editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {editing && (
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        about: user?.about || '',
                        password: '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FiSave className="mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </form>

            {/* Roles */}
            {user?.roles?.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                    >
                      {role.name?.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
