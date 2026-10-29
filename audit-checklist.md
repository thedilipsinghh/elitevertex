# Elite Vertex – Responsiveness Audit
> Fill ✅ when OK, ✏️ with a short note when there is a problem.

## 1. Header / Top Navigation
- [ ] Logo scales correctly & stays fully visible.
- [ ] Nav‑links never overflow the viewport.
- [ ] Hamburger menu appears on ≤ 1024 px.
- [ ] Menu opens & closes smoothly (click & tap).
- [ ] Menu closes automatically after a link click.
- [ ] Touch targets ≥ 44 × 44 px.
- [ ] No content hidden behind a fixed header.
- [ ] Keyboard‑focus indicator visible.
- [ ] No horizontal scroll caused by the header.

## 2. Hero / Intro Sections (home & inner pages)
- [ ] Headings wrap naturally, never cut off.
- [ ] CTA button stays inside its container.
- [ ] Hero image keeps important visual parts (object‑fit/position).
- [ ] No fixed height that clips content.
- [ ] On ≤ 640 px image stacks vertically (or vice‑versa) where needed.
- [ ] No excessive empty space on small screens.
- [ ] No overlapping decorative elements.

## 3. Grids / Cards / Lists
- [ ] Desktop column count matches design.
- [ ] Tablet (≈ 768 px) reduces columns appropriately.
- [ ] Mobile (≤ 430 px) stacks to a single column (or two only if still readable).
- [ ] No horizontal overflow from cards.
- [ ] Images inside cards stay within their container (`max‑width: 100%`).
- [ ] Text wraps without overflow.
- [ ] Buttons align correctly.

## 4. Typography & Spacing
- [ ] Base font size ≥ 14 px on mobile.
- [ ] Headings use responsive scaling (e.g. `clamp()` or Tailwind `text-2xl sm:text-3xl ...`).
- [ ] Paragraph line‑length ≤ 75 ch.
- [ ] No headings colliding with neighboring elements.
- [ ] Margins & paddings adapt proportionally.

## 5. Forms (login, contact, etc.)
- [ ] Inputs fill the width of their container.
- [ ] Labels stay readable and correctly associated.
- [ ] Buttons are fully visible, full‑width on small screens if needed.
- [ ] Validation messages don’t overlap fields.
- [ ] Touch targets meet size guidelines.

## 6. Modals / Dialogs
- [ ] Fit inside the viewport (max‑height 100 vh, scrollable content).
- [ ] Close button reachable.

## 7. Tables / Admin Dashboard
- [ ] Tables don’t push page width.
- [ ] If needed, table wrapper has `overflow‑x: auto`.
- [ ] Sidebar collapses or becomes off‑canvas on ≤ 1024 px.
- [ ] Charts and stats fit their containers.

## 8. Footer
- [ ] Columns stack vertically on ≤ 640 px.
- [ ] Social icons stay reachable, not clipped.
- [ ] Links have sufficient spacing.
- [ ] **Extra requirement:** “Social‑media icon moves to the footer in mobile view”.

## 9. General Layout
- [ ] No horizontal scroll (`document.documentElement.scrollWidth === clientWidth`).
- [ ] No absolute‑positioned element escaping the viewport.
- [ ] All interactive elements have focus styles.
- [ ] No console errors or warnings.

---
> **How to use:**
> 1. Run the dev server (`npm run dev`).
> 2. Open Chrome DevTools → Device Toolbar and test each viewport listed in the project plan.
> 3. Tick the boxes or add a short note (`✏️`) for any problem you encounter.
> 4. Capture a screenshot of each failing area and save it next to this file.
> 5. When finished, send me the completed file (or a summary) and the screenshots – we’ll move on to Phase 2 (fixes).
