'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchArtists } from '@/lib/api/musicbrainz';
import { Artist } from '@/lib/api/musicbrainz';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<{artists: Artist[]}>({artists: []});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchArtists(query);
        setResults(data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {!loading && !error && results.artists && results.artists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No results found for "{query}"</p>
          </div>
        )}
        
        {!loading && !error && results.artists && results.artists.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {results.artists.map(artist => (
              <Link 
                href={`/artist/${artist.id}`} 
                key={artist.id}
                className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
                    {artist.disambiguation && (
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{artist.disambiguation}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {artist.type && (
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-sm">
                          {artist.type}
                        </span>
                      )}
                      {artist.country && (
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded text-sm">
                          {artist.country}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {artist["life-span"]?.begin && (
                      <span>{artist["life-span"].begin} - {artist["life-span"].end || 'Present'}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}