import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiX, FiTag } from 'react-icons/fi';
import { postAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreatePost = () => {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('CreatePost mounted, fetching categories...');
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      console.log('Categories response:', response.data);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
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
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Create post
      const postData = {
        title: formData.title,
        content: formData.content,
      };
      
      const response = await postAPI.create(user.id, formData.categoryId, postData);
      const createdPost = response.data;
      console.log('Post created:', createdPost);

      // Upload image if selected
      if (image && createdPost.postId) {
        try {
          console.log('Uploading image:', image.name, 'Size:', image.size, 'Type:', image.type);
          const imageFormData = new FormData();
          imageFormData.append('image', image);
          console.log('FormData created, sending to:', `/post/image/upload/${createdPost.postId}`);
          const imageResponse = await postAPI.uploadImage(createdPost.postId, imageFormData);
          console.log('Image uploaded:', imageResponse.data);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          console.error('Error response:', imageError.response?.data);
          toast.warning('Post created but image upload failed');
        }
      }

      toast.success('Post created successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.message || 
                          (typeof error.response?.data === 'string' ? error.response.data : 'Failed to create post');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Post</h1>
          <p className="text-gray-600 mb-8">Share your story with the world</p>

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

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  id="categorySelect"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a category --</option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryTitle}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>
              {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
              <p className="mt-1 text-xs text-gray-500">Available: {categories.length} categories</p>
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image (optional)
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
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="text-gray-400 mb-3" size={40} />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Submit Buttons */}
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
                disabled={loading}
                className="btn-primary flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
