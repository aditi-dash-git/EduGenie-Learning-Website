import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({
  flashcardSet,
}) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(
      `/documents/${flashcardSet.documentId._id}/flashcards`
    );
  };

  const reviewedCount =
    flashcardSet.cards.filter(
      (card) => card.lastReviewed
    ).length;

  const totalCards =
    flashcardSet.cards.length;

  const progressPercentage =
    totalCards > 0
      ? Math.round(
          (reviewedCount / totalCards) * 100
        )
      : 0;

  return (
    <div
      onClick={handleStudyNow}
      className="group relative bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/30 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-all duration-300" />

      <div className="relative z-10 space-y-5">

        {/* Header */}
        <div className="flex items-start gap-4">

          {/* Icon */}
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

            <BookOpen
              className="w-7 h-7 text-white"
              strokeWidth={2}
            />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">

            <h3
              className="text-lg font-bold text-slate-900 line-clamp-2 mb-1 tracking-tight"
              title={
                flashcardSet?.documentId?.title
              }
            >
              {
                flashcardSet?.documentId
                  ?.title
              }
            </h3>

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Created{" "}
              {moment(
                flashcardSet.createdAt
              ).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 pt-1 flex-wrap">

          {/* Cards */}
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">

            <span className="text-sm font-bold text-blue-700">
              {totalCards}
            </span>

            <span className="ml-1 text-sm font-medium text-blue-600">
              {totalCards === 1
                ? "Card"
                : "Cards"}
            </span>
          </div>

          {/* Progress */}
          {reviewedCount > 0 && (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-100 shadow-sm">

              <TrendingUp
                className="w-4 h-4 text-cyan-600"
                strokeWidth={2.5}
              />

              <span className="text-sm font-bold text-cyan-700">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCards > 0 && (
          <div className="space-y-2 pt-1">

            <div className="flex items-center justify-between">

              <span className="text-xs font-semibold text-slate-700">
                Progress
              </span>

              <span className="text-xs font-medium text-slate-500">
                {reviewedCount}/
                {totalCards} reviewed
              </span>
            </div>

            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="relative z-10 mt-6 pt-5 border-t border-slate-100">

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="group/btn relative w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">

            <Sparkles
              className="w-4 h-4"
              strokeWidth={2.5}
            />

            Study Now
          </span>

          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
        </button>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </div>
  );
};

export default FlashcardSetCard;