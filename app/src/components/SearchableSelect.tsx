import { useState } from 'react';
import { SOUND_LIST } from '../sounds';
import { useClickOutside } from '../hooks';

interface Props { value: string; onChange: (val: string) => void; }

export default function SearchableSelect({ value, onChange }: Props) {
  const { isOpen, setIsOpen, ref } = useClickOutside(false);
  const [search, setSearch] = useState('');

  const filtered = SOUND_LIST.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        className="flex justify-between items-center bg-[#111] border border-[#333] hover:border-[#555] rounded px-3 py-2 cursor-pointer"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
      >
        <span className="text-sm text-gray-200 truncate select-none">{value || "Select Sound..."}</span>
        <span className="text-[#666] text-xs">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-[#333] rounded shadow-xl max-h-60 overflow-hidden flex flex-col">
          <input
            autoFocus
            className="w-full bg-[#111] border-b border-[#333] p-2 text-sm text-white outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="overflow-y-auto flex-1">
            {filtered.length ? filtered.map(s => (
              <div 
                key={s}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#333] ${s === value ? 'text-blue-400 bg-[#222]' : 'text-gray-300'}`}
                onClick={() => { onChange(s); setIsOpen(false); }}
              >
                {s}
              </div>
            )) : <div className="p-3 text-xs text-gray-500 text-center">No matches</div>}
          </div>
        </div>
      )}
    </div>
  );
}