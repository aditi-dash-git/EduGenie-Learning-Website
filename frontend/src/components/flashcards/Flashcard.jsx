import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative w-full h-72"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped
            ? "rotateY(180deg)"
            : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >

        {/* FRONT CARD */}
        <div
          className="absolute inset-0 w-full h-full bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl shadow-blue-100/40 p-8 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >

          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03]" />

          {/* Top */}
          <div className="relative z-10 flex items-start justify-between">

            {/* Difficulty */}
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-[10px] font-bold uppercase tracking-wide text-blue-700 border border-blue-200 shadow-sm">
              {flashcard?.difficulty}
            </div>

            {/* Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">

            <p className="text-xl font-bold text-slate-900 text-center leading-relaxed tracking-tight">
              {flashcard.question}
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold">

            <RotateCcw
              className="w-3.5 h-3.5"
              strokeWidth={2}
            />

            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* BACK CARD */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 border border-blue-400/50 rounded-3xl shadow-2xl shadow-blue-500/30 p-8 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >

          {/* Glow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%)]" />

          {/* Top */}
          <div className="relative z-10 flex justify-end">

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-white/30 backdrop-blur-sm text-white border border-white/40"
                  : "bg-white/20 backdrop-blur-sm text-white/70 hover:bg-white/30 hover:text-white border border-white/20"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">

            <p className="text-base text-white text-center leading-relaxed font-medium">
              {flashcard.answer}
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-xs text-white/80 font-semibold">

            <RotateCcw
              className="w-3.5 h-3.5"
              strokeWidth={2}
            />

            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;