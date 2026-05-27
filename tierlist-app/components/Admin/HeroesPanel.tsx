'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BASE_URL } from '@/hooks/useApi';
import type { HeroAdmin } from '@/types/admin';
import heroesData from '../../data/heroesData';

// ─── Constants ───────────────────────────────────────────────────────────────
const API_URL = `${BASE_URL}/heroes`;
const ROLE_OPTIONS = [
  { value: 'assassin', label: '🗡️ Sát Thủ' },
  { value: 'fighter',  label: '⚔️ Đấu Sĩ'  },
  { value: 'marksman', label: '🏹 Xạ Thủ'  },
  { value: 'mage',     label: '🔮 Pháp Sư'  },
  { value: 'tank',     label: '🛡️ Đỡ Đòn'  },
  { value: 'support',  label: '💚 Trợ Thủ'  },
];
const TIER_OPTIONS = ['splus','s','a','b','c','d'];
const TIER_LABELS: Record<string, string> = { splus:'S+', s:'S', a:'A', b:'B', c:'C', d:'D' };
const TIER_COLORS: Record<string, string> = {
  splus: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  s:     'bg-red-500/20 text-red-400 border-red-500/30',
  a:     'bg-green-500/20 text-green-400 border-green-500/30',
  b:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  c:     'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  d:     'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SKILL_KEYS = ['p', '1', '2', '3'] as const;
type SkillKey = typeof SKILL_KEYS[number];

const SKILL_LABELS: Record<SkillKey, string> = { p:'Nội tại', '1':'Kỹ năng 1', '2':'Kỹ năng 2', '3':'Chiêu cuối' };

const PAGE_SIZES = [10, 20, 50, 100];

function ImagePreview({ src }: { src: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(!!src), [src]);
  if (!visible) return null;
  return <img src={src} alt="preview" onError={() => setVisible(false)} className="mt-2 w-20 h-20 rounded-xl object-cover ring-1 ring-white/10" />;
}

// ─── Modal: Add/Edit Hero ─────────────────────────────────────────────────────
const DEFAULT_FORM: Partial<HeroAdmin> = {
  name: '', primary_role: 'assassin', secondary_role: '', tier: 'a',
  win_rate: '', pick_rate: '', ban_rate: '', counters: '',
  image_url: '', story: '', skins: '',
};
const DEFAULT_SKILL = { name: '', desc: '', img: '' };

function HeroModal({
  hero, onClose, onSaved, showToast
}: {
  hero: HeroAdmin | null;
  onClose: () => void;
  onSaved: () => void;
  showToast: (msg: string, type?: 'success'|'error'|'warning') => void;
}) {
  const [form, setForm] = useState<Partial<HeroAdmin>>(DEFAULT_FORM);
  const [skills, setSkills] = useState<Record<SkillKey, { name: string; desc: string; img: string }>>(
    { p: {...DEFAULT_SKILL}, '1': {...DEFAULT_SKILL}, '2': {...DEFAULT_SKILL}, '3': {...DEFAULT_SKILL} }
  );
  const [saving, setSaving] = useState(false);
  const isEdit = !!hero;

  // Populate form when editing
  useEffect(() => {
    if (hero) {
      setForm({ ...hero });
      const parsed: Record<SkillKey, { name: string; desc: string; img: string }> = {} as any;
      SKILL_KEYS.forEach(k => {
        const raw = hero[`skill_${k}` as keyof HeroAdmin] as string || '';
        const colonIdx = raw.indexOf(':');
        parsed[k] = {
          name: colonIdx !== -1 ? raw.slice(0, colonIdx).trim() : '',
          desc: colonIdx !== -1 ? raw.slice(colonIdx + 1).trim() : raw,
          img:  (hero[`skill_${k}_img` as keyof HeroAdmin] as string) || '',
        };
      });
      setSkills(parsed);
    } else {
      setForm({ ...DEFAULT_FORM });
      setSkills({ p: {...DEFAULT_SKILL}, '1': {...DEFAULT_SKILL}, '2': {...DEFAULT_SKILL}, '3': {...DEFAULT_SKILL} });
    }
  }, [hero]);

  const set = (key: keyof HeroAdmin, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const setSkill = (k: SkillKey, field: 'name'|'desc'|'img', val: string) =>
    setSkills(prev => ({ ...prev, [k]: { ...prev[k], [field]: val } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const buildSkill = (k: SkillKey) => {
      const s = skills[k];
      if (s.name && s.desc) return `${s.name}: ${s.desc}`;
      return s.name || s.desc;
    };
    const payload = {
      ...form,
      [`skill_p`]: buildSkill('p'), [`skill_p_img`]: skills.p.img,
      [`skill_1`]: buildSkill('1'), [`skill_1_img`]: skills['1'].img,
      [`skill_2`]: buildSkill('2'), [`skill_2_img`]: skills['2'].img,
      [`skill_3`]: buildSkill('3'), [`skill_3_img`]: skills['3'].img,
    };
    try {
      const res = await fetch(isEdit ? `${API_URL}/${hero!.id}` : API_URL, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(isEdit ? `✅ Đã cập nhật ${form.name}!` : `✅ Đã thêm ${form.name}!`);
      onSaved();
      onClose();
    } catch {
      showToast('❌ Lưu thất bại, kiểm tra server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-8 py-5 flex justify-between items-center z-10">
          <h2 className="text-xl font-black">{isEdit ? '✏️ Chỉnh Sửa Tướng' : '➕ Thêm Tướng Mới'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tên tướng *</label>
            <input value={form.name||''} onChange={e => set('name', e.target.value)} required
              placeholder="VD: Airi, Yena, Thane..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50" />
          </div>

          {/* Roles + Tier */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Vai trò chính *</label>
              <select title="Vai trò chính" value={form.primary_role||'assassin'} onChange={e => set('primary_role', e.target.value)} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50">
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Vai trò phụ</label>
              <select title="Vai trò phụ" value={form.secondary_role||''} onChange={e => set('secondary_role', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50">
                <option value="">Không có</option>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tier *</label>
              <select title="Tier" value={form.tier||'a'} onChange={e => set('tier', e.target.value)} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50">
                {TIER_OPTIONS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {(['win_rate','pick_rate','ban_rate'] as const).map(k => (
              <div key={k}>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{k.replace('_',' ')}</label>
                <input value={(form[k] as string)||''} onChange={e => set(k, e.target.value)}
                  placeholder="VD: 51.2%" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50" />
              </div>
            ))}
          </div>

          {/* Counters */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tướng khắc chế</label>
            <input value={form.counters||''} onChange={e => set('counters', e.target.value)}
              placeholder="Florentino, Hayate, Thane" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50" />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Link Hình Ảnh</label>
            <input type="url" value={form.image_url||''} onChange={e => set('image_url', e.target.value)}
              placeholder="https://lienquan.garena.vn/..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50" />
            <ImagePreview src={form.image_url||''} />
          </div>

          {/* Story */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tiểu sử</label>
            <textarea value={form.story||''} onChange={e => set('story', e.target.value)} rows={3}
              placeholder="Câu chuyện về nhân vật..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50 resize-none" />
          </div>

          {/* Skills */}
          {SKILL_KEYS.map(k => (
            <div key={k} className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-black text-yellow-400 uppercase tracking-widest">⚔️ {SKILL_LABELS[k]}</label>
              <input value={skills[k].name} onChange={e => setSkill(k, 'name', e.target.value)}
                placeholder={`Tên ${SKILL_LABELS[k]}`} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-yellow-400/50" />
              <textarea value={skills[k].desc} onChange={e => setSkill(k, 'desc', e.target.value)} rows={2}
                placeholder="Chi tiết..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-yellow-400/50 resize-none" />
              <input type="url" value={skills[k].img} onChange={e => setSkill(k, 'img', e.target.value)}
                placeholder="Link ảnh kỹ năng" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-yellow-400/50" />
              <ImagePreview src={skills[k].img} />
            </div>
          ))}

          {/* Skins */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">👗 Trang Phục</label>
            <textarea value={form.skins||''} onChange={e => set('skins', e.target.value)} rows={3}
              placeholder="Mặc định | https://linkanh1.jpg, Siêu Việt | https://linkanh2.jpg..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50 resize-none" />
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all disabled:opacity-50">
            {saving ? '⏳ Đang lưu...' : '💾 Lưu Lại'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Heroes Table ─────────────────────────────────────────────────────────────
export default function HeroesPanel({ showToast }: { showToast: (msg: string, type?: 'success'|'error'|'warning') => void }) {
  const [all, setAll]           = useState<HeroAdmin[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editHero, setEditHero] = useState<HeroAdmin | null | 'new'>('new'); // null=closed, 'new'=add, HeroAdmin=edit
  const [modalOpen, setModalOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setAll(json.data.sort((a: HeroAdmin, b: HeroAdmin) => a.name.localeCompare(b.name, 'vi')));
    } catch {
      showToast('❌ Lỗi kết nối server!', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return all.filter(h =>
      (!s || h.name.toLowerCase().includes(s)) &&
      (!roleFilter || h.primary_role === roleFilter || h.secondary_role === roleFilter) &&
      (!tierFilter || (h.tier || '').toLowerCase() === tierFilter)
    );
  }, [all, search, roleFilter, tierFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 on filter change
  useEffect(() => setPage(1), [search, roleFilter, tierFilter, pageSize]);

  const deleteHero = async (id: number, name: string) => {
    if (!window.confirm(`⚠️ Xóa tướng "${name}"?\nHành động này không thể hoàn tác!`)) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) { showToast(`🗑️ Đã xóa ${name}!`, 'warning'); load(); }
    } catch { showToast('❌ Xóa thất bại!', 'error'); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error();
      showToast(`⏳ Đang nhập ${data.length} tướng...`);
      let ok = 0;
      for (const h of data) {
        const r = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(h) });
        if (r.ok) ok++;
      }
      showToast(`✅ Nhập ${ok}/${data.length} tướng thành công!`);
      load();
    } catch { showToast('❌ File JSON không hợp lệ!', 'error'); }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* ─── KHO TƯỚNG (VISUAL GRID) ─────────────────── */}
      <div className="bg-black/40 border border-white/5 rounded-[40px] p-10 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-[10px]">Quản lý chiến thuật</span>
            <h2 className="text-4xl font-black italic uppercase text-white mt-1">Kho Tướng <span className="text-gray-600">PROJEKT-T</span></h2>
          </div>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            {heroesData.length} Vị Tướng
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 max-h-[500px] overflow-y-auto pr-4 custom-scroll">
          {heroesData.map((hero, idx) => (
            <div key={idx} className="group relative cursor-pointer">
              <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-2 transition-all duration-300 group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:-translate-y-1">
                <div className="aspect-4/5 bg-black/40 rounded-xl overflow-hidden mb-3 relative">
                  <img src={hero.avatar} alt={hero.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-1 right-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black border ${
                      hero.tier === 'S+' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      hero.tier === 'S' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      hero.tier === 'A' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {hero.tier}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{hero.name}</div>
                  <div className="text-[8px] text-gray-500 font-bold uppercase">{hero.lane} • {hero.class}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input 
              title="Tìm kiếm tướng"
              value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tướng theo tên..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-yellow-400/50" />
          </div>
          <select title="Lọc vai trò" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50">
            <option value="">Tất cả vai trò</option>
            {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select title="Lọc tier" value={tierFilter} onChange={e => setTierFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50">
            <option value="">Tất cả Tier</option>
            {TIER_OPTIONS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400">{filtered.length} tướng</span>
          <input type="file" title="Import JSON" accept=".json" ref={fileRef} onChange={handleImport} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-sm">
            📂 Import JSON
          </button>
          <button onClick={() => { setEditHero(null); setModalOpen(true); }}
            className="px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-sm shadow-lg shadow-yellow-400/20">
            ➕ Thêm Tướng Mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/2 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              {['ID','Ảnh','Tên Tướng','Role Chính','Role Phụ','Tier','Hành Động'].map(h => (
                <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500 font-bold">
                <span className="inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-3 align-middle" />
                Đang tải...
              </td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500 font-bold">Không tìm thấy tướng nào.</td></tr>
            ) : paged.map(hero => (
              <tr key={hero.id} className="hover:bg-white/3 transition-colors group">
                <td className="px-5 py-4 font-mono text-xs text-gray-600">{hero.id}</td>
                <td className="px-5 py-4">
                  <img src={hero.image_url || '/img/unnamed.webp'} alt={hero.name} onError={e => { (e.target as HTMLImageElement).src = '/img/unnamed.webp'; }}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:scale-110 transition-transform" />
                </td>
                <td className="px-5 py-4 font-black text-white">{hero.name}</td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase text-gray-400">
                    {ROLE_OPTIONS.find(r => r.value === hero.primary_role)?.label || hero.primary_role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {hero.secondary_role
                    ? <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase text-gray-400">
                        {ROLE_OPTIONS.find(r => r.value === hero.secondary_role)?.label || hero.secondary_role}
                      </span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-black ${TIER_COLORS[hero.tier || 'c'] || TIER_COLORS.c}`}>
                    {TIER_LABELS[hero.tier || 'c'] || hero.tier?.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditHero(hero); setModalOpen(true); }}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-sm">✏️</button>
                    <button onClick={() => deleteHero(hero.id, hero.name)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-white/10 transition-all">◀ Trước</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-black transition-all ${p === page ? 'bg-yellow-400 text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-white/10 transition-all">Sau ▶</button>
        </div>
        <select title="Số hàng mỗi trang" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 outline-none text-sm">
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / trang</option>)}
        </select>
      </div>

      {/* Modal */}
      {modalOpen && (
        <HeroModal
          hero={editHero === null || editHero === 'new' ? null : editHero}
          onClose={() => setModalOpen(false)}
          onSaved={load}
          showToast={showToast}
        />
      )}
    </div>
  );
}
