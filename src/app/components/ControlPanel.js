"use client";

import { useState } from "react";
import { FileText, Link2, Mic, Loader2 } from "lucide-react";

export default function ControlPanel({ setLoading, loading, setOutput }) {
  const [inputType, setInputType] = useState("text");
  const [sourceValue, setSourceValue] = useState("");
  const [tone, setTone] = useState("authoritative");
  const [formality, setFormality] = useState("professional");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async () => {
    if (!sourceValue.trim()) {
      setErrorMessage("Please input some text content first.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inputType,
          source: sourceValue,
          tone,
          formality,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Send the data up to the parent component page
        setOutput(data.data);
      } else {
        setErrorMessage(data.error || "The server responded, but returned empty fields.");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setErrorMessage("Network error: Could not contact your local backend route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 p-6 border-r border-slate-800 overflow-y-auto space-y-6 bg-slate-900/50">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300">1. Ingest Raw Framework</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => { setInputType("url"); setSourceValue(""); setErrorMessage(""); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${inputType === "url" ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}
          >
            <Link2 size={16} /> URL Link
          </button>
          <button
            onClick={() => { setInputType("text"); setSourceValue(""); setErrorMessage(""); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${inputType === "text" ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}
          >
            <FileText size={16} /> Raw Text
          </button>
          <button
            onClick={() => { setInputType("voice"); setSourceValue("Voice processing note simulation payload..."); setErrorMessage(""); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${inputType === "voice" ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}
          >
            <Mic size={16} /> Voice Note
          </button>
        </div>
      </div>

      <div>
        {inputType === "url" && (
          <input
            type="url"
            placeholder="https://example.com"
            value={sourceValue}
            onChange={(e) => setSourceValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 text-white"
          />
        )}
        {inputType === "text" && (
          <textarea
            rows={5}
            placeholder="Paste insights, structured documentation or article briefs here..."
            value={sourceValue}
            onChange={(e) => setSourceValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none text-white"
          />
        )}
        {inputType === "voice" && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Mic size={20} />
            </div>
            <p className="text-xs text-slate-400">Audio input mock activated. Direct text translation route ready.</p>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-800 pt-4">
        <label className="text-sm font-semibold text-slate-300">2. Apply Executive Engine Tone</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Tone Profile</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="authoritative">Authoritative Thought Leader</option>
              <option value="warm">Conversational & Warm</option>
              <option value="contrarian">Analytical & Contrarian</option>
            </select>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Formality Tier</span>
            <select
              value={formality}
              onChange={(e) => setFormality(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="executive">C-Suite Executive</option>
              <option value="professional">Professional Consultant</option>
              <option value="casual">Casual Tech Founder</option>
            </select>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-xs font-mono">
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !sourceValue}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg py-3 font-medium transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Tailoring Brand Variations...
          </>
        ) : (
          "Generate Studio Variations"
        )}
      </button>
    </div>
  );
}
