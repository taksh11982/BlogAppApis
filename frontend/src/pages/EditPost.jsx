import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiImage, FiX } from 'react-icons/fi';
import { postAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [postResponse, categoriesResponse] = await Promise.all([
        postAPI.getById(id),
        categoryAPI.getAll()
      ]);
      
      const post = postResponse.data;
      
      // Check if current user is the author
      if (post.user?.id !== user?.id) {
        toast.error('You can only edit your own posts');
        navigate('/posts');
        return;
      }
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        categoryId: post.category?.categoryId || '',
      });
      
      if (post.imageName && post.imageName !== 'default.png') {
        setCurrentImage(post.imageName);
      }
      
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setCurrentImage(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      // Update post
      const postData = {
        title: formData.title,
        content: formData.content,
      };
      
      await postAPI.update(id, postData);

      // Upload new image if selected
      if (image) {
        try {
          const imageFormData = new FormData();
          imageFormData.append('image', image);
          await postAPI.uploadImage(id, imageFormData);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          toast.warning('Post updated but image upload failed');
        }
      }

      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading post..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Post</h1>
          <p className="text-gray-600 mb-8">Update your post</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field text-xl font-semibold ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter an engaging title..."
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Category - Display only, can't change */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                disabled
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              >
                <option value="">-- Select a category --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryTitle}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Category cannot be changed after creation</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className={`input-field resize-none ${errors.content ? 'border-red-500' : ''}`}
                placeholder="Write your post content here..."
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              <p className="mt-1 text-sm text-gray-500 text-right">
                {formData.content.length} characters
              </p>
            </div>

            {/* Current Image */}
            {currentImage && !imagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <div className="relative rounded-lg overflow-hidden inline-block">
                  <img
                    src={postAPI.getImageUrl(currentImage)}
                    alt="Current"
                    className="h-40 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentImage ? 'Replace Image (optional)' : 'Add Image (optional)'}
              </label>
              
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <FiImage className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-gray-500">Click to upload new image</span>
                  <span className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
