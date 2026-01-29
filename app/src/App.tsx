/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useMemo, Component, ReactNode } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { createProfile, getProfile, updateProfile, deleteProfile } from "./api";
import GroupNode from "./components/GroupNode";
import { ProfileDTO, StoredProfile, Group } from "./types";
import { ensureIds, stripIds, countTotalSounds, reorderRecursive, createDefaultGroup } from "./utils";
import { SAVE_TIMEOUT_MS } from "./constants";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string }> {
  state = { error: "" };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() { return this.state.error ? <div className="p-10 text-red-500">{this.state.error}</div> : this.props.children; }
}

const STORAGE_KEY = "chime_profiles";

function AppContent() {
  const [profiles, setProfiles] = useState<StoredProfile[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [activeProfile, setActiveProfile] = useState<ProfileDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<number>(0);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)), [profiles]);

  const totalSounds = useMemo(() => activeProfile ? countTotalSounds(activeProfile.rootGroup) : 0, [activeProfile]);

  const save = (p: ProfileDTO) => {
    setActiveProfile(p);
    clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(async () => {
      const stored = profiles.find(x => x.id === p.id);
      if (stored) await updateProfile(p.id, stored.token, { name: p.name, rootGroup: stripIds(p.rootGroup) });
      setSaving(false);
    }, SAVE_TIMEOUT_MS);
  };

  const actions = {
    create: async () => {
      try {
        const { profile, token } = await createProfile();
        setProfiles(prev => [...prev, { id: profile.id, name: profile.name, token }]);
        setActiveProfile({ ...profile, rootGroup: ensureIds(profile.rootGroup) });
      } catch (e: any) { alert(e.message); }
    },
    load: async (id: string) => {
      if (!id) return setActiveProfile(null);
      try {
        const p = await getProfile(id);
        setActiveProfile({ ...p, rootGroup: ensureIds(p.rootGroup || createDefaultGroup("Root")) });
      } catch (e: any) { alert(e.message); }
    },
    delete: async () => {
      if (!activeProfile || !confirm(`Delete "${activeProfile.name}"?`)) return;
      const stored = profiles.find(p => p.id === activeProfile.id);
      if (stored) {
        await deleteProfile(activeProfile.id, stored.token);
        setProfiles(p => p.filter(x => x.id !== activeProfile.id));
        setActiveProfile(null);
      }
    },
    updateRoot: (rootGroup: Group) => {
      if (!activeProfile) return;
      if (rootGroup.name !== activeProfile.name) {
        setProfiles(p => p.map(x => x.id === activeProfile.id ? { ...x, name: rootGroup.name } : x));
      }
      save({ ...activeProfile, name: rootGroup.name, rootGroup });
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!activeProfile || !over || active.id === over.id) return;
    actions.updateRoot(reorderRecursive(activeProfile.rootGroup, active.id as string, over.id as string));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-300 font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-[#222] pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-widest text-[#888] uppercase">Chime</h1>
            <span className="text-xs text-[#555]">Profile Manager</span>
          </div>

          <div className="flex gap-4 items-center">
            {saving && <span className="text-xs text-blue-400 animate-pulse">Saving...</span>}
            
            <select 
              className="bg-[#111] border border-[#333] rounded px-3 py-1.5 text-sm outline-none"
              value={activeProfile?.id || ""} onChange={(e) => actions.load(e.target.value)}
            >
              <option value="">Load Profile...</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <button onClick={actions.create} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold">+ NEW</button>
            
            {activeProfile && (
              <button onClick={actions.delete} className="bg-[#1a1a1a] border border-[#333] hover:text-red-500 text-[#555] px-3 py-1.5 rounded">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </header>

        {activeProfile ? (
          <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
            <GroupNode id="root-group" data={activeProfile.rootGroup} onChange={actions.updateRoot} totalSounds={totalSounds} />
          </DndContext>
        ) : (
          <div className="h-64 border-2 border-dashed border-[#222] rounded-lg flex items-center justify-center text-[#444]">
            Select or create a profile
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <ErrorBoundary><AppContent /></ErrorBoundary>;
}