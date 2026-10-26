import { Request, Response, NextFunction } from "express";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../config/db";
import { navigationMenus, navigationItems } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logAudit } from "../lib/audit";

const itemSchema = z.object({
  label: z.string().min(1).max(255),
  url: z.string().min(1).max(2000),
  isVisible: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

type NavItemRow = typeof navigationItems.$inferSelect;

const buildTree = (items: NavItemRow[]) => {
  const byParent = new Map<string | null, NavItemRow[]>();
  for (const item of items) {
    const key = item.parentId || null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(item);
  }
  const mapNode = (item: NavItemRow): any => ({
    id: item.id,
    label: item.label,
    url: item.url,
    openInNewTab: item.openInNewTab,
    children: (byParent.get(item.id) || []).map(mapNode),
  });
  return (byParent.get(null) || []).map(mapNode);
};

// === ADMIN ===

export const listMenus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const menus = await db.query.navigationMenus.findMany({
      with: { items: { orderBy: [asc(navigationItems.position)] } },
    });
    return res.status(200).json({ success: true, data: menus });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, String(req.params.location)),
    });
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }
    const existing = await db.query.navigationItems.findMany({
      where: eq(navigationItems.menuId, menu.id),
    });
    const maxPos = existing.reduce((m: number, i: any) => Math.max(m, i.position), 0);
    const [created] = await db
      .insert(navigationItems)
      .values({
        menuId: menu.id,
        parentId: parsed.data.parentId ?? null,
        label: parsed.data.label,
        url: parsed.data.url,
        position: maxPos + 1,
        isVisible: parsed.data.isVisible ?? true,
        openInNewTab: parsed.data.openInNewTab ?? false,
      })
      .returning();
    await db.update(navigationMenus).set({ updatedAt: new Date() }).where(eq(navigationMenus.id, menu.id));
    await logAudit(req.admin, "create", "navigation_item", created.id, { location: req.params.location });
    return res.status(201).json({ success: true, message: "Menu item created", data: created });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = itemSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.label !== undefined) set.label = parsed.data.label;
    if (parsed.data.url !== undefined) set.url = parsed.data.url;
    if (parsed.data.isVisible !== undefined) set.isVisible = parsed.data.isVisible;
    if (parsed.data.openInNewTab !== undefined) set.openInNewTab = parsed.data.openInNewTab;
    if (parsed.data.parentId !== undefined) set.parentId = parsed.data.parentId;
    const updated = await db
      .update(navigationItems)
      .set(set)
      .where(eq(navigationItems.id, String(req.params.itemId)))
      .returning();
    if (!updated[0]) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    await logAudit(req.admin, "update", "navigation_item", String(req.params.itemId));
    return res.status(200).json({ success: true, message: "Menu item updated", data: updated[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.navigationItems.findFirst({
      where: eq(navigationItems.id, String(req.params.itemId)),
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    // Also remove direct children (one level of nesting supported)
    const children = await db.query.navigationItems.findMany({
      where: eq(navigationItems.parentId, existing.id),
    });
    for (const child of children) {
      await db.delete(navigationItems).where(eq(navigationItems.id, child.id));
    }
    await db.delete(navigationItems).where(eq(navigationItems.id, existing.id));
    await logAudit(req.admin, "delete", "navigation_item", String(req.params.itemId));
    return res.status(200).json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    next(error);
  }
};

export const reorderMenuItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = z.object({ itemIds: z.array(z.string().uuid()).min(1) }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    for (let i = 0; i < parsed.data.itemIds.length; i++) {
      await db
        .update(navigationItems)
        .set({ position: i + 1, updatedAt: new Date() })
        .where(eq(navigationItems.id, String(parsed.data.itemIds[i])));
    }
    return res.status(200).json({ success: true, message: "Menu items reordered" });
  } catch (error) {
    next(error);
  }
};

// === PUBLIC ===

export const getPublicNavigation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, String(req.params.location)),
    });
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }
    const items = await db.query.navigationItems.findMany({
      where: eq(navigationItems.menuId, menu.id),
      orderBy: [asc(navigationItems.position)],
    });
    const visible = items.filter((i: any) => i.isVisible);
    return res.status(200).json({
      success: true,
      message: "Navigation fetched successfully",
      data: buildTree(visible),
    });
  } catch (error) {
    next(error);
  }
};
