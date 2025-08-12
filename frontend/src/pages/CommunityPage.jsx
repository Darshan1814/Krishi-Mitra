import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, MessageCircle, ThumbsUp, Share2, Send, User, Calendar, MapPin, Plus, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TranslatableText from '../components/TranslatableText';

const CommunityPage = () => {
  // Handle auth context safely
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (error) {
    console.warn('Auth context not available:', error.message);
  }
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for community posts
  const samplePosts = [
    {
      id: 1,
      author: {
        name: 'Rajesh Kumar',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        location: 'Pune, Maharashtra'
      },
      content: 'Has anyone tried the new organic fertilizer from Green Earth? I\'m considering it for my tomato crop.',
      images: [],
      likes: 24,
      comments: 8,
      timestamp: '2023-10-15T10:30:00Z',
      category: 'question'
    },
    {
      id: 2,
      author: {
        name: 'Priya Sharma',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        location: 'Nashik, Maharashtra'
      },
      content: 'Just harvested my first batch of organic strawberries! The KrishiMitra plant disease detection helped me identify and treat a fungal infection early.',
      images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
      likes: 56,
      comments: 12,
      timestamp: '2023-10-14T08:45:00Z',
      category: 'success'
    },
    {
      id: 3,
      author: {
        name: 'Amit Patel',
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
        location: 'Ahmedabad, Gujarat'
      },
      content: 'Weather alert: Heavy rainfall expected in Gujarat over the next 48 hours. Make sure to protect your crops!',
      images: [],
      likes: 89,
      comments: 32,
      timestamp: '2023-10-13T16:20:00Z',
      category: 'alert'
    },
    {
      id: 4,
      author: {
        name: 'Sunita Verma',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        location: 'Jaipur, Rajasthan'
      },
      content: 'I\'m hosting a workshop on water conservation techniques for desert farming next weekend. Anyone from Rajasthan interested in joining?',
      images: ['https://images.unsplash.com/photo-1589928049394-5a1c5e9b293d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
      likes: 42,
      comments: 18,
      timestamp: '2023-10-12T12:15:00Z',
      category: 'event'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    // Create new post
    const newPost = {
      id: posts.length + 1,
      author: {
        name: user?.fullName || 'Anonymous User',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        location: 'Unknown Location'
      },
      content: newPostContent,
      images: [],
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      category: 'general'
    };

    // Add to posts
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || post.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <TranslatableText>Farmer Community</TranslatableText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <TranslatableText>
              Connect with fellow farmers, share experiences, ask questions, and learn from each other
            </TranslatableText>
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all"><TranslatableText>All Posts</TranslatableText></option>
                <option value="question"><TranslatableText>Questions</TranslatableText></option>
                <option value="success"><TranslatableText>Success Stories</TranslatableText></option>
                <option value="alert"><TranslatableText>Alerts</TranslatableText></option>
                <option value="event"><TranslatableText>Events</TranslatableText></option>
                <option value="general"><TranslatableText>General</TranslatableText></option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Post */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {user ? (
            <form onSubmit={handlePostSubmit}>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-green-100 flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share something with the community..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows="3"
                  ></textarea>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <button 
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newPostContent.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      <TranslatableText>Post</TranslatableText>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">
                <TranslatableText>Please log in to post in the community</TranslatableText>
              </p>
              <Link 
                to="/login"
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium inline-block"
              >
                <TranslatableText>Login</TranslatableText>
              </Link>
            </div>
          )}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-10 h-10 text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">
              <TranslatableText>Loading community posts...</TranslatableText>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{post.author.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(post.timestamp)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{post.author.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                  </div>
                  
                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-3">
                      <img 
                        src={post.images[0]} 
                        alt="Post content" 
                        className="w-full h-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5 mr-1" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                      <MessageCircle className="w-5 h-5 mr-1" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                      <Share2 className="w-5 h-5 mr-1" />
                      <TranslatableText>Share</TranslatableText>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  <TranslatableText>No posts found</TranslatableText>
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? (
                    <TranslatableText>No posts match your search criteria</TranslatableText>
                  ) : (
                    <TranslatableText>Be the first to post in this category</TranslatableText>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;