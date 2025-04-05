import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaThumbsUp, 
  FaRegThumbsUp, 
  FaComment, 
  FaSearch, 
  FaFilter 
} from 'react-icons/fa';
import axios from 'axios';
import TimeAgo from '../components/TimeAgo';

const Community = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [popularTags, setPopularTags] = useState([]);
  
  // Fetch posts and popular tags on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/posts', {
          params: {
            sort: filter,
            search: searchTerm,
            tag: selectedTag
          }
        });
        setPosts(response.data);
        
        // Fetch popular tags
        const tagsResponse = await axios.get('/api/posts/tags/popular');
        setPopularTags(tagsResponse.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [filter, searchTerm, selectedTag]);
  
  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      
      // Update post in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: response.data.likes, isLiked: response.data.isLiked } 
            : post
        )
      );
    } catch (error) {
      toast.error('Failed to like post');
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect dependency
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setShowFilters(false);
  };
  
  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
  };
  
  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Community</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with others, share your progress, and get inspired
          </p>
        </div>
        
        <Link 
          to="/community/new" 
          className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
        >
          <FaPlus className="mr-2" />
          Create Post
        </Link>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search posts..."
              />
            </div>
          </form>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FaFilter className="mr-2" />
              {filter === 'latest' ? 'Latest' : filter === 'popular' ? 'Popular' : 'My Feed'}
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleFilterChange('latest')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filter === 'latest' 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Latest Posts
                </button>
                <button
                  onClick={() => handleFilterChange('popular')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filter === 'popular' 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Most Popular
                </button>
                <button
                  onClick={() => handleFilterChange('following')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filter === 'following' 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  My Feed
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Popular tags */}
        {popularTags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTag === tag
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Post list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  {/* Post header - author info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {post.author.avatar ? (
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.username} 
                          className="w-10 h-10 rounded-full mr-3" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                          <span className="text-sm font-bold">{post.author.username[0].toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {post.author.username}
                        </h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <TimeAgo date={post.createdAt} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post content */}
                  <Link to={`/community/post/${post._id}`} className="block">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                      {post.title}
                    </h2>
                    
                    {post.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-48 object-cover rounded-md" 
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                  </Link>
                  
                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTagClick(tag)}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Post actions - likes and comments */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center space-x-2 ${
                          post.isLiked 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        {post.isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                        <span>{post.likes?.length || 0}</span>
                      </button>
                      
                      <Link 
                        to={`/community/post/${post._id}`} 
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <FaComment />
                        <span>{post.comments?.length || 0}</span>
                      </Link>
                    </div>
                    
                    <Link 
                      to={`/community/post/${post._id}`} 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">No posts found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || selectedTag 
                  ? "We couldn't find any posts matching your search criteria."
                  : "There are no posts in the community yet. Be the first to share something!"}
              </p>
              {(searchTerm || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Community;