import { useState, useRef, useEffect } from 'react';
import { SOUND_LIST } from '../sounds';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchableSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = SOUND_LIST.filter(s => 
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className="flex items-center justify-between bg-[#111] border border-[#333] hover:border-[#555] rounded px-3 py-2 cursor-pointer transition-colors"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
      >
        <span className="text-sm text-gray-200 truncate select-none">
          {value || "Select Sound..."}
        </span>
        <span className="text-[#666] text-xs">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-[#333] rounded shadow-xl max-h-60 overflow-hidden flex flex-col">
          <input
            autoFocus
            className="w-full bg-[#111] border-b border-[#333] p-2 text-sm text-white outline-none"
            placeholder="Search sounds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="overflow-y-auto flex-1">
            {filtered.length > 0 ? filtered.map(s => (
              <div 
                key={s}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#333] ${s === value ? 'text-blue-400 bg-[#222]' : 'text-gray-300'}`}
                onClick={() => { onChange(s); setIsOpen(false); }}
              >
                {s}
              </div>
            )) : (
              <div className="p-3 text-xs text-gray-500 text-center">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}