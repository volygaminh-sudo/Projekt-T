'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Trophy, Plus, ExternalLink, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MatchEvent {
  id: string;
  title: string;
  format: string;
  room_code: string;
  match_time: string;
  is_active: boolean;
}

export default function MatchCalendar() {
  const { user } = useUser();
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const isAnnouncer = user?.publicMetadata?.role === 'announcer';

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('match_events')
        .select('*')
        .order('match_time', { ascending: true });
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  const getCalendarLink = (event: MatchEvent) => {
    const startTime = new Date(event.match_time).toISOString().replace(/-|:|\.\d\d\d/g, "");
    // Add 1 hour duration
    const end = new Date(new Date(event.match_time).getTime() + 60 * 60 * 1000);
    const endTime = end.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(`Thể thức: ${event.format}\nMã phòng: ${event.room_code}`)}&location=Vercel+Projekt-T&sf=true&output=xml`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          LỊCH THI ĐẤU
        </h2>
        {isAnnouncer && (
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/40 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> THÊM LỊCH
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-500">
            <Calendar className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Hiện tại chưa có lịch thi đấu nào.</p>
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="group relative bg-slate-900/60 border border-white/5 rounded-2xl p-5 hover:border-amber-500/30 transition-all overflow-hidden shadow-xl">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors"></div>

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                         {evt.format}
                       </span>
                       <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(evt.match_time), 'HH:mm - dd/MM', { locale: vi })}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-3">
                       <div className="px-3 py-1 bg-slate-950 rounded-lg border border-white/5 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Room:</span>
                          <span className="text-xs font-mono text-blue-400 font-bold">{evt.room_code}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    <a 
                      href={getCalendarLink(evt)}
                      target="_blank"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                    >
                      <Bell className="w-4 h-4 text-amber-500" />
                      NHẮC TÔI
                    </a>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
