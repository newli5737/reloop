import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Send, MessageCircle } from 'lucide-react';
import { api, Conversation, ChatMessage, formatPrice, timeAgo } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  const loadConversations = async () => {
    try {
      const data = await api.messages.getConversations();
      setConversations(data);
    } catch {
      toast.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const data = await api.messages.getMessages(convId);
      setMessages(data);
      loadConversations();
    } catch {
      toast.error('Không thể tải cuộc trò chuyện');
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
    else setMessages([]);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !newMessage.trim()) return;
    setSending(true);
    try {
      const msg = await api.messages.send(activeId, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
      loadConversations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gửi thất bại');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Tin nhắn
        </h1>

        <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[480px]">
          {/* Conversation list */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 font-semibold text-sm text-slate-400">
              Cuộc trò chuyện ({conversations.length})
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="p-4 text-slate-400 text-sm">Đang tải...</p>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  Chưa có tin nhắn nào
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSearchParams({ id: conv.id })}
                    className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-all ${
                      activeId === conv.id ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {conv.listing.images[0] && (
                        <img src={conv.listing.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm truncate">{conv.otherUser.name}</span>
                          {conv.unread > 0 && (
                            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{conv.listing.title}</p>
                        {conv.lastMessage && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage.content}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            {!activeId || !activeConv ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Chọn cuộc trò chuyện để bắt đầu
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  {activeConv.listing.images[0] && (
                    <img src={activeConv.listing.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-semibold">{activeConv.otherUser.name}</p>
                    <p className="text-xs text-slate-400">
                      {activeConv.listing.title} · {formatPrice(activeConv.listing.price)}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                            isMine
                              ? 'bg-emerald-500 text-navy rounded-br-md'
                              : 'bg-white/10 text-white rounded-bl-md'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMine ? 'text-navy/60' : 'text-slate-500'}`}>
                            {timeAgo(msg.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2.5 bg-emerald-500 text-navy rounded-xl font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
