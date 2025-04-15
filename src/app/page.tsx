'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">MusicFinder</h1>
        <h2 className="text-2xl text-center mb-12">Next-Gen Music Encyclopedia</h2>
        
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search for artists, albums, or songs..."
              className="w-full p-4 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              onClick={() => {
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <FeatureCard 
            title="Artist DNA" 
            description="Explore influence maps and connections between artists"
            icon="🧬"
          />
          <FeatureCard 
            title="Release Timelines" 
            description="Visualize artist discographies and release history"
            icon="📅"
          />
          <FeatureCard 
            title="Credits Explorer" 
            description="Discover who worked on your favorite music"
            icon="👥"
          />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <FutureBadge label="User Collections" />
            <FutureBadge label="Lost Albums" />
            <FutureBadge label="Label Histories" />
            <FutureBadge label="Concert Mapping" />
            <FutureBadge label="Studio Gear DB" />
            <FutureBadge label="Genre Trees" />
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function FutureBadge({ label }: { label: string }) {
  return (
    <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
      {label}
    </span>
  );
}