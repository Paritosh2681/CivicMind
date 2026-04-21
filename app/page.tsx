import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, History } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col pt-16">
      <section className="text-center px-6 py-20 bg-gradient-to-b from-blue-950 to-[#0D1B2A]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent drop-shadow-sm">
            Empower Your Vote with AI
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            CivicMind is your expert election assistant. Ask anything about voting processes, democratic rights, and electoral systems—powered by real-time web context.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-[#1E90FF] hover:bg-blue-600 text-white font-semibold py-4 px-10 rounded-full flex items-center gap-3 transition-all shadow-xl shadow-blue-900/30 text-lg hover:-translate-y-0.5"
            >
              Start Learning <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden bg-slate-900/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-[#122336] p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20 group">
            <div className="bg-blue-900/40 w-16 h-16 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading text-white">Ask Anything</h3>
            <p className="text-slate-400 leading-relaxed">
              Curious about how Electronic Voting Machines work? Need to register? Get clear, non-partisan answers to complex democratic processes.
            </p>
          </div>

          <div className="bg-[#122336] p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20 group">
            <div className="bg-blue-900/40 w-16 h-16 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Globe size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading text-white">Real-Time Data</h3>
            <p className="text-slate-400 leading-relaxed">
              CivicMind connects directly to the web using Tavily Search, ensuring your answers are backed by the most current and factual sources before generating a response.
            </p>
          </div>

          <div className="bg-[#122336] p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20 group">
            <div className="bg-blue-900/40 w-16 h-16 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <History size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading text-white">Save Your History</h3>
            <p className="text-slate-400 leading-relaxed">
              Log in to securely save and revisit your conversations. Pick up exactly where you left off as you continually build your civic literacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}