import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Trash2, X } from 'lucide-react';
import { searchHistoryAPI } from '../../api/users';

const SearchHistory = ({ userId, onSelectQuery, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await searchHistoryAPI.getSearchHistory(userId, 20);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Clear all search history?')) return;

    try {
      await searchHistoryAPI.clearHistory(userId);
      setHistory([]);

      // Show toast
      const toast = document.createElement('div');
      toast.className =
        'fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl';
      toast.textContent = 'Search history cleared';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch (error) {
      console.error('Failed to clear history:', error);
      alert('Failed to clear search history');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-red-900/40 to-pink-900/40 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="text-red-400" size={28} />
                <h2 className="text-2xl font-black text-white">Search History</h2>
              </div>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/20 rounded-xl transition-all"
                    title="Clear All"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search size={64} className="text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No search history</h3>
                <p className="text-gray-400">Your searches will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <motion.button
                    key={item._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => {
                      onSelectQuery(item.originalQuery || item.query);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group border border-white/10 hover:border-red-400/50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Search size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-white font-semibold truncate">
                          {item.originalQuery || item.query}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {item.resultsCount || 0} results • {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Search size={20} />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchHistory;
