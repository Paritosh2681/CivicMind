export const metadata = {
  title: "About CivicMind",
  description: "Learn about the Election Process Education vertical and how CivicMind works.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold font-heading mb-6 text-white">About CivicMind</h1>
      <p className="text-lg text-slate-300 mb-8 leading-relaxed">
        CivicMind is an AI-powered Election Process Education assistant designed to empower citizens with accurate, real-time, and reliable information about electoral and democratic processes.
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-blue-400 mb-3">The Problem</h2>
          <p className="text-slate-400 leading-relaxed bg-slate-900 p-6 rounded-xl border border-slate-800">
            Electoral processes are often complex and intimidating. Voters face challenges finding non-partisan, accurate, and up-to-date information regarding registration, voting locations, candidate details, and constitutional duties. Misinformation spreads rapidly during election cycles.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-blue-400 mb-3">How CivicMind Works</h2>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-slate-400">
            <p className="flex items-center gap-3">
              <span className="bg-blue-900/50 text-blue-400 h-8 w-8 flex items-center justify-center rounded-full font-bold">1</span>
              Users ask questions in natural language.
            </p>
            <p className="flex items-center gap-3">
              <span className="bg-blue-900/50 text-blue-400 h-8 w-8 flex items-center justify-center rounded-full font-bold">2</span>
              CivicMind uses the <strong>Tavily Search API</strong> to fetch real-time, highly relevant context from the web.
            </p>
            <p className="flex items-center gap-3">
              <span className="bg-blue-900/50 text-blue-400 h-8 w-8 flex items-center justify-center rounded-full font-bold">3</span>
              <strong>Google Gemini 1.5 Flash</strong> synthesizes this factual context to provide accurate, non-partisan, and easy-to-understand explanations.
            </p>
            <p className="flex items-center gap-3">
              <span className="bg-blue-900/50 text-blue-400 h-8 w-8 flex items-center justify-center rounded-full font-bold">4</span>
              User authentication and chat history are securely managed by <strong>Supabase</strong>.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-blue-400 mb-3">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed bg-slate-900 p-6 rounded-xl border border-slate-800">
            Promoting election literacy and maximizing democratic participation by making civic information easily accessible to everyone.
          </p>
        </div>
      </section>
    </div>
  );
}