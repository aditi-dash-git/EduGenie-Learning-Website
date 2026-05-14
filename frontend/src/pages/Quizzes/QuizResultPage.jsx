import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data =
          await quizService.getQuizResults(
            quizId
          );

        setResults(data);
      } catch (error) {
        toast.error(
          "Failed to fetch quiz results."
        );

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg font-medium">
            Quiz results not found.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: {
      quiz,
      results: detailedResults,
    },
  } = results;

  const score = quiz.score;

  const totalQuestions =
    detailedResults.length;

  const correctAnswers =
    detailedResults.filter(
      (r) => r.isCorrect
    ).length;

  const incorrectAnswers =
    totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80)
      return "from-blue-500 to-indigo-600";

    if (score >= 60)
      return "from-cyan-500 to-sky-500";

    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90)
      return "Outstanding!";

    if (score >= 80)
      return "Great job!";

    if (score >= 70)
      return "Good work!";

    if (score >= 60)
      return "Nice attempt!";

    return "Keep practicing!";
  };

  return (
    <div className="max-w-5xl mx-auto relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      <div className="relative">

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to={`/documents/${quiz.document._id}`}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all duration-200"
          >
            <ArrowLeft
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
              strokeWidth={2}
            />

            Back to Document
          </Link>
        </div>

        <PageHeader
          title={`${
            quiz.title || "Quiz"
          } Results`}
        />

        {/* Score Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl shadow-blue-100/20 p-8 mb-8 overflow-hidden relative">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03]" />

          <div className="relative z-10 text-center space-y-6">

            {/* Trophy */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">

              <Trophy
                className="w-10 h-10 text-white"
                strokeWidth={2}
              />
            </div>

            {/* Score */}
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">
                Your Score
              </p>

              <div
                className={`inline-block text-6xl font-bold bg-gradient-to-r ${getScoreColor(
                  score
                )} bg-clip-text text-transparent mb-3`}
              >
                {score}%
              </div>

              <p className="text-xl font-semibold text-slate-700">
                {getScoreMessage(score)}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">

              <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">

                <Target
                  className="w-4 h-4 text-slate-600"
                  strokeWidth={2}
                />

                <span className="text-sm font-semibold text-slate-700">
                  {totalQuestions} Total
                </span>
              </div>

              <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm">

                <CheckCircle2
                  className="w-4 h-4 text-blue-600"
                  strokeWidth={2}
                />

                <span className="text-sm font-semibold text-blue-700">
                  {correctAnswers} Correct
                </span>
              </div>

              <div className="flex items-center gap-2 px-5 py-3 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm">

                <XCircle
                  className="w-4 h-4 text-rose-600"
                  strokeWidth={2}
                />

                <span className="text-sm font-semibold text-rose-700">
                  {incorrectAnswers} Incorrect
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="space-y-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

              <BookOpen
                className="w-5 h-5 text-white"
                strokeWidth={2}
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Detailed Review
              </h3>

              <p className="text-sm text-slate-500">
                Review your answers and explanations
              </p>
            </div>
          </div>

          {detailedResults.map(
            (result, index) => {
              const userAnswerIndex =
                result.options.findIndex(
                  (opt) =>
                    opt ===
                    result.selectedAnswer
                );

              const correctAnswerIndex =
                result.correctAnswer.startsWith(
                  "0"
                )
                  ? parseInt(
                      result.correctAnswer.substring(
                        1
                      )
                    ) - 1
                  : result.options.findIndex(
                      (opt) =>
                        opt ===
                        result.correctAnswer
                    );

              const isCorrect =
                result.isCorrect;

              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 shadow-xl shadow-blue-100/10"
                >

                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">

                    <div className="flex-1">

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl mb-4">

                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                          Question {index + 1}
                        </span>
                      </div>

                      <h4 className="text-lg font-semibold text-slate-900 leading-relaxed">
                        {result.question}
                      </h4>
                    </div>

                    <div
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        isCorrect
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-rose-50 border border-rose-200"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2
                          className="w-6 h-6 text-blue-600"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <XCircle
                          className="w-6 h-6 text-rose-600"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-5">

                    {result.options.map(
                      (
                        option,
                        optIndex
                      ) => {
                        const isCorrectOption =
                          optIndex ===
                          correctAnswerIndex;

                        const isUserAnswer =
                          optIndex ===
                          userAnswerIndex;

                        const isWrongAnswer =
                          isUserAnswer &&
                          !isCorrect;

                        return (
                          <div
                            key={optIndex}
                            className={`relative px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${
                              isCorrectOption
                                ? "bg-blue-50 border-blue-300 shadow-lg shadow-blue-100/30"
                                : isWrongAnswer
                                ? "bg-rose-50 border-rose-300"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >

                            <div className="flex items-center justify-between gap-4">

                              <span
                                className={`text-sm font-medium ${
                                  isCorrectOption
                                    ? "text-blue-900"
                                    : isWrongAnswer
                                    ? "text-rose-900"
                                    : "text-slate-700"
                                }`}
                              >
                                {option}
                              </span>

                              <div className="flex items-center gap-2">

                                {isCorrectOption && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 border border-blue-300 rounded-xl text-xs font-semibold text-blue-700">

                                    <CheckCircle2
                                      className="w-3 h-3"
                                      strokeWidth={
                                        2.5
                                      }
                                    />

                                    Correct
                                  </span>
                                )}

                                {isWrongAnswer && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 border border-rose-300 rounded-xl text-xs font-semibold text-rose-700">

                                    <XCircle
                                      className="w-3 h-3"
                                      strokeWidth={
                                        2.5
                                      }
                                    />

                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Explanation */}
                  {result.explanation && (
                    <div className="p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-100 rounded-2xl">

                      <div className="flex items-start gap-4">

                        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

                          <BookOpen
                            className="w-5 h-5 text-white"
                            strokeWidth={
                              2
                            }
                          />
                        </div>

                        <div className="flex-1">

                          <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.15em] mb-2">
                            Explanation
                          </p>

                          <p className="text-sm text-slate-700 leading-relaxed">
                            {
                              result.explanation
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* Bottom Button */}
        <div className="mt-10 flex justify-center">

          <Link
            to={`/documents/${quiz.document._id}`}
          >
            <button className="group relative px-8 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] overflow-hidden">

              <span className="relative z-10 flex items-center gap-2">

                <ArrowLeft
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                  strokeWidth={
                    2.5
                  }
                />

                Return to Document
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;