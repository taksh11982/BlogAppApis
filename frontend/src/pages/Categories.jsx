import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryTitle: '',
    categoryDescription: '',
  });

  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.roles?.some(role => role.name === 'ADMIN' || role.name === 'ROLE_ADMIN');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryTitle.trim()) {
      toast.error('Category title is required');
      return;
    }

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.categoryId, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ categoryTitle: '', categoryDescription: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryTitle: category.categoryTitle,
      categoryDescription: category.categoryDescription || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoryAPI.delete(categoryId);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ categoryTitle: '', categoryDescription: '' });
    setShowModal(true);
  };

  const categoryIcons = ['📝', '💻', '🎨', '🚀', '📚', '🎯', '💡', '🌟', '🔧', '📱'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Categories</h1>
            <p className="text-gray-600">Browse posts by topics</p>
          </div>
          {isAuthenticated && isAdmin && (
            <button onClick={openCreateModal} className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Add Category
            </button>
          )}
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No categories yet</h3>
            <p className="text-gray-600">Categories will appear here once created</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.categoryId}
                className="bg-white rounded-xl shadow-md overflow-hidden card-hover animate-fadeIn"
              >
                <Link to={`/category/${category.categoryId}`} className="block p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                      {categoryIcons[index % categoryIcons.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {category.categoryTitle}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {category.categoryDescription || 'Explore posts in this category'}
                      </p>
                    </div>
                  </div>
                </Link>
                
                {isAuthenticated && isAdmin && (
                  <div className="flex border-t">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 flex items-center justify-center transition-colors"
                    >
                      <FiEdit className="mr-1" size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="flex-1 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors border-l"
                    >
                      <FiTrash2 className="mr-1" size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Title *
                  </label>
                  <input
                    type="text"
                    value={formData.categoryTitle}
                    onChange={(e) => setFormData({ ...formData, categoryTitle: e.target.value })}
                    className="input-field"
                    placeholder="Enter category title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.categoryDescription}
                    onChange={(e) => setFormData({ ...formData, categoryDescription: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter category description"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
