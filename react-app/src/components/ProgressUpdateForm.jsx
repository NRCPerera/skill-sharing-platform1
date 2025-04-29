import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createProgressUpdate } from '../services/progressUpdateService';

function ProgressUpdateForm({ onUpdateAdded }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Update content cannot be empty');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const update = {
        content: content.trim()
      };
      
      const newUpdate = await createProgressUpdate(currentUser.email, update);
      setContent('');
      onUpdateAdded(newUpdate);
    } catch (err) {
      setError('Failed to post update. Please try again.');
      console.error('Error creating update:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Share Your Progress</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="What did you learn or accomplish today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProgressUpdateForm;