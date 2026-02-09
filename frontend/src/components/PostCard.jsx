import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiTag, FiMessageCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { postAPI } from '../services/api';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden card-hover animate-fadeIn">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-purple-100">
        {post.imageName && post.imageName !== 'default.png' ? (
          <img
            src={postAPI.getImageUrl(post.imageName)}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl text-primary-300">📝</div>
          </div>
        )}
        {post.category && (
          <span className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {post.category.categoryTitle}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <Link to={`/post/${post.id || post.postId}`}>
          <h2 className="text-xl font-bold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-3">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.content?.substring(0, 150)}...
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {post.user && (
              <div className="flex items-center space-x-1">
                <FiUser className="text-primary-500" />
                <span>{post.user.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <FiCalendar className="text-primary-500" />
              <span>{formatDate(post.createdDate)}</span>
            </div>
          </div>
          
          {post.comments && (
            <div className="flex items-center space-x-1">
              <FiMessageCircle className="text-primary-500" />
              <span>{post.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
