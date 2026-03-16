import React from "react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-[#f6f6f6] z-[9999] flex items-center justify-center">
      <div className="w-24 h-1 bg-slate-200 overflow-hidden rounded-full">
        <div className="w-full h-full bg-slate-400 animate-pulse" />
      </div>
    </div>
  );
}
