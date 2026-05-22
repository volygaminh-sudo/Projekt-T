'use client';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TierRow, Hero } from '@/types';
import DraggableHeroIcon from './DraggableHeroIcon';

// ===== SortableHero: wrapper re-orderable bên trong tier =====
function SortableHeroInTier({ hero }: { hero: Hero }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `sortable__${hero.id}`,
    data: { hero, isInTier: true },
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DraggableHeroIcon hero={hero} isInTier />
    </div>
  );
}

// ===== TierRow component =====
interface TierRowProps {
  row: TierRow;
  onLabelEdit?: (tier: string, newLabel: string) => void;
}

function TierRowComponent({ row }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `tier__${row.tier}` });

  return (
    <div
      className={`
        flex items-stretch min-h-[80px] rounded-lg overflow-hidden border
        ${isOver ? 'border-yellow-400/60 bg-white/5' : 'border-white/10'}
        transition-all duration-150
      `}
    >
      {/* Tier Label */}
      <div
        className="flex items-center justify-center font-black text-2xl text-white min-w-[70px] w-[70px] shrink-0"
        style={{ background: row.bg }}
      >
        {row.tier}
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex flex-wrap gap-2 p-3 flex-1 items-center
          ${isOver ? 'bg-yellow-400/5' : ''}
          transition-colors min-h-[80px]
        `}
      >
        <SortableContext
          items={row.heroes.map(h => `sortable__${h.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {row.heroes.map(hero => (
            <SortableHeroInTier key={hero.id} hero={hero} />
          ))}
        </SortableContext>

        {/* Empty placeholder */}
        {row.heroes.length === 0 && (
          <span className="text-gray-600 text-sm italic select-none">
            Kéo tướng vào đây...
          </span>
        )}
      </div>
    </div>
  );
}

// ===== TierListBoard =====
interface Props {
  tiers: TierRow[];
  boardRef: React.RefObject<HTMLDivElement>;
}

export default function TierListBoard({ tiers, boardRef }: Props) {
  return (
    <div
      ref={boardRef}
      className="flex flex-col gap-2 p-4 rounded-xl bg-gray-900/80 backdrop-blur-sm border border-white/10"
      id="tier-board"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-lg tracking-wider uppercase">
          🏆 Tier List — Liên Quân Mobile
        </h2>
      </div>

      {/* Rows */}
      {tiers.map(row => (
        <TierRowComponent key={row.tier} row={row} />
      ))}
    </div>
  );
}
