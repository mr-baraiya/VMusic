/**
 * Spotify Web API Service
 * Handles authentication and API calls to Spotify
 * Uses Implicit Grant Flow for client-side authentication (no backend needed)
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';

const BASE_URL = 'https://api.spotify.com/v1';
const AUTH_URL = 'https://accounts.spotify.com/authorize';

class SpotifyAPI {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.isAuthenticated = false;
    this.loadTokenFromStorage();
  }

  /**
   * Load token from localStorage if available
   */
  loadTokenFromStorage() {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && expiry && Date.now() < parseInt(expiry)) {
      this.accessToken = token;
      this.tokenExpiry = parseInt(expiry);
      this.isAuthenticated = true;
    }
  }

  /**
   * Save token to localStorage
   */
  saveTokenToStorage(token, expiresIn) {
    const expiry = Date.now() + (expiresIn * 1000);
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_token_expiry', expiry.toString());
    this.accessToken = token;
    this.tokenExpiry = expiry;
    this.isAuthenticated = true;
  }

  /**
   * Get authorization URL for user login
   * Uses Implicit Grant Flow - no backend needed
   */
  getAuthUrl() {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-top-read',
      'playlist-read-private',
      'streaming',
      'user-read-playback-state',
      'user-read-currently-playing'
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: scopes.join(' '),
      show_dialog: 'false'
    });

    return `${AUTH_URL}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback and extract access token from URL hash
   */
  handleCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');
    
    if (accessToken && expiresIn) {
      this.saveTokenToStorage(accessToken, parseInt(expiresIn));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  }

  /**
   * Check if token is valid and not expired
   */
  isTokenValid() {
    return this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  /**
   * Logout and clear tokens
   */
  logout() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    this.accessToken = null;
    this.tokenExpiry = null;
    this.isAuthenticated = false;
  }

  /**
   * Get access token (returns null if not authenticated)
   */
  async getAccessToken() {
    if (this.isTokenValid()) {
      return this.accessToken;
    }
    return null;
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated. Please login with Spotify.');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired, logout
      this.logout();
      throw new Error('Token expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Search for tracks
   */
  async searchTracks(query, limit = 20) {
    try {
      const data = await this.request(
        `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
      );
      return this.formatTracksResponse(data.tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get new releases
   */
  async getNewReleases(limit = 20) {
    try {
      const data = await this.request(`/browse/new-releases?limit=${limit}`);
      // Get tracks from albums
      const albumIds = data.albums.items.map(album => album.id).join(',');
      const albums = await this.request(`/albums?ids=${albumIds}`);
      
      const tracks = albums.albums.flatMap(album => 
        album.tracks.items.map(track => ({
          ...track,
          album: {
            id: album.id,
            name: album.name,
            images: album.images,
            release_date: album.release_date
          }
        }))
      );

      return { items: tracks, total: tracks.length };
    } catch (error) {
      console.error('Error getting new releases:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get featured playlists
   */
  async getFeaturedPlaylists(limit = 20) {
    try {
      const data = await this.request(`/browse/featured-playlists?limit=${limit}`);
      return data.playlists;
    } catch (error) {
      console.error('Error getting featured playlists:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const data = await this.request(`/playlists/${playlistId}/tracks?limit=${limit}`);
      return this.formatTracksResponse(data);
    } catch (error) {
      console.error('Error getting playlist tracks:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get track by ID
   */
  async getTrack(trackId) {
    try {
      const track = await this.request(`/tracks/${trackId}`);
      return this.formatTrack(track);
    } catch (error) {
      console.error('Error getting track:', error);
      return null;
    }
  }

  /**
   * Get artist by ID
   */
  async getArtist(artistId) {
    try {
      const artist = await this.request(`/artists/${artistId}`);
      return artist;
    } catch (error) {
      console.error('Error getting artist:', error);
      return null;
    }
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistId, market = 'US') {
    try {
      const data = await this.request(`/artists/${artistId}/top-tracks?market=${market}`);
      return { items: data.tracks, total: data.tracks.length };
    } catch (error) {
      console.error('Error getting artist top tracks:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get recommendations
   */
  async getRecommendations(seedTracks = [], seedArtists = [], limit = 20) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });
      
      if (seedTracks.length > 0) {
        params.append('seed_tracks', seedTracks.slice(0, 5).join(','));
      }
      if (seedArtists.length > 0) {
        params.append('seed_artists', seedArtists.slice(0, 5).join(','));
      }

      const data = await this.request(`/recommendations?${params.toString()}`);
      return { items: data.tracks, total: data.tracks.length };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get user's saved tracks (requires authentication)
   */
  async getSavedTracks(limit = 20, offset = 0) {
    try {
      const data = await this.request(`/me/tracks?limit=${limit}&offset=${offset}`);
      return this.formatTracksResponse(data);
    } catch (error) {
      console.error('Error getting saved tracks:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get user's top tracks (requires authentication)
   */
  async getUserTopTracks(timeRange = 'medium_term', limit = 20) {
    try {
      const data = await this.request(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
      return { items: data.items, total: data.total };
    } catch (error) {
      console.error('Error getting user top tracks:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Format tracks response to unified format
   */
  formatTracksResponse(data) {
    if (!data || !data.items) {
      return { items: [], total: 0 };
    }

    const items = data.items.map(item => {
      // Handle saved tracks format (track is nested in 'track' property)
      const track = item.track || item;
      return this.formatTrack(track);
    });

    return {
      items,
      total: data.total || items.length
    };
  }

  /**
   * Format single track to unified format compatible with existing player
   */
  formatTrack(track) {
    return {
      id: track.id,
      name: track.name,
      artist_name: track.artists[0]?.name || 'Unknown Artist',
      artist_id: track.artists[0]?.id || '',
      album_name: track.album?.name || '',
      album_id: track.album?.id || '',
      album_image: track.album?.images?.[0]?.url || '',
      duration: Math.floor(track.duration_ms / 1000),
      audio: track.preview_url, // 30-second preview
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify || '',
      image: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '',
      releasedate: track.album?.release_date || '',
      popularity: track.popularity || 0,
      explicit: track.explicit || false,
      source: 'spotify' // Mark as Spotify track
    };
  }

  /**
   * Logout user from Spotify
   */
  logout() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.isAuthenticated = false;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  }

  /**
   * Check if user is authenticated with Spotify
   */
  isUserAuthenticated() {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    return token && expiry && Date.now() < parseInt(expiry);
  }
}

export const spotifyAPI = new SpotifyAPI();
export default spotifyAPI;
