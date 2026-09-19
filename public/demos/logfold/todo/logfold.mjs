// LogFold host shim. Generic: it knows targets, variables and inputs by
// name and never what they mean. One `mount` per component on a page.
//
// The skeleton names targets with `data-fold="name"` (the root is "root")
// and inputs with `data-on="click:toggle"`; several entries may be
// separated by spaces. Rust decides what an input means and which numbers
// land on which target; the stylesheet decides what the numbers look like.
//
// A family of targets is `data-fold="item-0"`, `item-1`, … pre-rendered,
// or grown on demand from `<template data-fold="item">` (one element in
// it): the first patch that names `item-N` creates members up to N, in
// order, after the template, as one HTML string with their first writes
// already in it. Positional members are never removed; hide them by CSS.
// A keyed family (`family row keyed` in the declaration) names members
// by a key instead: each carries an order number the host writes, the
// shim places nodes by it, and a cleared order removes the node.
//
// An input fired from inside a family member sends the member's index with
// it (`data-on="click:toggle"` inside `data-fold="item-3"` sends 3).
//
// Text: an input fired from a form field sends the field's value with it
// (bytes; Rust decides whether the input keeps them). `data-on="enter:add"`
// fires on the Enter key and empties the field afterwards. A text slot's
// number is the log index of the input that carried the text; the shim asks
// the app for it and writes it into the target's `[data-text="name"]`
// child, or the target itself.
//
// Checked: a `checked` slot is the `.checked` property of the target's
// `[data-checked="name"]` child, or of the target itself: a native
// checkbox or radio, so assistive technology reads the real state. A click
// on one is not cancelled; the browser toggles it, the host answers, and
// the shim puts the control back to what the host last said, so the state
// stays Rust's even when an input changes nothing.

export function mount(app, { root = document, manifest = null } = {}) {
  // Names: asked of the app once per id and cached as a handle; the
  // manifest's list is the fallback for an app without `name`. Ids are
  // interned in Rust, so the app is the authority on what they mean.
  const names = new Map();
  const name = (id) => {
    if (!names.has(id)) names.set(id, app.name?.(id) ?? manifest?.names[id]);
    return names.get(id);
  };
  // Targets are indexed once: every `data-fold` on the page, plus members
  // grown from templates as they appear. No per-write querySelector.
  const named = new Map(), templates = new Map(), missing = new Set();
  for (const el of root.querySelectorAll("[data-fold]"))
    (el.tagName === "TEMPLATE" ? templates : named).set(el.dataset.fold, el);
  const lookup = (fold) => {                       // a target the page added after mount
    if (missing.has(fold)) return null;
    const el = root.querySelector(`[data-fold="${fold}"]`);
    if (el) named.set(fold, el); else missing.add(fold);
    return el;
  };
  // A family grown from a template: its members so far, and the pieces of
  // HTML a new member is made of, so a batch of new members is one string
  // and one parse instead of a clone and six property writes each.
  const families = new Map();
  const familyOf = (n) => {
    let f = families.get(n);
    if (f || !templates.has(n)) return f;
    const tpl = templates.get(n), proto = tpl.content.firstElementChild;
    const attrs = [...proto.attributes].filter((a) => a.name !== "class")
      .map((a) => ` ${a.name}="${a.value.replace(/"/g, "&quot;")}"`).join("");
    f = { tpl, parent: tpl.parentNode, members: new Map(), count: 0, keyed: manifest?.families?.[n] === "keyed",
          tag: proto.tagName.toLowerCase(), attrs, baseClass: proto.getAttribute("class") ?? "", inner: proto.innerHTML,
          drops: [], moves: [] };
    families.set(n, f);
    return f;
  };
  const target = (id, index) => {
    const n = name(id);
    if (index < 0) return n === "root" ? document.documentElement : (named.get(n) ?? lookup(n));
    const f = familyOf(n);
    if (f) return f.members.get(index) ?? null;
    return named.get(`${n}-${index}`) ?? lookup(`${n}-${index}`);
  };
  const inputs = new Map((manifest ? manifest.inputs : app.input_names()).map((n, i) => [n, i]));
  const enc = new TextEncoder(), NONE = new Uint8Array(0);

  // How a slot's number is spelled on the page: a class is `name` for a
  // boolean and `name-value` for an enum; attributes and variables carry
  // the number; text is looked up by log index. One writer per slot,
  // resolved once; an enum remembers the class it last put on an element.
  const slots = new Map();                        // slot name -> its manifest entry, once
  const slot = (n) => { if (!slots.has(n)) slots.set(n, manifest?.slots?.[n]); return slots.get(n); };
  const enumClass = (n, x) => { const v = slot(n)?.values; return v && !Number.isNaN(x) && v[x] !== undefined ? `${n}-${v[x]}` : null; };
  const classFor = (n, x) => (slot(n)?.values ? enumClass(n, x) : (!Number.isNaN(x) && x !== 0 ? n : null));
  // Root variables go into a stylesheet, not onto <html>: one `:root {}`
  // rule in a constructable sheet this mount owns. Setting a variable there
  // is a CSSOM write and nothing else: no attribute changes, no node is
  // touched, a MutationObserver on the document sees nothing. Measured at
  // the same cost as a class or an inline style. Where constructable
  // sheets are missing, the inline style of <html> is the fallback.
  //
  // A named target's variables go the same way, into a rule on the class of
  // the target's name (`target count { var n: int; }` is `.count { --n }`).
  // The markup already carries the class, so the shim never looks the
  // element up and never touches it; every element with the class gets the
  // number, and only that subtree inherits it.
  const ROOT = document.documentElement;
  const sheet = (() => {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(":root {}");
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      return sheet;
    } catch { return null; }
  })();
  const rootStyle = sheet ? sheet.cssRules[0].style : ROOT.style;
  const classRules = new Map();                   // target name -> the style of its `.name {}` rule
  const classStyle = (n) => {
    let st = classRules.get(n);
    if (!st) { st = sheet.cssRules[sheet.insertRule(`.${CSS.escape(n)} {}`, sheet.cssRules.length)].style; classRules.set(n, st); }
    return st;
  };
  const lastClass = new WeakMap();                // element -> { enum slot name: class on it now }
  const checkedNow = new WeakMap();               // control -> what the host last said its `checked` is
  const setChecked = (control, on) => { control.checked = on; checkedNow.set(control, on); };
  const writers = new Map();
  const writer = (kind, nameId) => {
    const key = kind * 65536 + nameId;
    let w = writers.get(key);
    if (w) return w;
    const n = name(nameId);
    if (kind === 0) w = (el, x) => { const st = el === ROOT ? rootStyle : el.style; Number.isNaN(x) ? st.removeProperty(n) : st.setProperty(n, x); };
    else if (kind === 1) w = (el, x) => { Number.isNaN(x) ? el.removeAttribute(n) : el.setAttribute(n, x); };
    else if (kind === 2) w = (el, x) => { (el.querySelector(`[data-text="${n}"]`) ?? el).textContent = Number.isNaN(x) ? "" : (app.text(x) ?? ""); };
    else if (kind === 5) w = (el, x) => setChecked(el.querySelector(`[data-checked="${n}"]`) ?? el, x === 1);
    else if (slot(n)?.values) w = (el, x) => {
      const next = enumClass(n, x);
      let rec = lastClass.get(el);
      if (!rec) lastClass.set(el, (rec = {}));
      const prev = rec[n] ?? null;
      if (prev === next) return;
      if (prev) el.classList.remove(prev);
      if (next) el.classList.add(next);
      rec[n] = next;
    };
    else w = (el, x) => { el.classList.toggle(n, !Number.isNaN(x) && x !== 0); };
    writers.set(key, w);
    return w;
  };

  // New members of a family, from one patch: rendered as HTML and appended
  // as one string. The template's parent holds the family and nothing
  // else after the template. A keyed family's members are then put in
  // their places by their order numbers; a positional family's arrive in
  // order already.
  const insertFresh = (fam, g) => {
    const { f } = g;
    // keyed: append in order-number order; when those numbers continue
    // right after the existing members, appending is placing, and no
    // member needs a move afterwards
    let rows = [...g.rows], placed = false;
    if (f.keyed) {
      const ordered = rows.every(([, r], i) => i === 0 || (r.order ?? Infinity) >= (rows[i - 1][1].order ?? Infinity));
      if (!ordered) rows.sort((a, b) => (a[1].order ?? Infinity) - (b[1].order ?? Infinity));
      placed = rows.every(([, r], i) => r.order === f.members.size + i);
    }
    let html = "";
    for (const [k, r] of rows) {
      const cls = f.baseClass ? [f.baseClass, ...r.cls] : r.cls;
      html += `<${f.tag}${f.attrs} data-fold="${fam}-${k}"${cls.length ? ` class="${cls.join(" ")}"` : ""}${r.attrs}${r.vars ? ` style="${r.vars}"` : ""}>${f.inner}</${f.tag}>`;
    }
    const first = f.parent.childElementCount;
    f.parent.insertAdjacentHTML("beforeend", html);
    let i = first;
    for (const [k, r] of rows) {
      const el = f.parent.children[i++];
      f.members.set(k, el);
      if (r.enums) lastClass.set(el, r.enums);
      for (const [n, x] of r.texts ?? []) (el.querySelector(`[data-text="${n}"]`) ?? el).textContent = app.text(x) ?? "";
      for (const [n, on] of r.checks ?? []) setChecked(el.querySelector(`[data-checked="${n}"]`) ?? el, on);
      if (f.keyed && !placed && r.order !== undefined) f.moves.push([r.order, k]);
    }
    if (!f.keyed) f.count += rows.length;
  };
  // Keyed members: drop the gone, then place each by its order number,
  // lowest first. A member already at its place costs one comparison (a
  // removal shifts the rest into place by itself). One pulled forward from
  // earlier in the list would shift its reference, so it goes after it.
  // A final check falls back to detaching every mover and reinserting in
  // order, which is always right.
  const settleOrder = (f) => {
    for (const k of f.drops) { f.members.get(k)?.remove(); f.members.delete(k); }
    f.drops.length = 0;
    if (!f.moves.length) return;
    f.moves.sort((a, b) => a[0] - b[0]);
    const parent = f.parent, base = Array.prototype.indexOf.call(parent.children, f.tpl) + 1;
    const at = (p) => parent.children[base + p] ?? null;
    for (const [p, k] of f.moves) {
      const el = f.members.get(k), ref = at(p);
      if (!el || ref === el) continue;
      if (ref && el.compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_FOLLOWING) parent.insertBefore(el, ref.nextSibling);
      else parent.insertBefore(el, ref);
    }
    if (f.moves.some(([p, k]) => at(p) !== f.members.get(k))) {
      const movers = f.moves.map(([p, k]) => [p, f.members.get(k)]).filter(([, el]) => el);
      for (const [, el] of movers) el.remove();
      for (const [p, el] of movers) parent.insertBefore(el, at(p));
    }
    f.moves.length = 0;
  };

  const vars = new Map();          // what the DOM holds, mirrored for devtools
  const listeners = new Set();
  // Time the last call spent in wasm and in the DOM, for benchmarks and devtools.
  const timed = (f) => { const t0 = performance.now(); const patch = f(); host.stats.wasm = performance.now() - t0; return host.apply(patch); };

  const host = {
    app,
    vars,
    stats: { wasm: 0, apply: 0, writes: 0 },
    /** Write a patch of `[target, index, kind, name, value]`; index is a
     *  family member (its position, or its key for a keyed family) or -1;
     *  kind 0 is a custom property, 1 an attribute, 2 text (the value is a
     *  log index), 3 a class, 4 a keyed member's position (NaN: dropped);
     *  NaN clears. */
    apply(patch) {
      const t0 = performance.now();
      let fresh = null, ordered = null;   // families with new members (the HTML path) and with order changes
      const blank = () => ({ cls: [], attrs: "", vars: "", enums: null, texts: null, order: undefined });
      const freshRow = (fam, f, index) => {           // the record collecting a new member's first writes
        if (!fresh) fresh = new Map();
        let g = fresh.get(fam);
        if (!g) fresh.set(fam, (g = { f, rows: new Map(), next: f.count }));
        if (f.keyed) { if (!g.rows.has(index)) g.rows.set(index, blank()); }
        else for (; g.next <= index; g.next++) g.rows.set(g.next, blank());   // positional: no gaps
        return g.rows.get(index);
      };
      let lastId = -1, lastIndex = -1, lastFam = null, lastF = null, lastRow = null;   // a member's writes are consecutive
      for (let i = 0; i < patch.length; i += 5) {
        const id = patch[i], index = patch[i + 1], kind = patch[i + 2], nameId = patch[i + 3], x = patch[i + 4];
        if (kind === 4 && index < 0) {                             // every member of a keyed family is gone
          const f = familyOf(name(id));
          if (f) { const keep = []; for (const c of f.parent.children) { keep.push(c); if (c === f.tpl) break; } f.parent.replaceChildren(...keep); f.members.clear(); }
          continue;
        }
        if (index >= 0) {
          if (id !== lastId) { lastId = id; lastFam = name(id); lastF = familyOf(lastFam); lastIndex = -1; }
          const fam = lastFam, f = lastF;
          if (f && kind === 4) {                                 // a keyed member's order: NaN drops it
            if (Number.isNaN(x)) { (ordered ??= new Set()).add(f); f.drops.push(index); }
            else if (!f.members.has(index)) { lastRow = freshRow(fam, f, index); lastIndex = index; lastRow.order = x; }   // new: placed on insertion
            else { (ordered ??= new Set()).add(f); f.moves.push([x, index]); }
            continue;
          }
          if (f && (f.keyed ? !f.members.has(index) : index >= f.count)) {
            if (index !== lastIndex) { lastRow = freshRow(fam, f, index); lastIndex = index; }
            const r = lastRow, n = name(nameId);
            if (Number.isNaN(x)) continue;                       // cleared on a member that does not exist yet: nothing
            if (kind === 3) { const c = classFor(n, x); if (c) { r.cls.push(c); if (slot(n)?.values) (r.enums ??= {})[n] = c; } }
            else if (kind === 1) r.attrs += ` ${n}="${x}"`;
            else if (kind === 0) r.vars += (r.vars ? "; " : "") + `${n}: ${x}`;
            else if (kind === 5) (r.checks ??= []).push([n, x === 1]);
            else (r.texts ??= []).push([n, x]);
            continue;
          }
        }
        if (kind === 0 && index < 0 && sheet && name(id) !== "root") {   // a named target's variable: a class rule, no element
          const st = classStyle(name(id)), n = name(nameId);
          Number.isNaN(x) ? st.removeProperty(n) : st.setProperty(n, x);
          continue;
        }
        const el = target(id, index);
        if (!el) continue;
        writer(kind, nameId)(el, x);
        if (index < 0 && name(id) === "root") { const n = name(nameId); Number.isNaN(x) ? vars.delete(n) : vars.set(n, x); }   // the mirror is for devtools; root only
      }
      if (fresh) for (const [fam, g] of fresh) { insertFresh(fam, g); if (g.f.moves.length) (ordered ??= new Set()).add(g.f); }
      if (ordered) for (const f of ordered) settleOrder(f);
      host.stats.apply = performance.now() - t0;
      host.stats.writes = patch.length / 5;
      for (const fn of listeners) fn(host);
      return host;
    },
    /** Dispatch an input by name, with the text and the family member index it carries, if any. */
    dispatch(input, text = "", index = -1) {
      if (!inputs.has(input)) throw new Error(`unknown input "${input}"; known: ${[...inputs.keys()].join(", ")}`);
      return timed(() => app.dispatch(inputs.get(input), index, text ? enc.encode(text) : NONE));
    },
    tick(ms = performance.now()) { return timed(() => app.tick(ms)); },
    /** One frame of the component's simulated world, `dt` milliseconds long. */
    frame(dt) { return timed(() => app.frame(dt)); },
    renderAt(n) { return timed(() => app.render_at(n)); },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };

  // Inputs: one delegated listener per DOM event type the skeleton mentions.
  // `enter` is keydown filtered to the Enter key.
  const DOM_TYPE = { enter: "keydown" };
  const fires = (t, e) => (DOM_TYPE[t] ?? t) === e.type && (t !== "enter" || (e.key === "Enter" && !e.isComposing));
  // Templates are inert, so their inputs are scanned explicitly: a family
  // grown later must find its listeners already in place.
  const declared = [...root.querySelectorAll("[data-on]"),
    ...[...root.querySelectorAll("template")].flatMap((t) => [...t.content.querySelectorAll("[data-on]")])];
  const types = new Set();
  for (const el of declared)
    for (const entry of el.dataset.on.trim().split(/\s+/)) types.add(DOM_TYPE[entry.split(":")[0]] ?? entry.split(":")[0]);
  for (const type of types) {
    root.addEventListener(type, (e) => {
      const el = e.target.closest?.("[data-on]");
      if (!el) return;
      const field = el.matches("input, textarea, select") ? el : null;
      const member = /-(\d+)$/.exec(el.closest("[data-fold]")?.dataset.fold ?? "");
      const index = member ? Number(member[1]) : -1;
      for (const entry of el.dataset.on.trim().split(/\s+/)) {
        const [t, input] = entry.split(":");
        if (!fires(t, e) || !inputs.has(input)) continue;
        // A control bound to a `checked` slot keeps its native behaviour:
        // cancelling the click would make the browser undo the host's write.
        const bound = el.hasAttribute("data-checked");
        if (!bound) e.preventDefault();
        host.dispatch(input, field && !bound ? field.value : "", index);
        if (bound) el.checked = checkedNow.get(el) ?? false;
        if (t === "enter" && field) field.value = "";
      }
    });
  }

  return host.apply(app.render_at(0));
}
