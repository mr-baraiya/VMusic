import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Plus,
  X,
  List,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Music2,
  Loader,
  AlertCircle,
  Trash2,
  GripVertical,
  Youtube
} from 'lucide-react';

// YouTube API Configuration
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Component: SearchBar
const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music videos... (Popular music shown by default)"
          className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          disabled={isLoading}
          aria-label="Search YouTube videos"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        {isLoading && (
          <Loader className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 animate-spin" size={24} />
        )}
      </div>
    </form>
  );
};

// Component: SearchResults
const SearchResults = ({ results, onAdd, isLoading, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-400">{error}</p>
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Music2 size={48} className="text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No results yet</h3>
        <p className="text-gray-400">Search for your favorite music videos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((video, index) => (
        <motion.div
          key={video.videoId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-red-400/50 transition-all shadow-xl hover:shadow-2xl"
        >
          <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {video.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-semibold">
                {video.duration}
              </div>
            )}
          </div>
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs mb-3 truncate">{video.channelTitle}</p>
          <button
            onClick={() => onAdd(video)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-red-900/50"
            aria-label={`Add ${video.title} to playlist`}
          >
            <Plus size={16} />
            Add to Playlist
          </button>
        </motion.div>
      ))}
    </div>
  );
};

// Component: NowPlaying
const NowPlaying = ({ currentTrack }) => {
  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Youtube size={64} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No video playing</h3>
          <p className="text-gray-400">Search and add videos to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden shadow-2xl"
      >
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-black text-white mb-2 line-clamp-2"
      >
        {currentTrack.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-lg"
      >
        {currentTrack.channelTitle}
      </motion.p>
    </div>
  );
};

// Component: Player Controls
const PlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  isRepeat,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
}) => {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-red-400"
          aria-label="Seek video"
          style={{
            background: `linear-gradient(to right, rgb(239 68 68) 0%, rgb(239 68 68) ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onToggleShuffle}
          className={`p-2 rounded-full transition-colors ${
            isShuffle ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-white'
          }`}
          aria-label="Toggle shuffle"
          title="Shuffle"
        >
          <Shuffle size={20} />
        </button>

        <button
          onClick={onPrevious}
          className="p-3 text-white hover:text-red-400 transition-all hover:scale-110"
          aria-label="Previous video"
        >
          <SkipBack size={28} fill="currentColor" />
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-900/50 transition-all"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={32} className="text-white" fill="white" />
          ) : (
            <Play size={32} className="text-white ml-1" fill="white" />
          )}
        </motion.button>

        <button
          onClick={onNext}
          className="p-3 text-white hover:text-red-400 transition-all hover:scale-110"
          aria-label="Next video"
        >
          <SkipForward size={28} fill="currentColor" />
        </button>

        <button
          onClick={onToggleRepeat}
          className={`p-2 rounded-full transition-colors ${
            isRepeat ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-white'
          }`}
          aria-label="Toggle repeat"
          title="Repeat"
        >
          <Repeat size={20} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          aria-label="Volume control"
        />
        <span className="text-xs text-gray-400 w-8 text-right">{volume}</span>
      </div>
    </div>
  );
};

// Component: Playlist
const Playlist = ({ playlist, currentIndex, onPlay, onRemove, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (playlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <List size={48} className="text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Playlist is empty</h3>
        <p className="text-gray-400">Add videos from search results</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
      {playlist.map((video, index) => (
        <motion.div
          key={`${video.videoId}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`group flex items-center gap-3 p-3 rounded-xl transition-all cursor-move ${
            currentIndex === index
              ? 'bg-gradient-to-r from-red-600/30 to-red-500/30 border border-red-400/50'
              : 'bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        >
          <GripVertical size={16} className="text-gray-500 shrink-0" />
          
          <button
            onClick={() => onPlay(index)}
            className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden group-hover:ring-2 ring-red-400 transition-all"
          >
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={20} className="text-white" fill="white" />
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm line-clamp-1 ${
              currentIndex === index ? 'text-red-400' : 'text-white'
            }`}>
              {video.title}
            </h4>
            <p className="text-gray-400 text-xs truncate">{video.channelTitle}</p>
            {video.duration && (
              <p className="text-gray-500 text-xs">{video.duration}</p>
            )}
          </div>

          <button
            onClick={() => onRemove(index)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors shrink-0"
            aria-label={`Remove ${video.title}`}
          >
            <Trash2 size={18} />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

// Main VibeTube Component
const VibeTube = () => {
  // State Management
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // Load playlist from localStorage
  useEffect(() => {
    const savedPlaylist = localStorage.getItem('vibetube_playlist');
    if (savedPlaylist) {
      try {
        const parsed = JSON.parse(savedPlaylist);
        setPlaylist(parsed);
      } catch (err) {
        console.error('Failed to load playlist:', err);
      }
    }
  }, []);

  // Save playlist to localStorage
  useEffect(() => {
    if (playlist.length > 0) {
      localStorage.setItem('vibetube_playlist', JSON.stringify(playlist));
    }
  }, [playlist]);

  // Initialize YouTube Player
  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        height: '1',
        width: '1',
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            console.log('YouTube Player Ready');
            event.target.setVolume(volume);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startProgressTracking();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgressTracking();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              handleVideoEnd();
            }
          },
        },
      });
    };

    return () => {
      stopProgressTracking();
    };
  }, []);

  // Load popular music on component mount
  useEffect(() => {
    const loadPopularMusic = async () => {
      // Load popular music videos by default
      await searchVideos('popular music 2024');
    };

    loadPopularMusic();
  }, []);

  // Progress Tracking
  const startProgressTracking = () => {
    stopProgressTracking();
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
        if (playerRef.current.getDuration) {
          setDuration(playerRef.current.getDuration());
        }
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle Video End
  const handleVideoEnd = () => {
    if (isRepeat) {
      playerRef.current?.playVideo();
    } else {
      handleNext();
    }
  };

  // YouTube API Functions
  const searchVideos = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      // Search for videos
      const searchResponse = await fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=12&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to search videos. Please check your API key.');
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      // Get video IDs for duration lookup
      const videoIds = searchData.items.map((item) => item.id.videoId).join(',');

      // Fetch video details including duration
      const detailsResponse = await fetch(
        `${YOUTUBE_API_BASE}/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      const detailsData = await detailsResponse.json();

      // Parse duration and combine data
      const results = searchData.items.map((item, index) => {
        const details = detailsData.items[index];
        const duration = details ? parseDuration(details.contentDetails.duration) : null;

        return {
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          duration: duration,
        };
      });

      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse ISO 8601 duration to readable format
  const parseDuration = (isoDuration) => {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return null;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Playlist Functions
  const addToPlaylist = (video) => {
    setPlaylist((prev) => [...prev, video]);
  };

  const removeFromPlaylist = (index) => {
    setPlaylist((prev) => {
      const newPlaylist = prev.filter((_, i) => i !== index);
      if (index === currentIndex) {
        setCurrentIndex(-1);
        playerRef.current?.stopVideo();
      } else if (index < currentIndex) {
        setCurrentIndex((prev) => prev - 1);
      }
      return newPlaylist;
    });
  };

  const reorderPlaylist = (fromIndex, toIndex) => {
    setPlaylist((prev) => {
      const newPlaylist = [...prev];
      const [removed] = newPlaylist.splice(fromIndex, 1);
      newPlaylist.splice(toIndex, 0, removed);
      
      // Update current index if needed
      if (fromIndex === currentIndex) {
        setCurrentIndex(toIndex);
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        setCurrentIndex((prev) => prev - 1);
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        setCurrentIndex((prev) => prev + 1);
      }
      
      return newPlaylist;
    });
  };

  const playVideo = (index) => {
    if (index < 0 || index >= playlist.length) return;
    
    setCurrentIndex(index);
    const video = playlist[index];
    
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(video.videoId);
      playerRef.current.playVideo();
    }
  };

  // Player Controls
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      if (currentIndex === -1 && playlist.length > 0) {
        playVideo(0);
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    playVideo(nextIndex);
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
    }
    
    playVideo(prevIndex);
  };

  const handleSeek = (time) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time, true);
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const currentTrack = currentIndex >= 0 ? playlist[currentIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black pb-20">
      {/* Hidden YouTube Player */}
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0 }}>
        <div id="yt-player"></div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-900/40 via-pink-900/40 to-purple-900/40 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Youtube size={48} className="text-red-500" />
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent">
                VibeTube
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Your Personal YouTube Music Player</p>
          </motion.div>

          <SearchBar onSearch={searchVideos} isLoading={isLoading} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Search Results */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Search className="text-red-400" />
                Search Results
              </h2>
              <SearchResults
                results={searchResults}
                onAdd={addToPlaylist}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Right: Player & Playlist */}
          <div className="lg:col-span-1 space-y-6">
            {/* Now Playing */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Music2 className="text-red-400" />
                Now Playing
              </h2>
              <NowPlaying currentTrack={currentTrack} />
              <div className="mt-6">
                <PlayerControls
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  isMuted={isMuted}
                  onPlayPause={handlePlayPause}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSeek={handleSeek}
                  onVolumeChange={handleVolumeChange}
                  onToggleMute={handleToggleMute}
                  isRepeat={isRepeat}
                  isShuffle={isShuffle}
                  onToggleRepeat={() => setIsRepeat(!isRepeat)}
                  onToggleShuffle={() => setIsShuffle(!isShuffle)}
                />
              </div>
            </div>

            {/* Playlist */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <List className="text-red-400" />
                  Playlist ({playlist.length})
                </h2>
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="lg:hidden p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                >
                  {showPlaylist ? <X size={20} /> : <List size={20} />}
                </button>
              </div>
              <div className={`${showPlaylist ? 'block' : 'hidden'} lg:block`}>
                <Playlist
                  playlist={playlist}
                  currentIndex={currentIndex}
                  onPlay={playVideo}
                  onRemove={removeFromPlaylist}
                  onReorder={reorderPlaylist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.7);
        }
      `}</style>
    </div>
  );
};

export default VibeTube;
