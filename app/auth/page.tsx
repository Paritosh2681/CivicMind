"use client";

import { signInWithGoogle } from "@/lib/auth";
import { LogIn } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 bg-blue-950 text-white min-h-[calc(100vh-64px)]">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-heading">Welcome to CivicMind</h1>
          <p className="text-slate-400">Sign in to access your AI Election Assistant and save your chat history.</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}