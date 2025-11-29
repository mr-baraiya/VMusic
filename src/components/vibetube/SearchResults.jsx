import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Music2,
  Sparkles,
  Grid,
  ListMusic,
  Play,
  Youtube,
  Zap,
  Heart,
  X,
  FolderPlus,
  ListPlus
} from 'lucide-react';

const SearchResults = ({ results, onAdd, onPlayNow, onAddToFavorites, playlists, isLoading, error }) => {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">YouTube API Error</h3>
        <p className="text-gray-400 mb-4 max-w-md">{error}</p>
        
        <div className="mt-4 p-6 bg-red-500/10 border border-red-500/30 rounded-xl max-w-3xl text-left">
          <p className="text-sm text-gray-300 mb-3">
            <strong className="text-white text-base">💡 Common Causes & Solutions:</strong>
          </p>
          
          {error.includes('restrictions') ? (
            <div className="space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 font-semibold mb-2">🔧 Most Likely Issue: API Key Restrictions</p>
                <p className="text-sm text-gray-300 mb-3">
                  Your YouTube API key has restrictions that prevent it from working on localhost. Here's how to fix it:
                </p>
                <ol className="text-sm text-gray-300 space-y-2 ml-4 list-decimal">
                  <li>Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline font-semibold">Google Cloud Console → API Credentials</a></li>
                  <li>Click on your API key (starts with: <code className="bg-black/40 px-2 py-0.5 rounded text-cyan-300 font-mono text-xs">AIza...</code>)</li>
                  <li>Under <strong className="text-white">"Application restrictions"</strong>: Select <span className="text-green-400 font-semibold">"None"</span></li>
                  <li>Under <strong className="text-white">"API restrictions"</strong>: Select <span className="text-green-400 font-semibold">"Don't restrict key"</span> (for development)</li>
                  <li>Click <strong className="text-white">"Save"</strong></li>
                  <li>Wait 1-2 minutes for changes to propagate</li>
                  <li>Refresh this page (F5)</li>
                </ol>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 font-semibold mb-2">🔐 For Production:</p>
                <p className="text-sm text-gray-300">
                  Once deployed, you can restrict the API key to your domain (e.g., <code className="bg-black/40 px-2 py-0.5 rounded text-blue-300 font-mono text-xs">yourdomain.com/*</code>) for security.
                </p>
              </div>
            </div>
          ) : error.includes('quota exceeded') ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                Your YouTube API key has reached its daily quota limit. You can either wait until tomorrow or create a new API key:
              </p>
              <ol className="text-sm text-gray-300 space-y-2 ml-4 list-decimal">
                <li>Visit <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline font-semibold">Google Cloud Console</a></li>
                <li>Create a new project (or select existing)</li>
                <li>Enable <strong className="text-white">"YouTube Data API v3"</strong></li>
                <li>Go to Credentials → Create Credentials → API Key</li>
                <li>Copy the new API key</li>
                <li>Update your <code className="bg-black/40 px-2 py-0.5 rounded text-red-300 font-mono text-xs">.env</code> file: <code className="bg-black/40 px-2 py-0.5 rounded text-green-300 font-mono text-xs">VITE_YOUTUBE_API_KEY=your_new_key</code></li>
                <li>Restart your dev server: <code className="bg-black/40 px-2 py-0.5 rounded text-cyan-300 font-mono text-xs">npm run dev</code></li>
              </ol>
            </div>
          ) : error.includes('API key') || error.includes('API Error') ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-300 mb-2">
                There's an issue with your YouTube API key configuration. Common causes:
              </p>
              <ul className="text-sm text-gray-300 space-y-2 ml-4 list-disc">
                <li><strong className="text-white">API Key Restrictions:</strong> Your key might have HTTP referrer or IP restrictions. For local development, remove all restrictions.</li>
                <li><strong className="text-white">API Not Enabled:</strong> Make sure "YouTube Data API v3" is enabled in your Google Cloud project.</li>
                <li><strong className="text-white">Invalid Key:</strong> The API key might be incorrect. Double-check it in your <code className="bg-black/40 px-1.5 py-0.5 rounded text-red-300 font-mono text-xs">.env</code> file.</li>
              </ul>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-3">
                <p className="text-sm text-yellow-300">
                  <strong>🔧 Quick Fix:</strong> Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline font-semibold">API Credentials</a> → Select your API key → Remove all "Application restrictions" and "API restrictions" → Save
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300">
              Please check your YouTube API configuration in the <code className="bg-black/40 px-2 py-0.5 rounded text-red-300 font-mono">.env</code> file and ensure it's valid.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
            <div className="aspect-video bg-white/10 rounded-lg mb-3"></div>
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Music2 size={64} className="text-red-400 mb-4 mx-auto" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Discover Amazing Music</h3>
        <p className="text-gray-400 text-lg">Search for your favorite artists, songs, or genres</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-red-400" size={20} />
          <span className="text-white font-semibold">{results.length} Videos Found</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <ListMusic size={18} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((video, index) => (
            <motion.div
              key={video.videoId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, type: "spring" }}
              className="group bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl overflow-visible border border-white/20 hover:border-red-400/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-red-900/30 hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden cursor-pointer rounded-t-2xl" onClick={() => onPlayNow(video)}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <Play size={28} className="text-white ml-1" fill="white" />
                  </motion.div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white font-bold border border-white/20">
                    {video.duration}
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 bg-red-600/90 backdrop-blur-sm rounded-lg text-xs text-white font-bold">
                  HD
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-red-400 transition-colors leading-tight">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-xs mb-3 truncate flex items-center gap-1">
                  <Youtube size={12} className="text-red-500" />
                  {video.channelTitle}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onPlayNow(video)}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-110"
                    title="Play Now"
                  >
                    <Zap size={20} fill="white" />
                  </button>
                  
                  <button
                    onClick={() => onAddToFavorites(video)}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-pink-500/30 rounded-xl text-white transition-all hover:scale-110"
                    title="Add to Favorites"
                  >
                    <Heart size={20} className="text-pink-400" />
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowPlaylistMenu(showPlaylistMenu === video.videoId ? null : video.videoId)}
                      className={`flex items-center justify-center w-12 h-12 rounded-xl text-white transition-all hover:scale-110 ${
                        showPlaylistMenu === video.videoId 
                          ? 'bg-red-500/30 border-2 border-red-400' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title="Add to Playlist"
                    >
                      <ListPlus 
                        size={20} 
                        className={showPlaylistMenu === video.videoId ? 'text-red-400' : ''}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {showPlaylistMenu === video.videoId && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                          onClick={() => setShowPlaylistMenu(null)}
                        >
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-80 bg-gray-900 backdrop-blur-xl border-2 border-white/30 rounded-2xl shadow-2xl overflow-hidden"
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold text-lg">Add to Playlist</h3>
                                <button
                                  onClick={() => setShowPlaylistMenu(null)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                              <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {playlists.map((playlist) => (
                                  <button
                                    key={playlist.id}
                                    onClick={() => {
                                      onAdd(video, playlist.id);
                                      setShowPlaylistMenu(null);
                                    }}
                                    className="w-full px-4 py-3 text-left text-white hover:bg-red-600/70 bg-white/5 rounded-xl transition-colors text-sm font-medium flex items-center gap-3 group"
                                  >
                                    <FolderPlus size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="flex-1">{playlist.name}</span>
                                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                                      {playlist.tracks?.length || 0}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {results.map((video, index) => (
            <motion.div
              key={video.videoId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group flex items-center gap-4 p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-red-400/60 transition-all shadow-lg hover:shadow-red-900/20"
            >
              <div className="relative w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer" onClick={() => onPlayNow(video)}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play size={20} className="text-white" fill="white" />
                </div>
                {video.duration && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/90 rounded text-xs text-white font-bold">
                    {video.duration}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Youtube size={12} className="text-red-500" />
                  {video.channelTitle}
                </p>
              </div>
              
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onPlayNow(video)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-110"
                  title="Play Now"
                >
                  <Zap size={18} fill="white" />
                </button>
                
                <button
                  onClick={() => onAddToFavorites(video)}
                  className="p-3 bg-white/10 hover:bg-pink-500/30 rounded-xl text-white transition-all hover:scale-110"
                  title="Add to Favorites"
                >
                  <Heart size={18} className="text-pink-400" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowPlaylistMenu(showPlaylistMenu === video.videoId ? null : video.videoId)}
                    className={`p-3 rounded-xl text-white transition-all hover:scale-110 ${
                      showPlaylistMenu === video.videoId 
                        ? 'bg-red-500/30 border-2 border-red-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title="Add to Playlist"
                  >
                    <ListPlus 
                      size={18} 
                      className={showPlaylistMenu === video.videoId ? 'text-red-400' : ''}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {showPlaylistMenu === video.videoId && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPlaylistMenu(null)}
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.8 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-80 bg-gray-900 backdrop-blur-xl border-2 border-white/30 rounded-2xl shadow-2xl overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-white font-bold text-lg">Add to Playlist</h3>
                              <button
                                onClick={() => setShowPlaylistMenu(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <X size={20} />
                              </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                              {playlists.map((playlist) => (
                                <button
                                  key={playlist.id}
                                  onClick={() => {
                                    onAdd(video, playlist.id);
                                    setShowPlaylistMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-white hover:bg-red-600/70 bg-white/5 rounded-xl transition-colors text-sm font-medium flex items-center gap-3 group"
                                >
                                  <FolderPlus size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
                                  <span className="flex-1">{playlist.name}</span>
                                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                                    {playlist.tracks?.length || 0}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
