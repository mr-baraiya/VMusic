/**
 * Spotify Web API Service
 * Handles authentication and API calls to Spotify
 * Uses Client Credentials Flow for guest access and Authorization Code Flow for logged-in users
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';

const BASE_URL = 'https://api.spotify.com/v1';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

class SpotifyAPI {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.isAuthenticated = false;
  }

  /**
   * Get Client Credentials access token (for guest users)
   * This allows 30-second previews without user login
   */
  async getClientCredentialsToken() {
    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      return data.access_token;
    } catch (error) {
      console.error('Error getting client credentials token:', error);
      throw error;
    }
  }

  /**
   * Get authorization URL for user login
   * This enables full playback control (premium users only)
   */
  getAuthUrl() {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-library-modify',
      'user-top-read',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing'
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: scopes.join(' '),
      show_dialog: 'true'
    });

    return `${AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessTokenFromCode(code) {
    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        })
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      this.isAuthenticated = true;

      // Store tokens
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
      localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());

      return data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());

      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  /**
   * Ensure valid access token
   */
  async ensureValidToken() {
    // Check if we have a stored token
    const storedToken = localStorage.getItem('spotify_access_token');
    const storedExpiry = localStorage.getItem('spotify_token_expiry');

    if (storedToken && storedExpiry) {
      const expiry = parseInt(storedExpiry);
      if (Date.now() < expiry - 60000) { // Refresh 1 minute before expiry
        this.accessToken = storedToken;
        this.tokenExpiry = expiry;
        this.isAuthenticated = true;
        return this.accessToken;
      } else {
        // Token expired, try to refresh
        try {
          return await this.refreshAccessToken();
        } catch (error) {
          // Refresh failed, get new client credentials token
          return await this.getClientCredentialsToken();
        }
      }
    }

    // No stored token, get client credentials token for guest access
    return await this.getClientCredentialsToken();
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    await this.ensureValidToken();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired, refresh and retry
      await this.refreshAccessToken();
      return this.request(endpoint, options);
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
