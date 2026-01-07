/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { Group, GroupItemType, Sound } from '../types';
import SoundNode from './SoundNode';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MAX_NESTING_DEPTH, MAX_SOUND_LIMIT } from '../constants';
import { ChevronDown, ChevronRight, Trash2, GripVertical, ListMusic } from 'lucide-react';
import { playGroup, createDefaultGroup, createDefaultSound } from '../utils';

// Extracted styles to keep JSX clean
const ACTION_BTN_CLASS = "px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded hover:border-[#666] hover:bg-[#222] text-xs text-gray-300 font-bold uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#333] disabled:hover:bg-[#1a1a1a]";

interface Props {
  data: Group;
  onChange: (data: Group) => void;
  onDelete?: () => void;
  id: string; 
  depth?: number;
  totalSounds: number; 
}

export default function GroupNode({ data, onChange, onDelete, id, depth = 0, totalSounds }: Props) {
  const [expanded, setExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id, disabled: depth === 0, data: { type: 'group', group: data }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const updateList = (newItems: (Group | Sound)[]) => onChange({ ...data, items: newItems });

  const addItem = (type: GroupItemType) => {
    if (type === 'sound' && totalSounds >= MAX_SOUND_LIMIT) return;
    if (type === 'group' && depth >= MAX_NESTING_DEPTH) return;
    
    const newItem = type === 'sound' ? createDefaultSound() : createDefaultGroup();
    updateList([...data.items, newItem]);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playGroup(data);
  };

  const isRoot = depth === 0;
  const containerClass = isRoot ? "mb-12" : depth === 1 
    ? "bg-[#161616] border border-[#333] rounded-lg p-5 mb-4 shadow-lg"
    : "ml-6 pl-4 border-l-2 border-[#2a2a2a] mt-3";

  // Applied opacity logic to buttons individually
  const dimClass = depth > 0 ? "opacity-60 hover:opacity-100" : "";

  return (
    <div ref={setNodeRef} style={style} className={containerClass}>
      <div className={`flex items-center gap-3 ${isRoot ? 'mb-8 border-b border-[#333] pb-6' : 'mb-3'}`}>
        {!isRoot && (
           <button {...attributes} {...listeners} className="text-[#444] hover:text-[#888] cursor-grab touch-none">
             <GripVertical size={16} />
           </button>
        )}
        
        <button onClick={handlePlay} className="w-8 h-8 flex items-center justify-center rounded bg-[#222] hover:bg-green-600 text-green-500 hover:text-white transition-all border border-[#333]">
          <ListMusic size={14} fill="currentColor" />
        </button>

        {!isRoot && (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-500 hover:text-white w-6 h-6 flex items-center justify-center rounded hover:bg-[#222]">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}

        <input 
          value={data.name} 
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className={`bg-transparent outline-none text-gray-200 transition-colors flex-1 ${isRoot ? 'text-3xl font-bold' : 'font-semibold text-lg focus:border-b border-[#444]'}`}
          placeholder={isRoot ? "Profile Name" : "Group Name"}
        />

        <div className="flex items-center gap-4">
            {isRoot && (
              <span className={`text-sm font-mono ${totalSounds >= MAX_SOUND_LIMIT ? 'text-red-500' : 'text-gray-500'}`}>
                  {totalSounds} / {MAX_SOUND_LIMIT} Sounds
              </span>
            )}

            <button 
                onClick={() => onChange({ ...data, enabled: !data.enabled })}
                className={`px-3 py-1 text-xs font-bold uppercase rounded border transition-all ${data.enabled ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'}`}
            >
                {data.enabled ? 'Enabled' : 'Disabled'}
            </button>

            {!isRoot && onDelete && (
              <button onClick={onDelete} className="text-[#333] hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
              </button>
            )}
        </div>
      </div>

      {(expanded || isRoot) && (
        <div className="flex flex-col">
          <SortableContext items={data.items.map(i => i._id!)} strategy={verticalListSortingStrategy}>
            {data.items.map((item, i) => {
              const commonProps = {
                key: item._id,
                id: item._id!,
                data: item as any,
                onChange: (d: any) => {
                  const newItems = [...data.items];
                  newItems[i] = d;
                  updateList(newItems);
                },
                onDelete: () => updateList(data.items.filter((_, idx) => idx !== i))
              };

              return item.type === 'sound' 
                ? <SoundNode {...commonProps} />
                : <GroupNode {...commonProps} depth={depth + 1} totalSounds={totalSounds} />;
            })}
          </SortableContext>
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => addItem('sound')} 
              disabled={totalSounds >= MAX_SOUND_LIMIT} 
              className={`${ACTION_BTN_CLASS} ${dimClass}`}
            >
              + Add Sound
            </button>
            <button 
              onClick={() => addItem('group')} 
              disabled={depth >= MAX_NESTING_DEPTH} 
              className={`${ACTION_BTN_CLASS} ${dimClass}`}
            >
              + Add Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}