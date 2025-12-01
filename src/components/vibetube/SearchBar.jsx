import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader, Filter, Clock, Youtube } from 'lucide-react';

const SearchBar = ({
  onSearch,
  isLoading,
  onShowHistory,
  showHistoryButton = false,
  onShowYouTubePlaylists,
  showYouTubeButton = false,
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const quickFilters = [
    { label: '🔥 Trending', value: 'trending music 2024' },
    { label: '🎵 Top Hits', value: 'top music hits' },
    { label: '💖 Romantic', value: 'romantic songs' },
    { label: '🎸 Rock', value: 'rock music' },
    { label: '🎹 Piano', value: 'piano instrumental' },
    { label: '🎧 Electronic', value: 'electronic music' },
    { label: '🎤 Pop', value: 'pop music hits' },
    { label: '🌙 Lo-Fi', value: 'lofi hip hop' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search millions of music videos..."
            className="w-full px-6 py-5 pl-14 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl border-2 border-white/20 hover:border-red-400/50 rounded-3xl text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-all shadow-2xl"
            disabled={isLoading}
            aria-label="Search YouTube videos"
          />
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 group-hover:scale-110 transition-transform"
            size={24}
          />
          {isLoading && (
            <Loader
              className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400 animate-spin"
              size={24}
            />
          )}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {showYouTubeButton && (
              <button
                type="button"
                onClick={onShowYouTubePlaylists}
                className="p-2 text-red-500 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg"
                title="My YouTube Playlists"
              >
                <Youtube size={20} />
              </button>
            )}
            {showHistoryButton && (
              <button
                type="button"
                onClick={onShowHistory}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors hover:bg-white/5 rounded-lg"
                title="Search History"
              >
                <Clock size={20} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
              title="Quick Filters"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </form>

      {/* Quick Filter Chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {quickFilters.map((filter, index) => (
              <motion.button
                key={filter.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setQuery(filter.value);
                  onSearch(filter.value);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 border border-red-400/30 rounded-full text-white text-sm font-medium backdrop-blur-xl transition-all hover:scale-105 shadow-lg"
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
