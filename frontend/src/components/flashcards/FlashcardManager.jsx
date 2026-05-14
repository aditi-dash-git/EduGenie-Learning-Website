import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);

    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);

    try {
      await aiService.generateFlashcards(documentId);

      toast.success("Flashcards generated successfully!");

      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);

      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex + 1) % selectedSet.cards.length
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);

      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) %
          selectedSet.cards.length
      );
    }
  };

  const handleReview = async (index) => {
    const currentCard =
      selectedSet?.cards[currentCardIndex];

    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(
        currentCard._id,
        index
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);

      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId
              ? {
                  ...card,
                  isStarred: !card.isStarred,
                }
              : card
          );

          return {
            ...set,
            cards: updatedCards,
          };
        }

        return set;
      });

      setFlashcardSets(updatedSets);

      setSelectedSet(
        updatedSets.find(
          (set) => set._id === selectedSet._id
        )
      );

      toast.success("Star updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();

    setSetToDelete(set);

    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);

    try {
      await flashcardService.deleteFlashcardSet(
        setToDelete._id
      );

      toast.success("Flashcard set deleted!");

      setIsDeleteModalOpen(false);
      setSetToDelete(null);

      fetchFlashcardSets();
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to delete flashcard set."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);

    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    const currentCard =
      selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8">

        {/* Back Button */}
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all duration-200"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/* Flashcard */}
        <div className="flex flex-col items-center space-y-8">

          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-5">

            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex items-center gap-2 px-5 h-11 bg-white border border-blue-100 hover:bg-blue-50 text-slate-700 font-semibold text-sm rounded-2xl transition-all duration-200 shadow-sm disabled:opacity-40"
            >
              <ChevronLeft
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                strokeWidth={2.5}
              />
              Previous
            </button>

            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-sm">
              <span className="text-sm font-bold text-blue-700">
                {currentCardIndex + 1}
              </span>

              <span className="mx-2 text-slate-400">
                /
              </span>

              <span className="text-sm font-medium text-slate-600">
                {selectedSet.cards.length}
              </span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex items-center gap-2 px-5 h-11 bg-white border border-blue-100 hover:bg-blue-50 text-slate-700 font-semibold text-sm rounded-2xl transition-all duration-200 shadow-sm disabled:opacity-40"
            >
              Next
              <ChevronRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 mb-6">

            <Brain
              className="w-10 h-10 text-white"
              strokeWidth={2}
            />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            No Flashcards Yet
          </h3>

          <p className="text-sm text-slate-500 mb-8 text-center max-w-md leading-relaxed">
            Generate flashcards from your document
            and start learning smarter with AI.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-7 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles
                  className="w-4 h-4"
                  strokeWidth={2}
                />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Your Flashcard Sets
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1
                ? "set"
                : "sets"}{" "}
              available
            </p>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-5 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus
                  className="w-4 h-4"
                  strokeWidth={2.5}
                />
                Generate New Set
              </>
            )}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/30 hover:-translate-y-1 overflow-hidden"
            >

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-all duration-300" />

              {/* Delete */}
              <button
                onClick={(e) =>
                  handleDeleteRequest(e, set)
                }
                className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Trash2
                  className="w-4 h-4"
                  strokeWidth={2}
                />
              </button>

              {/* Content */}
              <div className="relative z-10 space-y-5">

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">

                  <Brain
                    className="w-7 h-7 text-white"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                    Flashcard Set
                  </h4>

                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Created{" "}
                    {moment(set.createdAt).format(
                      "MMM D, YYYY"
                    )}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">

                  <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">

                    <span className="text-sm font-bold text-blue-700">
                      {set.cards.length}
                    </span>

                    <span className="ml-1 text-sm text-blue-600 font-medium">
                      {set.cards.length === 1
                        ? "Card"
                        : "Cards"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-[32px] shadow-2xl shadow-blue-100/30 p-8">
        {selectedSet
          ? renderFlashcardViewer()
          : renderSetList()}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() =>
          setIsDeleteModalOpen(false)
        }
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">

          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete this
            flashcard set? This action cannot be
            undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={() =>
                setIsDeleteModalOpen(false)
              }
              disabled={deleting}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-5 h-11 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-red-500/25 active:scale-[0.98] disabled:opacity-50"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;