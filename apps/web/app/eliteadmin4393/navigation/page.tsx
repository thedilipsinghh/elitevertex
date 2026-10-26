"use client";

import { useState } from "react";
import {
  useGetAdminNavigationQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useReorderMenuItemsMutation,
} from "@/lib/features/api/apiSlice";

interface NavItem {
  id: string;
  menuId: string;
  parentId?: string | null;
  label: string;
  url: string;
  position: number;
  isVisible: boolean;
  openInNewTab: boolean;
}

interface NavMenu {
  id: string;
  location: string;
  name: string;
  items: NavItem[];
}

export default function AdminNavigationPage() {
  const { data: response, isLoading } = useGetAdminNavigationQuery(undefined);
  const menus: NavMenu[] = response?.data || [];
  const [createItem] = useCreateMenuItemMutation();
  const [updateItem] = useUpdateMenuItemMutation();
  const [deleteItem] = useDeleteMenuItemMutation();
  const [reorderItems] = useReorderMenuItemsMutation();

  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ label: "", url: "", parentId: "" });

  const current = menus.find((m) => m.location === activeLocation) || menus[0];
  const location = current?.location;

  const includeIds = (items: NavItem[], item: NavItem): string[] => [
    item.id,
    ...items.filter((i) => i.parentId === item.id).map((i) => i.id),
  ];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    await createItem({
      location,
      label: newItem.label,
      url: newItem.url,
      parentId: newItem.parentId || null,
    });
    setNewItem({ label: "", url: "", parentId: "" });
  };

  const handleDelete = async (item: NavItem) => {
    if (confirm(`Delete menu item "${item.label}" and its children?`)) {
      await deleteItem(item.id);
    }
  };

  const move = async (item: NavItem, dir: -1 | 1) => {
    if (!current) return;
    const siblings = current.items
      .filter((i) => (i.parentId || null) === (item.parentId || null))
      .sort((a, b) => a.position - b.position);
    const index = siblings.findIndex((i) => i.id === item.id);
    const target = index + dir;
    if (target < 0 || target >= siblings.length) return;
    const next = [...siblings];
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;

    // Send full global order: top-level items interleaved with their children.
    const ordered: string[] = [];
    const topLevel = current.items
      .filter((i) => !i.parentId)
      .sort((a, b) => a.position - b.position);
    const orderedTop = topLevel.map((t) => (next.find((n) => n.id === t.id) || t));
    for (const top of orderedTop) {
      ordered.push(...includeIds(current.items, top));
    }
    await reorderItems(ordered);
  };

  if (isLoading) return <p className="text-on-surface-variant">Loading navigation...</p>;

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Navigation</h1>
        <p className="text-body-md text-on-surface-variant">
          Manage the header and footer menus. Items support one level of nested children.
        </p>
      </div>

      {menus.length > 1 && (
        <div className="flex gap-space-sm">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveLocation(m.location)}
              className={`px-space-md py-space-xs rounded-lg font-label-md capitalize transition-colors ${
                location === m.location
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {m.name || m.location}
            </button>
          ))}
        </div>
      )}

      {!current ? (
        <p className="text-on-surface-variant">No menus configured.</p>
      ) : (
        <>
          <form
            onSubmit={handleAdd}
            className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant grid grid-cols-1 md:grid-cols-4 gap-space-sm items-end"
          >
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-on-surface">Label</span>
              <input
                required
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
                placeholder="e.g. Blog"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-on-surface">URL</span>
              <input
                required
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
                placeholder="/blog"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-on-surface">Parent (optional)</span>
              <select
                value={newItem.parentId}
                onChange={(e) => setNewItem({ ...newItem, parentId: e.target.value })}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="">Top level</option>
                {current.items
                  .filter((i) => !i.parentId)
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
              </select>
            </label>
            <button
              type="submit"
              className="bg-primary text-on-primary px-space-lg py-3 rounded-lg font-label-md"
            >
              + Add Item
            </button>
          </form>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant flex flex-col gap-space-sm">
            <h3 className="font-headline-sm text-primary capitalize mb-2">{current.name || location} Menu</h3>
            {current.items.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm">No items yet.</p>
            ) : (
              <ul className="flex flex-col gap-space-sm">
                {current.items
                  .filter((i) => !i.parentId)
                  .sort((a, b) => a.position - b.position)
                  .map((item, index, arr) => {
                    const children = current.items
                      .filter((c) => c.parentId === item.id)
                      .sort((a, b) => a.position - b.position);
                    return (
                      <li key={item.id} className="flex flex-col gap-space-sm">
                        <NavRow
                          item={item}
                          isFirst={index === 0}
                          isLast={index === arr.length - 1}
                          onMove={(d) => move(item, d)}
                          onDelete={() => handleDelete(item)}
                          onToggle={() => updateItem({ itemId: item.id, isVisible: !item.isVisible })}
                        />
                        {children.length > 0 && (
                          <ul className="ml-8 flex flex-col gap-space-sm border-l-2 border-outline-variant pl-space-md">
                            {children.map((child) => (
                              <li key={child.id}>
                                <NavRow
                                  item={child}
                                  isFirst
                                  isLast
                                  onMove={() => {}}
                                  onDelete={() => handleDelete(child)}
                                  onToggle={() => updateItem({ itemId: child.id, isVisible: !child.isVisible })}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NavRow({
  item,
  isFirst,
  isLast,
  onMove,
  onDelete,
  onToggle,
}: {
  item: NavItem;
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [url, setUrl] = useState(item.url);
  const [updateItem] = useUpdateMenuItemMutation();

  const save = async () => {
    await updateItem({ itemId: item.id, label, url });
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
      {editing ? (
        <>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="bg-surface-container p-2 rounded-lg text-on-surface flex-1 min-w-0"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-surface-container p-2 rounded-lg text-on-surface flex-1 min-w-0"
          />
          <button onClick={save} className="text-secondary font-label-sm">Save</button>
          <button onClick={() => setEditing(false)} className="text-on-surface-variant font-label-sm">Cancel</button>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">drag_indicator</span>
          <span className={`font-label-lg ${item.isVisible ? "text-on-surface" : "text-on-surface-variant line-through"}`}>
            {item.label}
          </span>
          <span className="text-label-sm text-on-surface-variant truncate">{item.url}</span>
          <div className="ml-auto flex items-center gap-space-sm shrink-0">
            <button onClick={() => onMove(-1)} disabled={isFirst} className="text-on-surface-variant disabled:opacity-30" title="Move up">
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
            <button onClick={() => onMove(1)} disabled={isLast} className="text-on-surface-variant disabled:opacity-30" title="Move down">
              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            </button>
            <button onClick={onToggle} className="text-on-surface-variant" title="Toggle visibility">
              <span className="material-symbols-outlined text-[18px]">{item.isVisible ? "visibility" : "visibility_off"}</span>
            </button>
            <button onClick={() => setEditing(true)} className="text-primary font-label-sm">Edit</button>
            <button onClick={onDelete} className="text-error font-label-sm">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
