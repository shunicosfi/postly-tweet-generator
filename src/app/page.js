'use client';
import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Holds error messages

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setTweets([]); // Clear old tweets before loading new ones
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong during generation.');
      }

      setTweets(data.tweets);
    } catch (err) {
      setError(err.message || 'Could not connect to the generator engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center py-16 px-4 antialiased">
      <div className="w-full max-w-2xl">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <div className="inline-block bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-blue-500/20 tracking-wider uppercase">
            AI Content Engine
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent sm:text-5xl">
            Postly Tweets Generator
          </h1>
          <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-md mx-auto">
            Generate high-engaging, trend-ready content for your audience in seconds.
          </p>
        </header>

        {/* Input Form Card */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40 mb-10 backdrop-blur-sm">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            What is your tweet topic?
          </label>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="e.g., Artificial Intelligence, Remote Work... (Type 'error' to test failure)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            />
            
            {/* ERROR MESSAGE DISPLAY */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {/* LOADING SPINNER */}
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Crafting Your Posts...</span>
                </>
              ) : (
                'Generate Tweets'
              )}
            </button>
          </div>
        </section>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              Generated Suggestions
              {tweets.length > 0 && (
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                  {tweets.length}
                </span>
              )}
            </h2>
          </div>

          {tweets.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-slate-400 text-sm">Your custom-crafted tweets will appear down here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tweets.map((tweet, index) => (
                <article 
                  key={index} 
                  className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 shadow-md transition-all relative group"
                >
                  <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
                    {tweet}
                  </p>
                  
                  {/* Action Bar inside card */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                    
                    {/* CHARACTER COUNT */}
                    <span className={`text-xs font-medium ${tweet.length > 280 ? 'text-red-400' : 'text-slate-500'}`}>
                      {tweet.length} / 280 characters
                    </span>

                    {/* COPY TO CLIPBOARD BUTTON */}
                    <button 
                      onClick={() => navigator.clipboard.writeText(tweet)}
                      className="text-xs font-medium text-slate-400 hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
