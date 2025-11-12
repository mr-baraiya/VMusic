import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Music2, TrendingUp, Calendar, Filter, MapPin, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jamendoAPI from '../api/jamendo';

const Artists = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity_total');
  const [hasImage, setHasImage] = useState(false);
  const [limit, setLimit] = useState(50);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  // Popular countries for quick selection
  const popularCountries = [
    { code: 'USA', name: 'United States', flag: '🇺🇸' },
    { code: 'GBR', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'FRA', name: 'France', flag: '🇫🇷' },
    { code: 'DEU', name: 'Germany', flag: '🇩🇪' },
    { code: 'ITA', name: 'Italy', flag: '🇮🇹' },
    { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
    { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
    { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
    { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
    { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
    { code: 'KOR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'IND', name: 'India', flag: '🇮🇳' },
  ];

  const sortOptions = [
    { value: 'popularity_total', label: 'Most Popular' },
    { value: 'popularity_month', label: 'Popular This Month' },
    { value: 'popularity_week', label: 'Popular This Week' },
    { value: 'joindate_desc', label: 'Newest First' },
    { value: 'joindate_asc', label: 'Oldest First' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
  ];

  useEffect(() => {
    fetchArtists();
  }, [sortBy, hasImage, selectedCountry, selectedCity]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedCountry || selectedCity) {
        data = await jamendoAPI.getArtistsByLocationWithAlbums({
          country: selectedCountry,
          city: selectedCity,
          limit,
          order: sortBy,
        });
      } else {
        data = await jamendoAPI.getArtistsWithAlbums({
          limit,
          order: sortBy,
          hasImage: hasImage || undefined,
        });
      }
      setArtists(data.results || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchArtists();
      return;
    }

    setLoading(true);
    try {
      const data = await jamendoAPI.searchArtistsWithAlbums({
        query: searchQuery,
        limit,
        order: sortBy,
      });
      setArtists(data.results || []);
    } catch (error) {
      console.error('Error searching artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchArtists();
  };

  const clearLocation = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setShowLocationFilter(false);
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedCity('');
  };

  const loadMore = () => {
    setLimit(prev => prev + 50);
  };

  useEffect(() => {
    if (limit > 50) {
      fetchArtists();
    }
  }, [limit]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Discover Artists
                </h1>
                <p className="text-gray-300 text-lg">
                  Explore talented musicians from around the world
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artists by name..."
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>

              {/* Sort Dropdown */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setHasImage(!hasImage)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    hasImage
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  title="Show only artists with images"
                >
                  <Filter size={20} />
                  With Image
                </button>

                {/* Location Filter Toggle */}
                <button
                  onClick={() => setShowLocationFilter(!showLocationFilter)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    showLocationFilter || selectedCountry
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  title="Filter by location"
                >
                  <MapPin size={20} />
                  By Location
                </button>
              </div>
            </div>

            {/* Active Location Filter */}
            {(selectedCountry || selectedCity) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-white"
              >
                <MapPin size={16} className="text-green-400" />
                <span>Filtering by:</span>
                {selectedCountry && (
                  <span className="px-3 py-1 bg-green-600/20 border border-green-500/50 rounded-lg text-sm">
                    {popularCountries.find(c => c.code === selectedCountry)?.flag}{' '}
                    {popularCountries.find(c => c.code === selectedCountry)?.name || selectedCountry}
                  </span>
                )}
                {selectedCity && (
                  <span className="px-3 py-1 bg-green-600/20 border border-green-500/50 rounded-lg text-sm">
                    {selectedCity}
                  </span>
                )}
                <button
                  onClick={clearLocation}
                  className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                  title="Clear location filter"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Location Filter Panel */}
      {showLocationFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-white/10 bg-gray-900/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Globe size={20} className="text-green-400" />
                Filter by Location
              </h3>
              <button
                onClick={() => setShowLocationFilter(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* City Search */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Search by City</label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter city name (e.g., London, Paris, Tokyo)..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Popular Countries */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Popular Countries</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country.code)}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      selectedCountry === country.code
                        ? 'bg-green-600/20 border-green-500 shadow-lg shadow-green-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{country.flag}</div>
                    <p className="text-white text-xs font-medium">{country.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        {!loading && artists.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{artists.length}</span> artists
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading artists...</p>
          </div>
        ) : artists.length > 0 ? (
          <>
            {/* Artists Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {artists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden transition-all border border-white/10 hover:border-white/20"
                >
                  {/* Artist Header */}
                  <div 
                    className="p-4 cursor-pointer flex items-center gap-4 hover:bg-white/5 transition-all"
                    onClick={() => navigate(`/artist/${artist.id}`)}
                  >
                    {/* Artist Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                        {artist.image ? (
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users size={24} className="text-white/50" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Artist Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 truncate group-hover:text-purple-400 transition-colors">
                        {artist.name}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(artist.joindate).getFullYear()}</span>
                        </div>
                        {artist.albums && artist.albums.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Music2 size={14} />
                            <span>{artist.albums.length} album{artist.albums.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Albums List */}
                  {artist.albums && artist.albums.length > 0 && (
                    <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {artist.albums.slice(0, 5).map((album) => (
                        <motion.div
                          key={album.id}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/album/${album.id}`);
                          }}
                        >
                          {/* Album Cover */}
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                            {album.image ? (
                              <img
                                src={album.image}
                                alt={album.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Music2 size={16} className="text-white/30" />
                              </div>
                            )}
                          </div>

                          {/* Album Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate hover:text-purple-400 transition-colors">
                              {album.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(album.releasedate).getFullYear()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {artist.albums.length > 5 && (
                        <p className="text-gray-400 text-xs text-center pt-2">
                          +{artist.albums.length - 5} more album{artist.albums.length - 5 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {/* No Albums Message */}
                  {(!artist.albums || artist.albums.length === 0) && (
                    <div className="px-4 pb-4 text-center">
                      <p className="text-gray-500 text-sm">No albums available</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {artists.length >= limit && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  Load More Artists
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No Artists Found</h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Unable to load artists'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;
