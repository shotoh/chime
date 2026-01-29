import { useState } from 'react';
import { Sound } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from './SearchableSelect';
import VariantSelect from './VariantSelect';
import { Trash2, GripVertical, Music } from 'lucide-react';
import { playSound } from '../utils';
import { SOUND_DEFINITIONS } from '../sounds';

interface Props { data: Sound; onChange: (s: Sound) => void; onDelete: () => void; id: string; }

const CONTROLS = [
  { label: 'VOL', field: 'volume', color: 'bg-blue-500', max: 2 },
  { label: 'PITCH', field: 'pitch', color: 'bg-green-500', max: 2 }
] as const;

export default function SoundNode({ data, onChange, onDelete, id }: Props) {
  const [playing, setPlaying] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1, zIndex: isDragging ? 999 : 'auto' };
  
  const handlePlay = () => {
    playSound(data, true);
    setPlaying(true);
    setTimeout(() => setPlaying(false), 100);
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 py-4 px-3 border-b border-[#2a2a2a] bg-[#141414] hover:bg-[#1a1a1a] transition-colors mb-1 rounded">
      <button {...attributes} {...listeners} className="text-[#444] hover:text-[#888] cursor-grab p-1 touch-none">
        <GripVertical size={16} />
      </button>

      <button onClick={handlePlay} className={`w-8 h-8 flex items-center justify-center rounded bg-[#222] hover:bg-blue-600 text-blue-500 hover:text-white border border-[#333] transition-all ${playing ? 'scale-90' : ''}`}>
        <Music size={14} />
      </button>

      <div className="flex-2 min-w-60">
        <SearchableSelect value={data.soundId} onChange={v => onChange({ ...data, soundId: v })} />
      </div>

      <VariantSelect value={data.seed} onChange={v => onChange({ ...data, seed: v })} variantCount={SOUND_DEFINITIONS[data.soundId] || 1} />

      <div className="flex items-center gap-2 bg-[#111] border border-[#333] rounded px-2 py-1.5 h-9 ml-auto focus-within:border-[#555]">
        <span className="text-[10px] text-gray-500 font-bold uppercase select-none">Delay</span>
        <input 
          type="number" min="0" placeholder="0" value={data.delay || ''} 
          onChange={e => onChange({ ...data, delay: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-12 bg-transparent text-right text-sm outline-none text-blue-400 font-mono no-spinner"
        />
      </div>

      <div className="flex items-center gap-6 flex-3 px-4">
        {CONTROLS.map(({ label, field, color, max }) => (
          <div key={field} className="flex flex-col flex-1 gap-1">
            <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase select-none">
              <span>{label}</span>
              <span>{Number(data[field]).toFixed(2)}</span>
            </div>
            <div className="relative w-full h-1.5 bg-[#333] rounded-lg">
              <div className={`absolute top-0 left-0 h-full rounded-lg ${color}`} style={{ width: `${(data[field] / max) * 100}%` }} />
              <input 
                type="range" min="0" max={max} step="0.05" value={data[field]} 
                onChange={e => onChange({ ...data, [field]: parseFloat(e.target.value) })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={onDelete} className="text-[#333] hover:text-red-500 p-2 ml-2 transition-colors"><Trash2 size={18} /></button>
    </div>
  );
}