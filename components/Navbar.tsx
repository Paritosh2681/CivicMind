"use client"
import Link from "next/link";
import { LogIn, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="border-b border-slate-800 bg-[#0D1B2A]/90 sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl font-bold font-heading tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:to-white transition-all">CivicMind</span>
      </Link>
      
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
        {user ? (
          <>
            <Link href="/chat" className="text-slate-300 hover:text-white transition-colors">Chat</Link>
            <button onClick={signOut} className="text-red-400 hover:text-red-300 flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link href="/auth" className="bg-[#1E90FF] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-blue-900/50 shadow-lg font-semibold">
            <LogIn size={16} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}