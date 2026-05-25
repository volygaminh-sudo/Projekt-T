import { UserButton } from "@clerk/nextjs";
import ChatRoom from "@/components/Community/ChatRoom";
import MatchCalendar from "@/components/Community/MatchCalendar";
import { Users, LayoutDashboard, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#0a0c13] text-slate-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0c13]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Trang chủ</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <h1 className="font-black italic text-xl tracking-tighter flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              COMMUNITY<span className="text-amber-500"> HUB</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="/admin" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-tighter">Admin panel</span>
             </Link>
             <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Calendar Section (Left on Desktop, Top on Mobile) */}
          <div className="lg:col-span-7 space-y-8">
             <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
                <MatchCalendar />
             </div>
          </div>

          {/* Chat Section (Right on Desktop) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <ChatRoom />
              
              {/* Rules / Tip Card */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 border-dashed">
                <p className="text-[10px] uppercase font-black text-amber-500/60 tracking-[0.2em] mb-2 px-1">Quy tắc cộng đồng</p>
                <ul className="text-[11px] text-slate-500 space-y-1 ml-4 list-disc marker:text-amber-500/50">
                  <li>Tôn trọng người chơi khác.</li>
                  <li>Admin (Announcer) có quyền xóa nội dung vi phạm.</li>
                  <li>Dùng tag @ để nhắc tên đồng đội.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
