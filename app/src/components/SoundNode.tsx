import { useState } from 'react';
import { Sound } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from './SearchableSelect';
import { Trash2, GripVertical, Music } from 'lucide-react';
import { playSound } from '../utils';

interface Props {
  data: Sound;
  onChange: (data: Sound) => void;
  onDelete: () => void;
  id: string; 
}

export default function SoundNode({ data, onChange, onDelete, id }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const handlePlay = () => {
    playSound(data, true);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 100);
  };

  const updateField = (field: keyof Sound, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-4 py-4 px-3 border-b border-[#2a2a2a] bg-[#141414] hover:bg-[#1a1a1a] transition-colors mb-1 rounded"
    >
      <button {...attributes} {...listeners} className="text-[#444] hover:text-[#888] cursor-grab p-1 touch-none">
        <GripVertical size={16} />
      </button>

      <button 
        onClick={handlePlay}
        style={{ transform: isPlaying ? 'scale(0.9)' : 'scale(1)' }}
        className="w-8 h-8 flex items-center justify-center rounded bg-[#222] hover:bg-blue-600 text-blue-500 hover:text-white transition-all border border-[#333]"
      >
        <Music size={14} />
      </button>

      <div className="flex-2 min-w-60">
        <SearchableSelect value={data.soundId} onChange={(v) => updateField('soundId', v)} />
      </div>

      <div className="flex items-center gap-2 bg-[#111] border border-[#333] rounded px-2 py-1.5 h-9">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Delay</span>
        <input 
          type="number" min="0" value={data.delay} 
          onChange={(e) => updateField('delay', Math.max(0, parseInt(e.target.value) || 0))}
          className="w-12 bg-transparent text-right text-sm outline-none text-blue-400 font-mono"
        />
      </div>

      <div className="flex items-center gap-6 flex-3 px-4">
        {[
          { label: 'VOL', field: 'volume', color: 'blue' },
          { label: 'PITCH', field: 'pitch', color: 'green' }
        ].map((control) => (
          <div key={control.field} className="flex flex-col flex-1 gap-1">
            <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
              <span>{control.label}</span>
              <span>{Number(data[control.field as keyof Sound]).toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="2" step="0.05" 
              value={Number(data[control.field as keyof Sound])} 
              onChange={(e) => updateField(control.field as keyof Sound, parseFloat(e.target.value))}
              className={`w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-${control.color}-400 [&::-webkit-slider-thumb]:bg-${control.color}-500`}
            />
          </div>
        ))}
      </div>

      <button onClick={onDelete} className="text-[#333] hover:text-red-500 p-2 ml-2 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );
}