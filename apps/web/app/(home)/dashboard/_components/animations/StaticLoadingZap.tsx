import { Zap } from "lucide-react";

export default function InfiniteLoadingZap() {
  return (
    <div className="relative w-4 h-4 select-none">
      {/* Layer 1: The Empty Background Outline */}
      <Zap className="absolute inset-0 w-full h-full text-zinc-700 fill-transparent" />

      {/* Layer 2: The Constantly Looping Fill Layer */}
      <div className="absolute inset-0 w-full h-full animate-infiniteFill">
        <Zap className="w-full h-full text-purple-500 dark:text-[#A855F7] fill-current" />
      </div>

      {/* Embedded Style Block for the loop engine */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes infiniteFill {
            0% {
              clip-path: inset(100% 0% 0% 0%); /* Start Empty */
            }
            45%, 55% {
              clip-path: inset(0% 0% 0% 0%);   /* Stay completely full briefly at the peak */
            }
            100% {
              clip-path: inset(100% 0% 0% 0%); /* Fade back down smoothly to restart loop */
            }
          }
          .animate-infiniteFill {
            animation: infiniteFill 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `,
        }}
      />
    </div>
  );
}