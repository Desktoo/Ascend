"use client";

import { ShieldCheck } from "lucide-react";

export default function OAuthWarningBanner() {
  return (
    <div className="p-5 h-60 rounded-2xl border m-5 flex flex-col items-center justify-center border-zinc-800 bg-[#0C0C0E] text-zinc-200 space-y-3">
      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="text-center space-y-1">
        <h1 className="font-bold">Social Authentication Active</h1>

        <p className="text-xs font-semibold text-zinc-400 mt-0.5">
          You signed in using Google / GitHub. Password management is handled by
          your OAuth provider.
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">
          To change your security settings, please visit your account settings
          on Google or GitHub.
        </p>
      </div>
    </div>
  );
}
