import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import { Edit, Check, User } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userResponse = await api.get(`/api/users/${userId}`);
      setUser(userResponse.data);
      setBio(userResponse.data.bio || '');
      
      const postsResponse = await api.get(`/api/users/${userId}/posts`);
      setPosts(postsResponse.data);

      console.log('fetched posts:', postsResponse.data);
      
      if (currentUser && currentUser.id !== parseInt(userId)) {
        checkFollowStatus();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await api.get(`/api/users/${currentUser.id}/following/${userId}`);
      setIsFollowing(response.data);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/api/users/${currentUser.id}/follow/${userId}`);
      } else {
        await api.post(`/api/users/${currentUser.id}/follow/${userId}`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error following/unfollowing:', err);
      alert('Failed to update follow status');
    }
  };

  const handleUpdateBio = async () => {
    try {
      await api.patch(`/api/users/${userId}`, { bio });
      setUser({ ...user, bio });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating bio:', err);
      alert('Failed to update bio');
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostLiked = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const isCurrentUser = currentUser?.id === parseInt(userId);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchProfile}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={32} className="text-primary-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
            
            <div className="flex gap-4 mt-2">
              <div>
                <span className="font-medium">{user?.followers?.length || 0}</span>{' '}
                <span className="text-gray-600">Followers</span>
              </div>
              <div>
                <span className="font-medium">{user?.following?.length || 0}</span>{' '}
                <span className="text-gray-600">Following</span>
              </div>
            </div>
          </div>
          
          {!isCurrentUser && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded ${
                isFollowing 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-gray-900">Bio</h2>
            {isCurrentUser && (
              <button
                onClick={() => isEditing ? handleUpdateBio() : setIsEditing(true)}
                className="text-primary-600 hover:text-primary-700"
              >
                {isEditing ? <Check size={18} /> : <Edit size={18} />}
              </button>
            )}
          </div>
          
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Write something about yourself..."
            />
          ) : (
            <p className="mt-2 text-gray-700">
              {user?.bio || (isCurrentUser ? 'Click the edit button to add a bio' : 'No bio yet')}
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Posts</h2>
        
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No posts yet</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUser={currentUser} 
              onDelete={handlePostDeleted}
              onLike={handlePostLiked}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;