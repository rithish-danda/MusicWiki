'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArtist, getArtistReleases, getArtistRelationships } from '@/lib/api/musicbrainz';
import { Artist, Release } from '@/lib/api/musicbrainz';

export default function ArtistDetail({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [relationships, setRelationships] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch artist details
        const artistData = await getArtist(params.id, ['url-rels']);
        setArtist(artistData);

        // Fetch releases
        const releasesData = await getArtistReleases(params.id);
        setReleases(releasesData.releases || []);

        // Fetch relationships for the influence map
        const relationshipsData = await getArtistRelationships(params.id);
        setRelationships(relationshipsData);
      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError('Failed to load artist information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Artist not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          &larr; Back to Home
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
          {artist.disambiguation && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{artist.disambiguation}</p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-4">
            {artist.type && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm">
                {artist.type}
              </span>
            )}
            {artist.country && (
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm">
                {artist.country}
              </span>
            )}
            {artist["life-span"]?.begin && (
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm">
                {artist["life-span"].begin} - {artist["life-span"].end || 'Present'}
              </span>
            )}
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <TabButton 
              label="Overview" 
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <TabButton 
              label="Releases" 
              isActive={activeTab === 'releases'} 
              onClick={() => setActiveTab('releases')} 
            />
            <TabButton 
              label="Artist DNA" 
              isActive={activeTab === 'dna'} 
              onClick={() => setActiveTab('dna')} 
            />
            <TabButton 
              label="Credits" 
              isActive={activeTab === 'credits'} 
              onClick={() => setActiveTab('credits')} 
            />
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {artist.disambiguation || 'No detailed information available for this artist.'}
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Latest Releases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {releases.slice(0, 4).map(release => (
                <div key={release.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h4 className="font-medium">{release.title}</h4>
                  {release.date && <p className="text-sm text-gray-500">{release.date}</p>}
                </div>
              ))}
            </div>
            
            <div className="text-right">
              <button 
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setActiveTab('releases')}
              >
                View all releases &rarr;
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'releases' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Releases</h2>
            {releases.length === 0 ? (
              <p className="text-gray-600">No releases found for this artist.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {releases.map(release => (
                  <div 
                    key={release.id} 
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{release.title}</h3>
                        {release.date && <p className="text-sm text-gray-500">{release.date}</p>}
                      </div>
                      <div>
                        {release["release-group"]?.["primary-type"] && (
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs">
                            {release["release-group"]["primary-type"]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'dna' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Artist DNA</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Explore the musical influences and connections of {artist.name}. This feature visualizes the artistic relationships and influences that have shaped their music.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
              <p className="text-center text-gray-500">
                <span className="block text-4xl mb-4">🧬</span>
                Artist DNA visualization is coming soon.
                <br />
                We're working on building beautiful influence maps using D3.js.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'credits' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Credits Explorer</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Discover the people behind the music. This feature shows all the collaborators, producers, engineers, and other contributors who have worked with {artist.name}.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
              <p className="text-center text-gray-500">
                <span className="block text-4xl mb-4">👥</span>
                Credits Explorer is coming soon.
                <br />
                We're aggregating comprehensive credit data from multiple sources.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${isActive
        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}