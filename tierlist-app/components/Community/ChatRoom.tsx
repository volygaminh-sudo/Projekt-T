'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Send, Shield, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  text: string;
  role: string;
  created_at: string;
}

export default function ChatRoom() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:community_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const role = (user.publicMetadata?.role as string) || 'member';

    const newMessage = {
      user_id: user.id,
      user_name: user.fullName || user.username || 'Anonymous',
      user_avatar: user.imageUrl,
      text: input,
      role: role,
    };

    const { error } = await supabase.from('community_messages').insert([newMessage]);
    if (error) console.error('Error sending message:', error);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] border border-white/10 rounded-2xl bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          PHÒNG CHAT TỔNG
        </h3>
        <span className="text-xs text-slate-400 font-medium">Băng thông Realtime • Đang trực tuyến</span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
            <img src={msg.user_avatar} alt="avatar" className="w-8 h-8 rounded-full border border-white/20 shadow-md flex-shrink-0" />
            <div className={`max-w-[80%] space-y-1 ${msg.user_id === user?.id ? 'items-end flex flex-col' : ''}`}>
              <div className="flex items-center gap-1.5 px-1">
                <span className={`text-xs font-bold ${msg.role === 'announcer' ? 'text-amber-400' : 'text-slate-300'}`}>
                  {msg.user_name}
                </span>
                {msg.role === 'announcer' && (
                  <div className="bg-amber-400/10 p-0.5 rounded border border-amber-400/20" title="Announcer">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                  </div>
                )}
                <span className="text-[10px] text-slate-500">{format(new Date(msg.created_at), 'HH:mm')}</span>
              </div>
              <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                msg.user_id === user?.id 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-tr-none font-medium' 
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập lời nhắn cho cộng đồng..."
          className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 p-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-500/20"
          disabled={!input.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
