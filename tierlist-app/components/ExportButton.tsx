'use client';
import React, { useState } from 'react';

interface Props {
  boardId: string; // ID của HTML element cần chụp
}

export default function ExportButton({ boardId }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setDone(false);

    try {
      // Dynamic import để tránh SSR error
      const html2canvas = (await import('html2canvas')).default;

      const element = document.getElementById(boardId);
      if (!element) {
        alert('Không tìm thấy bảng tier list!');
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#111827',  // gray-900
        scale: 2,                    // 2x resolution
        useCORS: true,               // cho phép load ảnh cross-origin
        allowTaint: false,
        logging: false,
      });

      // Tạo download link
      const link = document.createElement('a');
      link.download = `lienquan-tierlist-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Xuất ảnh thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
        transition-all duration-200 shadow-lg
        ${done
          ? 'bg-green-600 hover:bg-green-500 text-white scale-105'
          : loading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black hover:scale-105 hover:shadow-yellow-400/30'
        }
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Đang xuất...
        </>
      ) : done ? (
        <>✅ Đã lưu ảnh!</>
      ) : (
        <>📷 Xuất Ảnh PNG</>
      )}
    </button>
  );
}
