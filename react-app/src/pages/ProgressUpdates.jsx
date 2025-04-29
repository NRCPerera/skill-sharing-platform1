// src/pages/ProgressUpdate.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProgressUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [content, setContent] = useState('');
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/progress-updates');
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching progress updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !skill.trim()) return;

    try {
      const response = await axios.post('/api/progress-updates', {
        content,
        skill
      });
      setUpdates([response.data, ...updates]);
      setContent('');
      setSkill('');
    } catch (error) {
      console.error('Error creating progress update:', error);
    }
  };

  const handleDelete = async (updateId) => {
    try {
      await axios.delete(`/api/progress-updates/${updateId}`);
      setUpdates(updates.filter(update => update.id !== updateId));
    } catch (error) {
      console.error('Error deleting progress update:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Progress Updates</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Share Your Progress</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
              Skill
            </label>
            <input
              type="text"
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="What skill are you working on?"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Progress Update
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your progress..."
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post Update
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading updates...</p>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-8 bg-white shadow rounded-lg">
            <p className="text-gray-600">No progress updates yet.</p>
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <img
                    src={update.user?.profileImage || "https://via.placeholder.com/40"}
                    alt={update.user?.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{update.user?.name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(update.createdAt)}</p>
                  </div>
                </div>
                {update.user?.id === user?.id && (
                  <button
                    onClick={() => handleDelete(update.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="mt-4">
                <div className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mb-2">
                  {update.skill}
                </div>
                <p className="text-gray-700 mt-1">{update.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressUpdates;