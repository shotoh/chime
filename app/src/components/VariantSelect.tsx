import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '../hooks';

interface Props { value: number; onChange: (v: number) => void; variantCount: number; }

export default function VariantSelect({ value, onChange, variantCount }: Props) {
  const { isOpen, setIsOpen, ref } = useClickOutside(false);
  
  if (variantCount <= 1) return null;

  return (
    <div className="relative" ref={ref}>
      <div 
        className="flex items-center gap-2 bg-[#111] border border-[#333] hover:border-[#555] rounded px-2 py-1.5 h-9 w-20 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[10px] text-gray-500 font-bold uppercase select-none">Var</span>
        <div className="flex-1 text-right text-sm text-purple-400 font-mono flex justify-end items-center gap-1">
          {value} <ChevronDown size={12} className="text-gray-600 group-hover:text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-20 bg-[#1a1a1a] border border-[#333] rounded shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
          {[0, ...Array.from({ length: variantCount }, (_, i) => i + 1)].map((num) => (
            <div key={num}>
              {num === 1 && <div className="h-px bg-[#333] mx-1" />}
              <div 
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#333] font-mono ${value === num ? 'text-purple-400 bg-[#222]' : 'text-gray-400'}`}
                onClick={() => { onChange(num); setIsOpen(false); }}
              >
                {num}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}