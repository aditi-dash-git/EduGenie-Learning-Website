import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";

const QuizTakePage = () => {
  const { quizId } = useParams();

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);

  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response =
          await quizService.getQuizById(
            quizId
          );

        setQuiz(response.data);
      } catch (error) {
        toast.error(
          "Failed to fetch quiz."
        );

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (
    questionId,
    optionIndex
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (
      currentQuestionIndex <
      quiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(
        (prev) => prev + 1
      );
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (prev) => prev - 1
      );
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);

    try {
      const formattedAnswers =
        Object.keys(selectedAnswers).map(
          (questionId) => {
            const question =
              quiz.questions.find(
                (q) =>
                  q._id === questionId
              );

            const questionIndex =
              quiz.questions.findIndex(
                (q) =>
                  q._id === questionId
              );

            const optionIndex =
              selectedAnswers[
                questionId
              ];

            const selectedAnswer =
              question.options[
                optionIndex
              ];

            return {
              questionIndex,
              selectedAnswer,
            };
          }
        );

      await quizService.submitQuiz(
        quizId,
        formattedAnswers
      );

      toast.success(
        "Quiz submitted successfully!"
      );

      navigate(
        `/quizzes/${quizId}/results`
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (
    !quiz ||
    quiz.questions.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg font-medium">
            Quiz not found or has no
            questions.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion =
    quiz.questions[
      currentQuestionIndex
    ];

  const answeredCount =
    Object.keys(selectedAnswers)
      .length;

  return (
    <div className="max-w-4xl mx-auto relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      <div className="relative">

        <PageHeader
          title={
            quiz.title || "Take Quiz"
          }
        />

        {/* Progress */}
        <div className="mb-8">

          <div className="flex items-center justify-between mb-3">

            <span className="text-sm font-semibold text-slate-700">
              Question{" "}
              {currentQuestionIndex + 1}{" "}
              of{" "}
              {quiz.questions.length}
            </span>

            <span className="text-sm font-medium text-blue-600">
              {answeredCount} answered
            </span>
          </div>

          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">

            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  ((currentQuestionIndex +
                    1) /
                    quiz.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl shadow-blue-100/20 p-8 mb-8 overflow-hidden relative">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03]" />

          <div className="relative z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl mb-6 shadow-sm">

              <BrainCircuit
                className="w-4 h-4 text-blue-600"
                strokeWidth={2.5}
              />

              <span className="text-sm font-semibold text-blue-700">
                Question{" "}
                {currentQuestionIndex +
                  1}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
              {
                currentQuestion.question
              }
            </h3>

            {/* Options */}
            <div className="space-y-4">

              {currentQuestion.options.map(
                (option, index) => {
                  const isSelected =
                    selectedAnswers[
                      currentQuestion
                        ._id
                    ] === index;

                  return (
                    <label
                      key={index}
                      className={`group relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-100/40 scale-[1.01]"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >

                      <input
                        type="radio"
                        name={`question-${currentQuestion._id}`}
                        value={index}
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          handleOptionChange(
                            currentQuestion._id,
                            index
                          )
                        }
                        className="sr-only"
                      />

                      {/* Radio */}
                      <div
                        className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300 bg-white group-hover:border-blue-400"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>

                      {/* Option */}
                      <span
                        className={`ml-5 text-base font-medium transition-colors duration-200 ${
                          isSelected
                            ? "text-blue-900"
                            : "text-slate-700"
                        }`}
                      >
                        {option}
                      </span>

                      {/* Tick */}
                      {isSelected && (
                        <CheckCircle2
                          className="ml-auto w-6 h-6 text-blue-500"
                          strokeWidth={
                            2.5
                          }
                        />
                      )}
                    </label>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4">

          <Button
            onClick={
              handlePreviousQuestion
            }
            disabled={
              currentQuestionIndex ===
                0 || submitting
            }
            variant="outline"
          >
            <ChevronLeft
              className="w-4 h-4"
              strokeWidth={2.5}
            />

            Previous
          </Button>

          {currentQuestionIndex ===
          quiz.questions.length - 1 ? (
            <button
              onClick={
                handleSubmitQuiz
              }
              disabled={submitting}
              className="group relative px-8 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >

              <span className="relative z-10 flex items-center justify-center gap-2">

                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      className="w-4 h-4"
                      strokeWidth={
                        2.5
                      }
                    />

                    Submit Quiz
                  </>
                )}
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          ) : (
            <Button
              onClick={
                handleNextQuestion
              }
              disabled={submitting}
            >
              Next

              <ChevronRight
                className="w-4 h-4"
                strokeWidth={2.5}
              />
            </Button>
          )}
        </div>

        {/* Navigation Dots */}
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">

          {quiz.questions.map(
            (_, index) => {
              const isAnsweredQuestion =
                selectedAnswers.hasOwnProperty(
                  quiz.questions[index]
                    ._id
                );

              const isCurrent =
                index ===
                currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentQuestionIndex(
                      index
                    )
                  }
                  disabled={submitting}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isCurrent
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-110"
                      : isAnsweredQuestion
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {index + 1}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;