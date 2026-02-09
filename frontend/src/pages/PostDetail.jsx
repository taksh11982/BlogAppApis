import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiTag, FiArrowLeft, FiEdit, FiTrash2, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getById(id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Post not found');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!isAuthenticated) {
      toast.info('Please login to comment');
      navigate('/login');
      return;
    }

    setSubmittingComment(true);
    try {
      await commentAPI.create(id, { content: commentText });
      setCommentText('');
      fetchPost(); // Refresh to get new comment
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    
    try {
      await commentAPI.delete(commentId);
      fetchPost();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postAPI.delete(id);
      toast.success('Post deleted successfully');
      navigate('/posts');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading post..." />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.user?.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        {/* Post Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
          {/* Featured Image */}
          {post.imageName && post.imageName !== 'default.png' && (
            <div className="h-64 md:h-96 bg-gradient-to-br from-primary-100 to-purple-100">
              <img
                src={postAPI.getImageUrl(post.imageName)}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-8xl text-primary-300">📝</div>';
                }}
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Category */}
            {post.category && (
              <Link
                to={`/category/${post.category.categoryId}`}
                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-200 transition-colors"
              >
                <FiTag className="mr-1" size={14} />
                {post.category.categoryTitle}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200">
              {post.user && (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {post.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.user.name}</p>
                    <p className="text-sm text-gray-500">{post.user.about}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center text-gray-500 text-sm">
                <FiCalendar className="mr-2" />
                {formatDate(post.createdDate)}
              </div>
              
              {isAuthor && (
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={() => navigate(`/edit-post/${id}`)}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mt-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg mt-8 p-6 md:p-10 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Comments ({post.comments?.length || 0})
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'G'}
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
                  disabled={!isAuthenticated}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:bg-gray-50"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment || !isAuthenticated}
                    className="btn-primary flex items-center disabled:opacity-50"
                  >
                    {submittingComment ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FiSend className="mr-2" />
                    )}
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              post.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-4 animate-slideIn">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800">{comment.user?.name || 'Anonymous'}</p>
                      {isAuthenticated && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
