/* eslint-disable @typescript-eslint/no-unused-vars */
import { Group, Sound } from './types';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

// --- Factories ---

export const createId = () => uuidv4();

export const createDefaultSound = (): Sound => ({
  _id: createId(),
  type: 'sound',
  soundId: 'block.note_block.pling',
  delay: 0,
  volume: 1,
  pitch: 1,
  seed: 0,
  enabled: true
});

export const createDefaultGroup = (name = 'New Group'): Group => ({
  _id: createId(),
  type: 'group',
  name,
  enabled: true,
  items: []
});

// --- Tree Manipulation ---

export const ensureIds = (group: Group): Group => {
  if (!group._id) group._id = createId();
  group.items = group.items.map(item => {
    if (item.type === 'group') return ensureIds({ ...item } as Group);
    return { ...item, _id: item._id || createId() };
  });
  return group;
};

export const stripIds = (group: Group): Group => {
  const { _id, ...rest } = group;
  return {
    ...rest,
    items: group.items.map(item => {
      if (item.type === 'group') return stripIds(item as Group);
      const { _id, ...soundRest } = item;
      return soundRest;
    })
  } as Group;
};

export const reorderRecursive = (group: Group, activeId: string, overId: string): Group => {
  const activeIndex = group.items.findIndex(i => i._id === activeId);
  const overIndex = group.items.findIndex(i => i._id === overId);

  if (activeIndex !== -1 && overIndex !== -1) {
    return { ...group, items: arrayMove(group.items, activeIndex, overIndex) };
  }

  return {
    ...group,
    items: group.items.map(item => 
      item.type === 'group' ? reorderRecursive(item as Group, activeId, overId) : item
    )
  };
};

export const countTotalSounds = (group: Group): number => {
  if (!group?.items) return 0;
  return group.items.reduce((acc, item) => 
    acc + (item.type === 'sound' ? 1 : countTotalSounds(item as Group)), 0);
};

// --- Playback ---

export const playSound = (sound: Sound, forceImmediate = false) => {
  if (!sound.enabled) return;
  const delayMs = forceImmediate ? 0 : sound.delay * 50;
  setTimeout(() => {
    console.log(`🎵 Playing: ${sound.soundId} | Vol: ${sound.volume.toFixed(2)} | Delay: ${delayMs}ms`);
  }, delayMs);
};

export const playGroup = (group: Group) => {
  if (!group.enabled) return;
  group.items.forEach(item => 
    item.type === 'sound' ? playSound(item as Sound) : playGroup(item as Group)
  );
};