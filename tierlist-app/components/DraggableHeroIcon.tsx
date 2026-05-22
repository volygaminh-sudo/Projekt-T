'use client';
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Hero } from '@/types';
import Image from 'next/image';

interface Props {
  hero: Hero;
  isInTier?: boolean;
}

export default function DraggableHeroIcon({ hero, isInTier = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${hero.id}__${isInTier ? 'tier' : 'inventory'}`,
    data: { hero, isInTier },
  });

  const style: React.CSSProperties = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 9999 }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      title={hero.name}
      className={`
        group relative flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing
        select-none touch-none
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
        ${isInTier ? 'w-14 h-14' : 'w-16 h-16'}
        transition-transform duration-150
      `}
    >
      {/* Avatar circle */}
      <div
        className={`
          relative rounded-lg overflow-hidden border-2 border-transparent
          group-hover:border-yellow-400 group-hover:scale-110 group-hover:shadow-lg
          group-hover:shadow-yellow-400/30 transition-all duration-200
          ${isInTier ? 'w-12 h-12' : 'w-14 h-14'}
          bg-gray-800
        `}
      >
        <Image
          src={hero.image}
          alt={hero.name}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback: hiển thị chữ cái đầu nếu ảnh lỗi
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
          unoptimized
        />
        {/* Fallback initial */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-gray-700 to-gray-900">
          {hero.name.charAt(0)}
        </div>
      </div>

      {/* Name label */}
      {!isInTier && (
        <span className="text-[9px] text-gray-300 text-center font-medium leading-tight max-w-[60px] truncate">
          {hero.name}
        </span>
      )}

      {/* Hover tooltip cho tier view */}
      {isInTier && (
        <div className="
          absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px]
          whitespace-nowrap px-2 py-0.5 rounded pointer-events-none opacity-0
          group-hover:opacity-100 transition-opacity z-50 border border-yellow-400/30
        ">
          {hero.name}
        </div>
      )}
    </div>
  );
}
