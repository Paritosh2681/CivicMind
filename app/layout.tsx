import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "CivicMind | AI Election Assistant",
  description: "Learn about election processes with Gemini and real-time data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-[#0D1B2A] text-white min-h-screen flex flex-col antialiased">
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="py-4 text-center text-sm text-slate-400 border-t border-slate-800 flex justify-center items-center h-16">
          <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-700">Powered by Google Gemini + Tavily</span>
        </footer>
      </body>
    </html>
  );
}