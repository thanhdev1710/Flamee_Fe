"use client";

import React from "react";

export default function Page() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-[#0b0b0e] via-[#111214] to-black p-6">
      {/* Ambient light behind TV */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[70%] h-[55%] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div
        className="relative bg-black rounded-4xl p-5 border border-gray-700/60 w-[92%] max-w-6xl aspect-video 
                      shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Top glossy reflection */}
        <div
          className="absolute top-0 left-0 right-0 h-12 rounded-t-4xl 
                        bg-linear-to-b from-white/10 to-transparent pointer-events-none"
        />

        {/* Side soft glow */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-20 h-40 bg-purple-500/10 blur-3xl" />
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-20 h-40 bg-blue-500/10 blur-3xl" />

        {/* ON Light Indicator */}
        <div className="absolute top-5 right-6 w-3 h-3 rounded-full z-10 bg-green-400 shadow-[0_0_12px_3px_rgba(34,197,94,0.8)]"></div>

        {/* TV Screen */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-8 border-gray-900 shadow-[inset_0_0_25px_#000]">
          <iframe
            src="https://toeicsprint.cloud/"
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Bottom glossy line */}
        <div className="absolute bottom-10 left-0 right-0 h-6 bg-linear-to-t from-white/5 to-transparent" />

        {/* TV Chrome Logo */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-semibold tracking-[0.25em] select-none">
          FLAMEE • OLED
        </div>

        {/* TV Stand */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-linear-to-b 
                        from-gray-700/90 to-gray-900 rounded-b-3xl shadow-xl border-t border-gray-500/30"
        />
      </div>
    </div>
  );
}
