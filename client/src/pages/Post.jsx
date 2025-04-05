import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaThumbsUp, 
  FaRegThumbsUp, 
  FaComment, 
  FaTrash, 
  FaEdit, 
  FaUserCircle 
} from 'react-icons/fa';
import axios from 'axios';
import TimeAgo from '../components/TimeAgo';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        navigate('/community');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]);
  
  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${post._id}/like`);
      setPost(prevPost => ({
        ...prevPost,
        likes: response.data.likes,
        isLiked: response.data.isLiked
      }));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`/api/posts/${post._id}/comments`, {
        content: comment
      });
      
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data]
      }));
      
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/posts/${post._id}/comments/${commentId}`);
      
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.filter(c => c._id !== commentId)
      }));
      
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };
  
  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/posts/${post._id}`);
      toast.success('Post deleted successfully');
      navigate('/community');
    } catch (error) {
      toast.error('Failed to delete post');
      setShowDeleteModal(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Post not found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">This post may have been deleted or doesn't exist</p>
        <Link 
          to="/community" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" />
          Back to Community
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Back navigation */}
      <div className="mb-6">
        <Link 
          to="/community" 
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FaArrowLeft className="mr-1" /> 
          Back to Community
        </Link>
      </div>
      
      {/* Post content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
        {/* Post header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {post.author.avatar ? (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.username} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                  <FaUserCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{post.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{post.author.username}</span>
                  <span className="mx-2">•</span>
                  <TimeAgo date={post.createdAt} />
                </div>
              </div>
            </div>
            
            {/* Post actions (edit/delete) */}
            {post.author._id === user?._id && (
              <div className="flex space-x-2">
                <Link 
                  to={`/community/post/${post._id}/edit`}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                  title="Edit post"
                >
                  <FaEdit />
                </Link>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                  title="Delete post"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Post body */}
        <div className="p-6">
          {post.imageUrl && (
            <div className="mb-6">
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="max-w-full h-auto rounded-lg mx-auto" 
              />
            </div>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
          </div>
          
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Post stats (likes, comments) */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 ${
                  post.isLiked 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {post.isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                <span>{post.likes?.length || 0}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <FaComment />
                <span>{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          Comments ({post.comments?.length || 0})
        </h3>
        
        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
        
        {/* Comments list */}
        <div className="space-y-6">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div 
                key={comment._id} 
                className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between">
                  <div className="flex items-start space-x-3">
                    {comment.author.avatar ? (
                      <img 
                        src={comment.author.avatar} 
                        alt={comment.author.username} 
                        className="w-8 h-8 rounded-full" 
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <span className="text-xs font-bold">{comment.author.username[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 dark:text-white mr-2">
                          {comment.author.username}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          <TimeAgo date={comment.createdAt} />
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  
                  {/* Comment actions */}
                  {(comment.author._id === user?._id || post.author._id === user?._id) && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      title="Delete comment"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
      
      {/* Delete post confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Delete Post</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone and all comments will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;