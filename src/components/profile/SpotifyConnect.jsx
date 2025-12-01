import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music2, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { spotifyAPI } from '../../api/spotify';
import { musicAPI } from '../../api/music';

const SpotifyConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already connected to Spotify
    const connected = spotifyAPI.isUserAuthenticated();
    setIsConnected(connected);

    if (connected) {
      musicAPI.enableSpotify();
    }
  }, []);

  const handleConnect = () => {
    setLoading(true);
    const authUrl = spotifyAPI.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    spotifyAPI.logout();
    musicAPI.disableSpotify();
    setIsConnected(false);
    localStorage.removeItem('spotify_connected');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border-2 border-green-200 dark:border-green-900/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
            <Music2 className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Spotify Integration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected
                ? 'Your Spotify account is connected'
                : 'Connect your Spotify account for enhanced features'}
            </p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              Connected
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          Enhanced Features with Spotify
        </h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Millions of Tracks:</strong> Access Spotify's massive music library with
              30-second previews
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Your Library:</strong> See your saved tracks, playlists, and top songs (when
              logged in)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Personalized Recommendations:</strong> Get AI-powered music suggestions based
              on your taste
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Guest Mode:</strong> Browse and preview without logging in to Spotify
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Combined Experience:</strong> Switch between Jamendo (full tracks) and Spotify
              seamlessly
            </span>
          </li>
        </ul>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>ℹ️ Note:</strong> Spotify provides 30-second previews for most tracks. Full
          playback requires Spotify Premium. You'll still have full access to 500,000+ complete
          tracks from Jamendo.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {!isConnected ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={loading}
            className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Music2 size={20} />
                </motion.div>
                Connecting...
              </>
            ) : (
              <>
                <Music2 size={20} />
                Connect Spotify Account
                <ExternalLink size={16} />
              </>
            )}
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDisconnect}
              className="flex-1 min-w-[200px] px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
            >
              Disconnect Spotify
            </motion.button>
            <motion.a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 min-w-[200px] px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Open Spotify
              <ExternalLink size={16} />
            </motion.a>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SpotifyConnect;
