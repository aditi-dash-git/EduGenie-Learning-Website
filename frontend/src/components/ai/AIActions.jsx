import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  BrainCircuit,
} from "lucide-react";

import aiService from "../../services/aiService";
import toast from "react-hot-toast";

import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [concept, setConcept] = useState("");

  // Generate Summary
  const handleGenerateSummary = async () => {
    setLoadingAction("summary");

    try {
      const { summary } =
        await aiService.generateSummary(documentId);

      setModalTitle("Generated Summary");
      setModalContent(summary);

      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Explain Concept
  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept.");
      return;
    }

    setLoadingAction("explain");

    try {
      const { explanation } =
        await aiService.explainConcept(
          documentId,
          concept
        );

      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);

      setIsModalOpen(true);

      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-[28px] shadow-[0_20px_60px_rgba(37,99,235,0.08)] overflow-hidden">

        {/* Header */}
        <div className="px-7 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/40">
          <div className="flex items-center gap-4">

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BrainCircuit
                className="w-6 h-6 text-white"
                strokeWidth={2}
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Assistant
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Generate smart insights from your documents
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Summary Card */}
          <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/30 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/40 hover:border-blue-200">

            <div className="flex items-start justify-between gap-5">

              <div className="flex-1">

                {/* Top */}
                <div className="flex items-center gap-3 mb-3">

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen
                      className="w-5 h-5 text-blue-600"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Generate Summary
                    </h3>

                    <p className="text-xs text-slate-500">
                      AI-powered document overview
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600">
                  Get a concise and easy-to-understand summary
                  of the entire document instantly.
                </p>
              </div>

              {/* Button */}
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 h-11 px-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* Explain Concept */}
          <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/30 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/40 hover:border-indigo-200">

            <form onSubmit={handleExplainConcept}>

              {/* Top */}
              <div className="flex items-center gap-3 mb-3">

                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center">
                  <Lightbulb
                    className="w-5 h-5 text-indigo-600"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Explain a Concept
                  </h3>

                  <p className="text-xs text-slate-500">
                    Understand difficult topics easily
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-600 mb-5">
                Enter any topic or concept from your document
                and get a detailed AI explanation.
              </p>

              {/* Input */}
              <div className="flex items-center gap-3">

                <input
                  type="text"
                  value={concept}
                  onChange={(e) =>
                    setConcept(e.target.value)
                  }
                  placeholder="e.g., Capital Budgeting"
                  disabled={loadingAction === "explain"}
                  className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                />

                {/* Button */}
                <button
                  type="submit"
                  disabled={
                    loadingAction === "explain" ||
                    !concept.trim()
                  }
                  className="shrink-0 h-12 px-5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loadingAction === "explain" ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;