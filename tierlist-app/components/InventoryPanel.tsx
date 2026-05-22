'use client';
import React, { useState } from 'react';
import { Hero, Role } from '@/types';
import { ROLE_LABELS, ROLE_COLORS, ROLE_ICONS } from '@/data/heroes';
import DraggableHeroIcon from './DraggableHeroIcon';

interface Props {
  heroes: Hero[];  // already filtered main list
  onFilterChange: (role: Role) => void;
  onSearch: (q: string) => void;
}

const ALL_ROLES: Role[] = ['all', 'assassin', 'fighter', 'mage', 'marksman', 'support', 'tank'];

export default function InventoryPanel({ heroes, onFilterChange, onSearch }: Props) {
  const [activeRole, setActiveRole] = useState<Role>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleClick = (role: Role) => {
    setActiveRole(role);
    onFilterChange(role);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/10 h-full">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🎮</span>
        <h3 className="text-white font-bold text-base tracking-wide">Danh Sách Tướng</h3>
        <span className="ml-auto text-gray-400 text-xs bg-gray-800 px-2 py-0.5 rounded-full">
          {heroes.length} tướng
        </span>
      </div>

      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Tìm tên tướng..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-white text-sm
                     placeholder:text-gray-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); onSearch(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Role filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_ROLES.map(role => (
          <button
            key={role}
            onClick={() => handleRoleClick(role)}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
              border transition-all duration-150
              ${activeRole === role
                ? `${ROLE_COLORS[role]} border-transparent text-white scale-105 shadow-lg`
                : 'bg-gray-800 border-white/10 text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            <span>{ROLE_ICONS[role]}</span>
            <span>{ROLE_LABELS[role]}</span>
          </button>
        ))}
      </div>

      {/* Hero grid - scrollable */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1" style={{ minHeight: 0 }}>
        <div className="flex flex-wrap gap-2 content-start">
          {heroes.length > 0 ? (
            heroes.map(hero => (
              <DraggableHeroIcon key={hero.id} hero={hero} isInTier={false} />
            ))
          ) : (
            <div className="w-full text-center py-10 text-gray-500 text-sm">
              Không tìm thấy tướng nào.<br />
              <span className="text-xs">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
