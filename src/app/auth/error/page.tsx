"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred during sign in.";
  if (error === "AccessDenied") {
    errorMessage = "Access denied. Only @municibid.com email addresses are allowed.";
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-gray-400 mb-6">{errorMessage}</p>
        
        <Link
          href="/auth/signin"
          className="inline-block bg-[#6366f1] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#5558e3] transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
