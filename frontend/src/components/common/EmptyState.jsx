import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({
  onActionClick,
  title,
  description,
  buttonText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border border-blue-100 rounded-[28px] shadow-[0_10px_40px_rgba(37,99,235,0.08)]">

      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-6 shadow-xl shadow-blue-500/20">

        <FileText
          className="w-10 h-10 text-white"
          strokeWidth={2}
        />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 mb-8 max-w-md leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="group relative inline-flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 overflow-hidden"
        >

          <span className="relative z-10 flex items-center gap-2">
            <Plus
              className="w-4 h-4"
              strokeWidth={2.5}
            />
            {buttonText}
          </span>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;