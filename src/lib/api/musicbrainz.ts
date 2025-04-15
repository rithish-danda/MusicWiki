/**
 * MusicBrainz API Client
 * 
 * This module provides functions to interact with the MusicBrainz API
 * and implements caching strategies as outlined in the masterplan.
 */

import axios from 'axios';

// Base configuration for MusicBrainz API
const MB_API_BASE = 'https://musicbrainz.org/ws/2';
const MB_APP_NAME = 'MusicFinder';
const MB_APP_VERSION = '0.1.0';
const MB_CONTACT = 'your-email@example.com'; // Replace with your contact info

// Create axios instance with default configuration
const mbApi = axios.create({
  baseURL: MB_API_BASE,
  headers: {
    'User-Agent': `${MB_APP_NAME}/${MB_APP_VERSION} ( ${MB_CONTACT} )`,
    'Accept': 'application/json'
  },
  params: {
    fmt: 'json'
  }
});

// Rate limiting helper - implements a simple delay between requests
const rateLimiter = async () => {
  // MusicBrainz allows 1 request per second for anonymous users
  return new Promise(resolve => setTimeout(resolve, 1100));
};

// Types for MusicBrainz entities
export interface Artist {
  id: string;
  name: string;
  type?: string;
  country?: string;
  disambiguation?: string;
  "life-span"?: {
    begin?: string;
    end?: string;
    ended?: boolean;
  };
  relations?: any[];
  // Additional fields will be added as needed
}

export interface Release {
  id: string;
  title: string;
  status?: string;
  date?: string;
  country?: string;
  "release-group"?: {
    id: string;
    "primary-type"?: string;
    "secondary-types"?: string[];
  };
  // Additional fields will be added as needed
}

// API Functions

/**
 * Search for artists by name
 */
export async function searchArtists(query: string, limit: number = 10, offset: number = 0) {
  await rateLimiter();
  try {
    const response = await mbApi.get('/artist', {
      params: {
        query,
        limit,
        offset
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
}

/**
 * Get artist by MBID (MusicBrainz Identifier)
 */
export async function getArtist(mbid: string, includes: string[] = []) {
  await rateLimiter();
  try {
    const response = await mbApi.get(`/artist/${mbid}`, {
      params: {
        inc: includes.join('+')
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching artist ${mbid}:`, error);
    throw error;
  }
}

/**
 * Get releases by artist MBID
 */
export async function getArtistReleases(artistMbid: string, limit: number = 100, offset: number = 0) {
  await rateLimiter();
  try {
    const response = await mbApi.get(`/release`, {
      params: {
        artist: artistMbid,
        limit,
        offset,
        inc: 'release-groups+media'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching releases for artist ${artistMbid}:`, error);
    throw error;
  }
}

/**
 * Get artist relationships (for influence maps)
 */
export async function getArtistRelationships(mbid: string) {
  await rateLimiter();
  try {
    const response = await mbApi.get(`/artist/${mbid}`, {
      params: {
        inc: 'artist-rels'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching relationships for artist ${mbid}:`, error);
    throw error;
  }
}

// Export the API client for use in other modules
export default {
  searchArtists,
  getArtist,
  getArtistReleases,
  getArtistRelationships
};