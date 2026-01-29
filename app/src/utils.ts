/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Group, Sound } from './types';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { SOUND_DEFINITIONS, SOUND_LIST } from './sounds';

// --- Audio Engine ---
class AudioEngine {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();

  private getContext() {
    return this.ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async play(sound: Sound, forceImmediate = false) {
    if (!sound.enabled) return;

    // Variant Logic
    const count = SOUND_DEFINITIONS[sound.soundId] || 0;
    let file = sound.soundId;
    if (count > 1) {
      const variant = sound.seed === 0 
        ? Math.floor(Math.random() * count) + 1 
        : Math.min(Math.max(sound.seed, 1), count);
      file = `${sound.soundId}${variant}`;
    }

    const buffer = await this.load(file);
    if (!buffer) return;

    const ctx = this.getContext();
    if (ctx.state === 'suspended') await ctx.resume();

    const src = ctx.createBufferSource();
    const gain = ctx.createGain();

    src.buffer = buffer;
    src.playbackRate.value = Math.max(0.01, sound.pitch);
    gain.gain.value = Math.max(0, sound.volume);
    
    src.connect(gain).connect(ctx.destination);
    src.start(ctx.currentTime + (forceImmediate ? 0 : sound.delay * 0.05));
  }

  private async load(id: string) {
    if (this.buffers.has(id)) return this.buffers.get(id)!;
    try {
      const res = await fetch(`/sounds/${id}.ogg`);
      if (!res.ok) throw new Error(`Missing: ${id}`);
      const buf = await this.getContext().decodeAudioData(await res.arrayBuffer());
      this.buffers.set(id, buf);
      return buf;
    } catch (e) { console.error(e); return null; }
  }
}

const engine = new AudioEngine();
export const playSound = (s: Sound, immediate = false) => engine.play(s, immediate);

export const playGroup = (g: Group) => {
  if (g.enabled) g.items.forEach(i => i.type === 'sound' ? playSound(i as Sound) : playGroup(i as Group));
};

// --- Tree Helpers ---
export const createId = () => uuidv4();

export const createDefaultSound = (): Sound => ({
  _id: createId(), type: 'sound', soundId: SOUND_LIST[0], 
  delay: 0, volume: 1, pitch: 1, seed: 0, enabled: true
});

export const createDefaultGroup = (name = 'New Group'): Group => ({
  _id: createId(), type: 'group', name, enabled: true, items: []
});

export const ensureIds = (g: Group): Group => ({
  ...g, _id: g._id || createId(),
  items: g.items.map(i => i.type === 'group' ? ensureIds({ ...i } as Group) : { ...i, _id: i._id || createId() })
});

export const stripIds = (g: Group): Group => {
  const { _id, ...rest } = g;
  return {
    ...rest,
    items: g.items.map(i => i.type === 'group' ? stripIds(i as Group) : (({ _id, ...r }) => r)(i))
  } as Group;
};

export const reorderRecursive = (g: Group, active: string, over: string): Group => {
  const oldIdx = g.items.findIndex(i => i._id === active);
  const newIdx = g.items.findIndex(i => i._id === over);
  
  if (oldIdx !== -1 && newIdx !== -1) {
    return { ...g, items: arrayMove(g.items, oldIdx, newIdx) };
  }
  
  return {
    ...g,
    items: g.items.map(i => i.type === 'group' ? reorderRecursive(i as Group, active, over) : i)
  };
};

export const countTotalSounds = (g: Group): number => 
  g?.items?.reduce((acc, i) => acc + (i.type === 'sound' ? 1 : countTotalSounds(i as Group)), 0) ?? 0;