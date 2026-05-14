import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  BookOpen,
  BrainCircuit,
  Clock,
} from "lucide-react";
import moment from "moment";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-5">

          {/* Icon */}
          <div className="shrink-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-300">
            <FileText
              className="w-7 h-7 text-white"
              strokeWidth={2}
            />
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <Trash2
              className="w-4 h-4"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-slate-900 line-clamp-2 mb-3 tracking-tight"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* File Size */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          {document.fileSize !== undefined && (
            <span className="font-medium">
              {formatFileSize(document.fileSize)}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">

          {document.flashcardCount !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">

              <BookOpen
                className="w-4 h-4 text-indigo-600"
                strokeWidth={2}
              />

              <span className="text-xs font-semibold text-indigo-700">
                {document.flashcardCount} Flashcards
              </span>
            </div>
          )}

          {document.quizCount !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">

              <BrainCircuit
                className="w-4 h-4 text-cyan-600"
                strokeWidth={2}
              />

              <span className="text-xs font-semibold text-cyan-700">
                {document.quizCount} Quizzes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-100">

        <div className="flex items-center gap-2 text-xs text-slate-500">

          <Clock
            className="w-3.5 h-3.5"
            strokeWidth={2}
          />

          <span>
            Uploaded {moment(document.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </div>
  );
};

export default DocumentCard;