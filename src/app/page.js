"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Linkedin, Twitter, Layers } from "lucide-react";
import ControlPanel from "./components/ControlPanel";

export default function ExecutivePostStudio() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("linkedin");
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe mock utility to test the UI container blocks independently of your API key state
  const loadMockPreview = () => {
    setOutput({
      linkedin_long: "🚀 Executive Brand Insight\n\nBuilding an elite content studio requires clean logic parameters and high structural frameworks.\n\nKey takeaways:\n• Automate manual distribution layouts\n• Keep interfaces clean and split-screen focused",
      x_short: "Building an elite content studio requires clean logic parameters and high structural frameworks. Scale your thought leadership instantly.",
      x_thread: [
        "1/3 Building an executive ghostwriting studio requires high-utility information frameworks and clean presets.",
        "2/3 The real shift happens when you convert single thoughts into cross-platform content variations automatically.",
        "3/3 Switch tabs on the right side panel to inspect all model output nodes cleanly."
      ]
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          ExecutivePostStudio
        </h1>
        <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-mono">MVP Dashboard</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ControlPanel setLoading={setLoading} loading={loading} setOutput={setOutput} />

        <div className="w-1/2 p-6 bg-slate-950 overflow-y-auto flex flex-col">
          {output ? (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex border-b border-slate-800 gap-2">
                <button
                  onClick={() => setActiveTab("linkedin")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 font-medium transition ${activeTab === "linkedin" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
                >
                  <Linkedin size={16} /> LinkedIn Long
                </button>
                <button
                  onClick={() => setActiveTab("x_short")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 font-medium transition ${activeTab === "x_short" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
                >
                  <Twitter size={16} /> X Short
                </button>
                <button
                  onClick={() => setActiveTab("x_thread")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 font-medium transition ${activeTab === "x_thread" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
                >
                  <Layers size={16} /> X Thread Split
                </button>
              </div>

              <div className="flex-1 bg-slate-900 rounded-xl p-5 border border-slate-800 relative whitespace-pre-wrap text-sm text-slate-200 leading-relaxed overflow-y-auto font-mono">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => {
                      const dataToCopy = activeTab === "x_thread" ? output.x_thread.join("\n\n---\n\n") : output[activeTab];
                      handleCopy(dataToCopy);
                    }}
                    className="p-2 bg-slate-950/80 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-100 transition"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>

                {activeTab === "linkedin" && <div>{output.linkedin_long || "No LinkedIn content generated."}</div>}
                {activeTab === "x_short" && <div>{output.x_short || "No single post content generated."}</div>}
                {activeTab === "x_thread" && (
                  <div className="space-y-4">
                    {output.x_thread && output.x_thread.length > 0 ? (
                      output.x_thread.map((tweet, index) => (
                        <div key={index} className="bg-slate-950 p-4 border border-slate-800 rounded-lg relative">
                          <span className="absolute top-2 right-2 text-[10px] text-slate-600 font-sans">Node {index + 1}</span>
                          {tweet}
                        </div>
                      ))
                    ) : (
                      <div>No thread sequences detected.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 p-8 text-center">
              <Layers size={32} className="mb-3 text-slate-700" />
              <p className="text-sm font-medium">Ready for Ingestion Output</p>
              <p className="text-xs text-slate-600 max-w-xs mt-1 mb-4">Configure your preset models on the left and run generation vectors to view results.</p>
              
              <button 
                onClick={loadMockPreview}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg border border-slate-700 transition"
              >
                Inject Mock Data to Test UI Panels
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
