import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAPI } from '../api/spotify';
import { musicAPI } from '../api/music';
import { motion } from 'framer-motion';
import { Music2, CheckCircle, XCircle } from 'lucide-react';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Connecting to Spotify...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authorization denied. You can still use VMusic with Jamendo tracks.');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received.');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Exchange code for access token
        setMessage('Authenticating with Spotify...');
        await spotifyAPI.getAccessTokenFromCode(code);

        // Enable Spotify in music API
        musicAPI.enableSpotify();

        setStatus('success');
        setMessage('Successfully connected to Spotify! Redirecting to dashboard...');

        // Store Spotify connection status
        localStorage.setItem('spotify_connected', 'true');

        // Redirect to dashboard
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        console.error('Spotify callback error:', error);
        setStatus('error');
        setMessage('Failed to connect to Spotify. Please try again later.');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="p-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
            >
              <Music2 className="text-white" size={48} />
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"
            >
              <CheckCircle className="text-white" size={48} />
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="p-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full"
            >
              <XCircle className="text-white" size={48} />
            </motion.div>
          )}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {status === 'loading' && 'Connecting to Spotify'}
          {status === 'success' && 'Connection Successful!'}
          {status === 'error' && 'Connection Failed'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

        {/* Loading Dots */}
        {status === 'loading' && (
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-purple-500 rounded-full"
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {status === 'error' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default SpotifyCallback;
