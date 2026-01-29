/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Group, GroupItemType, Sound } from '../types';
import SoundNode from './SoundNode';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MAX_NESTING_DEPTH, MAX_SOUND_LIMIT } from '../constants';
import { ChevronDown, ChevronRight, Trash2, GripVertical, ListMusic } from 'lucide-react';
import { playGroup, createDefaultGroup, createDefaultSound } from '../utils';

const BTN_BASE = "px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-xs font-bold uppercase tracking-wide transition-all";
const BTN_ACTIVE = "hover:border-[#666] hover:bg-[#222] text-gray-300";
const BTN_DISABLED = "opacity-30 cursor-not-allowed";

interface Props { data: Group; onChange: (g: Group) => void; onDelete?: () => void; id: string; depth?: number; totalSounds: number; }

export default function GroupNode({ data, onChange, onDelete, id, depth = 0, totalSounds }: Props) {
  const [expanded, setExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id, disabled: depth === 0, data: { type: 'group', group: data }
  });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1, zIndex: isDragging ? 999 : 'auto' };

  const updateItems = (items: (Group | Sound)[]) => onChange({ ...data, items });
  
  const addItem = (type: GroupItemType) => {
    if (type === 'sound' && totalSounds >= MAX_SOUND_LIMIT) return;
    if (type === 'group' && depth >= MAX_NESTING_DEPTH) return;
    updateItems([...data.items, type === 'sound' ? createDefaultSound() : createDefaultGroup()]);
  };

  const isRoot = depth === 0;
  const containerClass = isRoot ? "mb-12" : depth === 1 ? "bg-[#161616] border border-[#333] rounded-lg p-5 mb-4 shadow-lg" : "ml-6 pl-4 border-l-2 border-[#2a2a2a] mt-3";

  return (
    <div ref={setNodeRef} style={style} className={containerClass}>
      <div className={`flex items-center gap-3 ${isRoot ? 'mb-8 border-b border-[#333] pb-6' : 'mb-3'}`}>
        {!isRoot && (
           <button {...attributes} {...listeners} className="text-[#444] hover:text-[#888] cursor-grab touch-none"><GripVertical size={16} /></button>
        )}
        
        <button onClick={(e) => { e.stopPropagation(); playGroup(data); }} className="w-8 h-8 flex items-center justify-center rounded bg-[#222] hover:bg-green-600 text-green-500 hover:text-white border border-[#333] transition-all">
          <ListMusic size={14} fill="currentColor" />
        </button>

        {!isRoot && (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-500 hover:text-white w-6 h-6 flex items-center justify-center rounded hover:bg-[#222]">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}

        <input 
          value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })}
          className={`bg-transparent outline-none text-gray-200 flex-1 ${isRoot ? 'text-3xl font-bold' : 'font-semibold text-lg focus:border-b border-[#444]'}`}
          placeholder={isRoot ? "Profile Name" : "Group Name"}
        />

        <div className="flex items-center gap-4">
            {isRoot && <span className={`text-sm font-mono ${totalSounds >= MAX_SOUND_LIMIT ? 'text-red-500' : 'text-gray-500'}`}>{totalSounds} / {MAX_SOUND_LIMIT} Sounds</span>}
            <button 
                onClick={() => onChange({ ...data, enabled: !data.enabled })}
                className={`px-3 py-1 text-xs font-bold uppercase rounded border transition-all ${data.enabled ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'}`}
            >
                {data.enabled ? 'Enabled' : 'Disabled'}
            </button>
            {!isRoot && onDelete && <button onClick={onDelete} className="text-[#333] hover:text-red-400"><Trash2 size={18} /></button>}
        </div>
      </div>

      {(expanded || isRoot) && (
        <div className="flex flex-col">
          <SortableContext items={data.items.map(i => i._id!)} strategy={verticalListSortingStrategy}>
            {data.items.map((item, i) => {
              const props = {
                key: item._id, id: item._id!, data: item as any,
                onChange: (d: any) => { const list = [...data.items]; list[i] = d; updateItems(list); },
                onDelete: () => updateItems(data.items.filter((_, idx) => idx !== i))
              };
              return item.type === 'sound' ? <SoundNode {...props} /> : <GroupNode {...props} depth={depth + 1} totalSounds={totalSounds} />;
            })}
          </SortableContext>
          
          <div className="flex gap-3 mt-4">
            <button onClick={() => addItem('sound')} disabled={totalSounds >= MAX_SOUND_LIMIT} className={`${BTN_BASE} ${totalSounds >= MAX_SOUND_LIMIT ? BTN_DISABLED : BTN_ACTIVE}`}>+ Add Sound</button>
            <button onClick={() => addItem('group')} disabled={depth >= MAX_NESTING_DEPTH} className={`${BTN_BASE} ${depth >= MAX_NESTING_DEPTH ? BTN_DISABLED : BTN_ACTIVE}`}>+ Add Group</button>
          </div>
        </div>
      )}
    </div>
  );
}