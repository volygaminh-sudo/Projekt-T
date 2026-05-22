'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { Hero, Role, TierRow, TierState, AppMode, UserRole, SavedTierList } from '@/types';
import { HEROES } from '@/data/heroes';
import TierListBoard from '@/components/TierListBoard';
import InventoryPanel from '@/components/InventoryPanel';
import ExportButton from '@/components/ExportButton';
import DraggableHeroIcon from '@/components/DraggableHeroIcon';

// Cấu hình ban đầu
const INITIAL_TIERS: TierRow[] = [
  { tier: 'S+', color: '#cc3300', bg: 'linear-gradient(135deg,#cc3300,#ff6b00)', heroes: [] },
  { tier: 'S',  color: '#8b1a00', bg: 'linear-gradient(135deg,#8b1a00,#d35400)', heroes: [] },
  { tier: 'A',  color: '#145200', bg: 'linear-gradient(135deg,#145200,#27ae60)', heroes: [] },
  { tier: 'B',  color: '#003666', bg: 'linear-gradient(135deg,#003666,#2980b9)', heroes: [] },
  { tier: 'C',  color: '#9a7d00', bg: 'linear-gradient(135deg,#9a7d00,#f1c40f)', heroes: [] },
  { tier: 'D',  color: '#222',    bg: 'linear-gradient(135deg,#222,#555)',        heroes: [] },
];

export default function Home() {
  const boardRef = useRef<HTMLDivElement>(null!);

  // Role and Mode State
  const [role, setRole] = useState<UserRole>('GUEST');
  const [mode, setMode] = useState<AppMode>('META');
  const [isLoaded, setIsLoaded] = useState(false);

  // App Data State
  const [dbHeroes, setDbHeroes] = useState<Hero[]>(HEROES);
  const [state, setState] = useState<TierState>({
    tiers: INITIAL_TIERS,
    inventory: HEROES,
  });

  // Fetch from Postgres
  useEffect(() => {
    const fetchDB = async () => {
      try {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const url = isLocal ? 'http://127.0.0.1:3008/api/heroes' : '/api/heroes';
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const fetchedHeroes: Hero[] = json.data.map((h: any) => ({
             id: String(h.id),
             name: h.name,
             role: h.primary_role || 'fighter',
             image: h.image_url || 'https://lienquan.garena.vn/wp-content/uploads/2024/02/zata.png'
          }));
          setDbHeroes(fetchedHeroes);
        }
      } catch (e) {
        console.error("Offline Fallback: Using cached HEROES.");
      }
    };
    fetchDB();
  }, []);

  const [activeHero, setActiveHero] = useState<Hero | null>(null);
  const [filterRole, setFilterRole] = useState<Role>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local Storage Keys
  const META_STORAGE_KEY = 'lienquan_meta_tier_list';
  const USER_STORAGE_KEY = 'lienquan_user_tier_list';

  // Load from local storage when mode or dbHeroes changes
  useEffect(() => {
    loadData(mode, dbHeroes);
    setIsLoaded(true);
  }, [mode, dbHeroes]);

  const loadData = (targetMode: AppMode, baseHeroes: Hero[]) => {
    const key = targetMode === 'META' ? META_STORAGE_KEY : USER_STORAGE_KEY;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: SavedTierList = JSON.parse(saved);
        // Tái tạo lại inventory bằng cách lấy tổng danh sách trừ đi tướng đã xếp hạng
        const usedIds = new Set<string>();
        parsed.tiers.forEach(t => t.heroes.forEach(h => usedIds.add(h.id)));
        
        const availableHeroes = baseHeroes.filter(h => !usedIds.has(h.id));
        
        setState({
          tiers: parsed.tiers,
          inventory: availableHeroes
        });
        return;
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    
    // Fallback if no data saved
    setState({ tiers: INITIAL_TIERS, inventory: baseHeroes });
  };

  const saveData = () => {
    const key = mode === 'META' ? META_STORAGE_KEY : USER_STORAGE_KEY;
    const data: SavedTierList = {
      tiers: state.tiers,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(data));
    alert(`Đã lưu ${mode === 'META' ? 'Bảng Meta Liên Quân' : 'Bảng tự xếp của bạn'} thành công!`);
  };

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const filteredInventory = state.inventory.filter(h => {
    const roleMatch = filterRole === 'all' || h.role === filterRole;
    const nameMatch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    return roleMatch && nameMatch;
  });

  // Có quyền Edit không? (Chỉ Admin mới được xếp Meta. Ai cũng được xếp Maker)
  const canEdit = mode === 'MAKER' || role === 'ADMIN';

  // ===== Drag handlers =====
  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (!canEdit) return;
    const { data } = event.active;
    setActiveHero(data.current?.hero ?? null);
  }, [canEdit]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!canEdit) return;
    const { active, over } = event;
    setActiveHero(null);

    if (!over) return;

    const activeData = active.data.current as { hero: Hero; isInTier: boolean };
    const overId = String(over.id);

    setState(prev => {
      const hero = activeData.hero;
      const fromTier = activeData.isInTier;

      let newTiers = prev.tiers.map(t => ({
        ...t,
        heroes: t.heroes.filter(h => h.id !== hero.id),
      }));
      let newInventory = prev.inventory.filter(h => h.id !== hero.id);

      // Drop on tier label
      if (overId.startsWith('tier__')) {
        const targetTierKey = overId.replace('tier__', '') as TierRow['tier'];
        newTiers = newTiers.map(t =>
          t.tier === targetTierKey ? { ...t, heroes: [...t.heroes, hero] } : t
        );
        return { tiers: newTiers, inventory: newInventory };
      }

      // Drop on sortable area
      if (overId.startsWith('sortable__')) {
        const targetHeroId = overId.replace('sortable__', '');
        for (let i = 0; i < newTiers.length; i++) {
          if (prev.tiers[i].heroes.some(h => h.id === targetHeroId)) {
            const oldIdx = prev.tiers[i].heroes.findIndex(h => h.id === hero.id);
            const newIdx = prev.tiers[i].heroes.findIndex(h => h.id === targetHeroId);
            if (oldIdx !== -1 && newIdx !== -1) {
              newTiers[i] = {
                ...newTiers[i],
                heroes: arrayMove([...prev.tiers[i].heroes], oldIdx, newIdx),
              };
            } else {
              newTiers[i] = { ...newTiers[i], heroes: [...newTiers[i].heroes, hero] };
            }
            return { tiers: newTiers, inventory: newInventory };
          }
        }
      }

      // Back to inventory
      newInventory = [...newInventory, hero];
      return { tiers: newTiers, inventory: newInventory };
    });
  }, [canEdit]);

  const handleReset = () => {
    if (confirm(`Đặt lại bảng về mặc định? Bạn sẽ mất dữ liệu chưa lưu.`)) {
      setState({ tiers: INITIAL_TIERS, inventory: dbHeroes });
      const key = mode === 'META' ? META_STORAGE_KEY : USER_STORAGE_KEY;
      localStorage.removeItem(key);
    }
  };

  if (!isLoaded) return null; // Avoid hydration mismatch
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans flex flex-col">
      {/* Background glow based on mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-700">
         {mode === 'META' ? (
           <>
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
           </>
         ) : (
           <>
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
           </>
         )}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black tracking-wider bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">⚔️</span> TIER LIST MAKER
            </h1>
          </div>

          <div className="flex items-center gap-6">
             {/* Mode Toggle Tabs */}
             <div className="flex bg-gray-900 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setMode('META')}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                    mode === 'META' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🌐 Bảng Meta
                </button>
                <button
                  onClick={() => setMode('MAKER')}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                    mode === 'MAKER' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ✨ Tự Xếp
                </button>
             </div>

             <div className="w-px h-8 bg-white/10"></div>

             {/* Mock Auth Select */}
             <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Đăng nhập:</span>
                <select 
                  title="Chọn quyền sử dụng"
                  aria-label="Đăng nhập"
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-gray-800 border border-white/10 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2 outline-none"
                >
                  <option value="GUEST">👤 Khách (User)</option>
                  <option value="ADMIN">👑 Admin</option>
                </select>
             </div>

          </div>
        </div>
      </header>
      
      {/* Toolbar */}
      <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-6 py-3 flex items-center justify-between border-b border-white/5 bg-black/10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded ${mode==='META' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-orange-900/50 text-orange-300'}`}>
              {mode === 'META' ? 'Đang bật: Bảng Meta Chính Thức' : 'Đang bật: Chế Độ Tự Xếp Bảng'}
            </span>
            {!canEdit && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                🔒 (Chỉ xem - Không có quyền kéo thả)
              </span>
            )}
            {role === 'ADMIN' && mode === 'META' && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                🔓 (Admin Mode: Kéo thả để cập nhật Meta)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
             <button
                onClick={handleReset}
                disabled={!canEdit}
                className={`px-4 py-2 rounded-lg border border-white/10 text-sm font-medium transition-all ${!canEdit ? 'opacity-30 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                🔄 Reset
              </button>
              
              <button
                onClick={saveData}
                disabled={!canEdit}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg ${
                  !canEdit 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : mode === 'META' 
                       ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                       : 'bg-orange-600 hover:bg-orange-500 text-white'
                }`}
              >
                💾 {mode === 'META' ? 'Lưu Meta Toàn Máy Chủ' : 'Lưu Danh Sách Của Tôi'}
              </button>
             
              <div className="w-px h-6 bg-white/10 mx-1"></div>
              <ExportButton boardId="tier-board" />
          </div>
      </div>

      {/* Main layout */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className={`relative z-10 max-w-screen-2xl mx-auto w-full px-4 py-8 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 flex-1 ${!canEdit ? 'grayscale-20' : ''}`}>
          
          <div className="relative">
             <TierListBoard tiers={state.tiers} boardRef={boardRef} />
             {!canEdit && (
               <div className="absolute inset-0 z-20" title="Chỉ Admin mới có thể sửa Bảng Meta"></div>
             )}
          </div>

          <div className="h-full relative min-h-[600px]">
            <InventoryPanel
              heroes={filteredInventory}
              onFilterChange={setFilterRole}
              onSearch={setSearchQuery}
            />
             {!canEdit && (
               <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl border border-white/5">
                 <div className="bg-gray-900 px-4 py-3 rounded-xl border border-white/10 text-center shadow-xl">
                   <span className="text-xl">🔒</span>
                   <p className="text-sm font-medium mt-1 text-gray-300">Tính năng bị khóa</p>
                   <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Hãy chuyển sang chế độ "Tự Xếp" nếu bạn muốn kéo thả tướng của riêng mình.</p>
                 </div>
               </div>
             )}
          </div>
        </main>

        <DragOverlay dropAnimation={null}>
          {activeHero && canEdit && (
            <div className="rotate-3 scale-110 cursor-grabbing drop-shadow-[0_20px_40px_rgba(255,165,0,0.4)]">
              <DraggableHeroIcon hero={activeHero} isInTier={false} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

    </div>
  );
}
