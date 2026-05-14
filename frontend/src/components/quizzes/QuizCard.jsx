import React from "react";
import { Link } from "react-router-dom";
import {
  Play,
  BarChart2,
  Trash2,
  Award,
} from "lucide-react";
import moment from "moment";

const QuizCard = ({
  quiz,
  onDelete,
}) => {
  return (
    <div className="group relative bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/30 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 z-20 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <Trash2
          className="w-4 h-4"
          strokeWidth={2}
        />
      </button>

      <div className="relative z-10 space-y-5">

        {/* Score Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">

          <Award
            className="w-4 h-4 text-blue-600"
            strokeWidth={2.5}
          />

          <span className="text-sm font-bold text-blue-700">
            Score: {quiz?.score}
          </span>
        </div>

        {/* Quiz Title */}
        <div>

          <h3
            className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 tracking-tight"
            title={quiz.title}
          >
            {quiz.title ||
              `Quiz - ${moment(
                quiz.createdAt
              ).format("MMM D, YYYY")}`}
          </h3>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Created{" "}
            {moment(
              quiz.createdAt
            ).format("MMM D, YYYY")}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">

          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-100 shadow-sm">

            <span className="text-sm font-bold text-cyan-700">
              {quiz.questions.length}
            </span>

            <span className="ml-1 text-sm font-medium text-cyan-600">
              {quiz.questions.length === 1
                ? "Question"
                : "Questions"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-5 pt-5 border-t border-slate-100">

        {quiz?.userAnswers?.length > 0 ? (
          <Link
            to={`/quizzes/${quiz._id}/results`}
          >
            <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-500 hover:to-indigo-600 text-slate-700 hover:text-white font-semibold text-sm rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-blue-500/20">

              <BarChart2
                className="w-4 h-4"
                strokeWidth={2.5}
              />

              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="group/btn relative w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] overflow-hidden">

              <span className="relative z-10 flex items-center justify-center gap-2">

                <Play
                  className="w-4 h-4"
                  strokeWidth={2.5}
                />

                Start Quiz
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>
          </Link>
        )}
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </div>
  );
};

export default QuizCard;