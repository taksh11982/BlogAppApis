import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiEdit, FiUsers, FiBookOpen, FiTrendingUp } from 'react-icons/fi';
import { postAPI, categoryAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        postAPI.getAll(0, 6),
        categoryAPI.getAll(),
      ]);
      setPosts(postsRes.data.content || postsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <FiBookOpen size={28} />, value: '500+', label: 'Articles' },
    { icon: <FiUsers size={28} />, value: '1000+', label: 'Writers' },
    { icon: <FiTrendingUp size={28} />, value: '50K+', label: 'Readers' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Share Your Stories With The World
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Join our community of writers and readers. Create beautiful blog posts, 
                connect with others, and let your voice be heard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all shadow-lg"
                >
                  Get Started Free
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/posts"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                >
                  Explore Posts
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-purple-500/30 rounded-2xl transform rotate-6"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <FiEdit className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Write & Publish</h3>
                        <p className="text-sm text-primary-200">Share your thoughts</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <FiUsers className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Connect</h3>
                        <p className="text-sm text-primary-200">Engage with readers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                        <FiTrendingUp className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Grow</h3>
                        <p className="text-sm text-primary-200">Build your audience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-xl mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover content organized by topics that interest you
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.categoryId}
                  to={`/category/${category.categoryId}`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all card-hover text-center"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📁</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {category.categoryTitle}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {category.categoryDescription || 'Explore posts'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Latest Posts
              </h2>
              <p className="text-gray-600">Fresh content from our community</p>
            </div>
            <Link
              to="/posts"
              className="hidden sm:inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
            >
              View All
              <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading posts..." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post, index) => (
                <PostCard key={post.id || post.postId || index} post={post} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/posts" className="btn-primary inline-flex items-center">
              View All Posts
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Writing?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Join thousands of writers who share their stories on BlogApp
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all shadow-lg"
          >
            Create Your Account
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
