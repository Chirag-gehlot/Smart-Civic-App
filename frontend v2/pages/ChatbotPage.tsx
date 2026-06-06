import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Plus, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   TYPES
============================================================ */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: Date;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/chat/history");
        if (res.data.success) {
          setChatSessions(
            res.data.chats.map((c: any) => ({
              id: c._id,
              title: c.title || "Untitled Chat",
              updatedAt: new Date(c.updatedAt),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = async (chatId: string) => {
    if (chatId === activeChatId) return;

    setActiveChatId(chatId);
    setMessages([]);
    setMessagesLoading(true);

    try {
      const res = await axiosInstance.get(`/chat/${chatId}/messages`);
      if (res.data.success) {
        setMessages(
          res.data.messages.map((m: any) => ({
            id: m._id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.createdAt),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setInput("");
  };

  const createChatIfNeeded = async (firstMessage: string) => {
    const res = await axiosInstance.post("/chat/create-chat");

    if (!res.data.success) {
      throw new Error("Failed to create chat");
    }

    const id = res.data.chatId;
    setActiveChatId(id);

    const newSession: ChatSession = {
      id,
      title: firstMessage.slice(0, 40),
      updatedAt: new Date(),
    };
    setChatSessions((prev) => [newSession, ...prev]);

    return id;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const content = input.trim();
    setInput("");

    let chatId = activeChatId;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      if (!chatId) {
        chatId = await createChatIfNeeded(content);
      }

      const res = await axiosInstance.post(`/chat/${chatId}/query`, {
        query: content,
      });

      if (!res.data.success) {
        throw new Error("Failed to get AI response");
      }

      const aiMessage: Message = {
        id: `msg_ai_${Date.now()}`,
        role: "assistant",
        content: res.data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      setChatSessions((prev) => {
        const updated = prev.map((c) =>
          c.id === chatId ? { ...c, updatedAt: new Date() } : c
        );
        return updated.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
      });
    } catch (err: any) {
      console.error("Send message error:", err.response?.data || err.message);
      const errorMessage: Message = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "Something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex overflow-hidden bg-[#ffffff] font-sans"
      style={{ height: "calc(100vh - 60px)" }}>
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-[#fdfdfd] border-r border-[#E5E7EB] flex flex-col z-10 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex gap-2 justify-center items-center bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-2xl transition-all font-semibold shadow-[0_2px_8px_rgba(79,70,229,0.15)] hover:shadow-[0_4px_12px_rgba(79,70,229,0.25)]">
            <Plus size={18} />
            New Chat
          </button>
        </div>

        <div className="px-5 pb-2 mt-2">
          <p className="text-[11px] text-[#6B7280] uppercase tracking-widest font-bold">
            Chat History
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {historyLoading ? (
            <div className="flex justify-center mt-6">
              <Loader2 size={20} className="text-[#4F46E5] animate-spin" />
            </div>
          ) : chatSessions.length === 0 ? (
            <p className="text-sm text-[#9CA3AF] text-center mt-6 px-4">
              No chats yet. Start a conversation!
            </p>
          ) : (
            chatSessions.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`p-3 rounded-2xl mb-1 flex items-start gap-3 cursor-pointer transition-all ${
                  chat.id === activeChatId
                    ? "bg-[#EEF2FF] text-[#3730A3]"
                    : "hover:bg-[#F3F4F6] text-[#4B5563]"
                }`}>
                <MessageSquare
                  size={14}
                  className={`mt-1 shrink-0 ${chat.id === activeChatId ? "text-[#4F46E5]" : "text-[#9CA3AF]"}`}
                />
                <div className="overflow-hidden">
                  <p className="text-[13px] font-semibold truncate leading-tight">
                    {chat.title}
                  </p>
                  <p className="text-[11px] opacity-70 mt-1">
                    {chat.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ================= MAIN CHAT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#FAFAFA]">
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-4">
          {messagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={32} className="text-[#4F46E5] animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {loading && (
                  <motion.div
                    key="typing-indicator"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                    layout
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* INPUT */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          loading={loading}
        />
      </main>
    </div>
  );
};

/* ============================================================
   SUB COMPONENTS
============================================================ */

const messageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`flex mb-5 w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        style={
          isUser
            ? {
                background: '#4F46E5', // Brand primary color
                color: '#ffffff',
                borderRadius: '18px 18px 4px 18px',
                padding: '12px 18px',
                maxWidth: '70%',
                fontSize: '0.95rem',
                lineHeight: '1.55',
                boxShadow: '0 2px 8px rgba(79,70,229,0.15)',
              }
            : {
                background: '#F3F4F6', // Light gray background
                color: '#111827',
                borderRadius: '18px 18px 18px 4px',
                padding: '12px 18px',
                maxWidth: '70%',
                fontSize: '0.95rem',
                lineHeight: '1.55',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }
        }
      >
        <p style={{ fontSize: '0.75rem', color: isUser ? '#C7D2FE' : '#9CA3AF', marginBottom: '4px', fontWeight: 600 }}>
          {isUser ? 'You' : 'Assistant'}
        </p>
        <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-6">
    <div
      style={{
        display: 'flex',
        gap: '6px',
        padding: '16px 20px',
        background: '#F3F4F6',
        borderRadius: '18px 18px 18px 4px',
        width: 'fit-content',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#9CA3AF',
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  </div>
);

const ChatInput = ({
  value,
  onChange,
  onSend,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-4 py-4 md:px-8 md:pb-8 z-20">
      <div className="max-w-3xl mx-auto">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            padding: '12px 16px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #F3F4F6',
          }}
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type your message..."
            style={{
              flex: 1,
              resize: 'none',
              border: '1.5px solid #E5E7EB',
              borderRadius: '16px',
              padding: '14px 18px',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              lineHeight: '1.5',
              maxHeight: '140px',
              overflowY: 'auto',
              color: '#111827',
              backgroundColor: '#FAFAFA'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4F46E5';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.backgroundColor = '#FAFAFA';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={onSend}
            disabled={loading || !value.trim()}
            style={{
              background: loading || !value.trim() ? '#E5E7EB' : '#4F46E5',
              color: loading || !value.trim() ? '#9CA3AF' : '#fff',
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              height: '52px',
              width: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease-out',
            }}
            onMouseEnter={(e) => {
              if (!loading && value.trim()) {
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="Send"
          >
            <Send size={20} className={!loading && value.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="h-full flex items-center justify-center text-center">
    <div className="max-w-md">
      <div className="w-16 h-16 bg-[#EEF2FF] text-[#4F46E5] rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 shadow-sm border border-[#E0E7FF]">
        <MessageSquare size={32} />
      </div>
      <h1 className="text-2xl font-bold mb-3 text-[#111827]">CivicTrust Law Assistant</h1>
      <p className="text-[#6B7280] leading-relaxed">
        Ask legal and civic questions with confidence.
        <br />
        Start typing below to begin.
      </p>
    </div>
  </div>
);

export default ChatbotPage;
