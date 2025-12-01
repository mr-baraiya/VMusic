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
    const expiry = Date.now() + expiresIn * 1000;
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
      'user-read-currently-playing',
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: scopes.join(' '),
      show_dialog: 'false',
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
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
      return {
        tracks: data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          artists: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          albumCover: track.album.images[0]?.url || '',
          duration: track.duration_ms,
          previewUrl: track.preview_url,
          uri: track.uri,
          external_url: track.external_urls.spotify,
        })),
      };
    } catch (error) {
      console.error('Error searching tracks:', error);
      return { tracks: [] };
    }
  }

  /**
   * Get new releases
   */
  async getNewReleases(limit = 20) {
    try {
      const data = await this.request(`/browse/new-releases?limit=${limit}`);
      const tracks = [];

      for (const album of data.albums.items) {
        // Get album tracks
        const albumData = await this.request(`/albums/${album.id}`);

        // Add first track from each album
        if (albumData.tracks.items.length > 0) {
          const track = albumData.tracks.items[0];
          tracks.push({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            artists: track.artists.map((a) => a.name).join(', '),
            album: album.name,
            albumCover: album.images[0]?.url || '',
            duration: track.duration_ms,
            previewUrl: track.preview_url,
            uri: track.uri,
            external_url: track.external_urls?.spotify,
          });
        }

        if (tracks.length >= limit) break;
      }

      return { tracks };
    } catch (error) {
      console.error('Error getting new releases:', error);
      return { tracks: [] };
    }
  }

  /**
   * Get user's top tracks
   */
  async getTopTracks(limit = 20, timeRange = 'medium_term') {
    try {
      const data = await this.request(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`);
      return {
        tracks: data.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          artists: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          albumCover: track.album.images[0]?.url || '',
          duration: track.duration_ms,
          previewUrl: track.preview_url,
          uri: track.uri,
          external_url: track.external_urls.spotify,
        })),
      };
    } catch (error) {
      console.error('Error getting top tracks:', error);
      return { tracks: [] };
    }
  }

  /**
   * Get featured playlists
   */
  async getFeaturedPlaylists(limit = 20) {
    try {
      const data = await this.request(`/browse/featured-playlists?limit=${limit}`);
      return data.playlists.items;
    } catch (error) {
      console.error('Error getting featured playlists:', error);
      return [];
    }
  }

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(playlistId) {
    try {
      const data = await this.request(`/playlists/${playlistId}/tracks`);
      return {
        tracks: data.items.map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
          artists: item.track.artists.map((a) => a.name).join(', '),
          album: item.track.album.name,
          albumCover: item.track.album.images[0]?.url || '',
          duration: item.track.duration_ms,
          previewUrl: item.track.preview_url,
          uri: item.track.uri,
          external_url: item.track.external_urls.spotify,
        })),
      };
    } catch (error) {
      console.error('Error getting playlist tracks:', error);
      return { tracks: [] };
    }
  }

  /**
   * Get recommendations based on seed tracks
   */
  async getRecommendations(seedTracks = [], limit = 20) {
    try {
      const seedIds = seedTracks.slice(0, 5).join(',');
      const data = await this.request(`/recommendations?seed_tracks=${seedIds}&limit=${limit}`);
      return {
        tracks: data.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          artists: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          albumCover: track.album.images[0]?.url || '',
          duration: track.duration_ms,
          previewUrl: track.preview_url,
          uri: track.uri,
          external_url: track.external_urls.spotify,
        })),
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return { tracks: [] };
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    try {
      return await this.request('/me');
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Format duration from milliseconds to MM:SS
   */
  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Export singleton instance
const spotifyAPI = new SpotifyAPI();
export default spotifyAPI;
