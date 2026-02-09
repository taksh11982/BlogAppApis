import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiBookOpen, FiMessageCircle, FiEye } from 'react-icons/fi';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await postAPI.getByUser(user.id);
      const userPosts = response.data || [];
      setPosts(userPosts);
      
      // Calculate stats
      const totalComments = userPosts.reduce((acc, post) => acc + (post.comments?.length || 0), 0);
      setStats({
        totalPosts: userPosts.length,
        totalComments,
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postAPI.delete(postId);
      toast.success('Post deleted successfully');
      fetchUserPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Manage your posts and track your activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FiBookOpen className="text-primary-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Posts</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiMessageCircle className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Comments</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalComments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <Link to="/create-post" className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Ready to share?</p>
                <p className="text-xl font-bold">Create New Post</p>
              </div>
              <FiPlus size={32} className="text-white/80" />
            </Link>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Your Posts</h2>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingSpinner text="Loading your posts..." />
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your stories with the world</p>
              <Link to="/create-post" className="btn-primary inline-flex items-center">
                <FiPlus className="mr-2" />
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.postId || post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {post.imageName && post.imageName !== 'default.png' ? (
                              <img
                                src={postAPI.getImageUrl(post.imageName)}
                                alt=""
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-xl">📝</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <Link
                              to={`/post/${post.postId || post.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {post.content?.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          {post.category?.categoryTitle || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(post.createdDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {post.comments?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/post/${post.postId || post.id}`}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.postId || post.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
