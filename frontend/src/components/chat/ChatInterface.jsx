import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  Sparkles,
  Bot,
} from "lucide-react";

import { useParams } from "react-router-dom";

import aiService from "../../services/aiService";

import { useAuth } from "../../context/AuthContext";

import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();

  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] =
    useState(true);

  const messagesEndRef = useRef(null);

  // Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Fetch Chat History
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);

        const response =
          await aiService.getChatHistory(documentId);

        setHistory(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch chat history:",
          error
        );
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);

    setMessage("");

    setLoading(true);

    try {
      const response = await aiService.chat(
        documentId,
        userMessage.content
      );

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks:
          response.data.relevantChunks,
      };

      setHistory((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setHistory((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Render Messages
  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-5 ${
          isUser ? "justify-end" : ""
        }`}
      >
        {/* AI Avatar */}
        {!isUser && (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
            <Bot
              className="w-5 h-5 text-white"
              strokeWidth={2}
            />
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`max-w-xl px-5 py-4 rounded-3xl shadow-sm ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md shadow-lg shadow-blue-500/20"
              : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">
              {msg.content}
            </p>
          ) : (
            <div className="prose prose-sm max-w-none prose-slate">
              <MarkdownRenderer
                content={msg.content}
              />
            </div>
          )}
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0 shadow-sm">
            {user?.username
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  // Loading Screen
  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white border border-slate-200 rounded-[28px] items-center justify-center shadow-[0_20px_60px_rgba(37,99,235,0.08)]">

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
          <MessageSquare
            className="w-8 h-8 text-white"
            strokeWidth={2}
          />
        </div>

        <Spinner />

        <p className="text-sm text-slate-500 mt-4 font-medium">
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white border border-slate-200 rounded-[28px] shadow-[0_20px_60px_rgba(37,99,235,0.08)] overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/40">

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles
              className="w-5 h-5 text-white"
              strokeWidth={2}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Chat Assistant
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Ask questions about your document
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-gradient-to-br from-slate-50/40 via-white to-blue-50/20">

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-xl shadow-blue-500/20">
              <MessageSquare
                className="w-10 h-10 text-white"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Start a Conversation
            </h3>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Ask anything related to the uploaded
              document and get AI-powered answers
              instantly.
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {/* AI Typing */}
        {loading && (
          <div className="flex items-center gap-3 my-5">

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
              <Bot
                className="w-5 h-5 text-white"
                strokeWidth={2}
              />
            </div>

            <div className="flex items-center gap-2 px-5 py-4 rounded-3xl rounded-bl-md bg-white border border-slate-200 shadow-sm">

              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: "0ms",
                  }}
                ></span>

                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: "150ms",
                  }}
                ></span>

                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: "300ms",
                  }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-slate-200 bg-white">

        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3"
        >

          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="flex-1 h-12 px-5 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
          />

          <button
            type="submit"
            disabled={
              loading || !message.trim()
            }
            className="shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center"
          >
            <Send
              className="w-5 h-5"
              strokeWidth={2}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;