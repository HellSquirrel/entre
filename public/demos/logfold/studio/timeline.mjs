// The timeline: a second host for the same log, for devtools. It reads
// numbers and handles from the app and drives `renderAt`, so the slider
// moves the real page through its history.

const css = `
.lf-timeline .lf-scrub { width: 100%; }
.lf-timeline .lf-meta { color: #777; font-size: .9rem; }
.lf-timeline .lf-lanes { display: flex; flex-wrap: wrap; gap: 4px; margin-top: .5rem; }
.lf-timeline .lf-lanes span { display: inline-block; min-width: 2.2rem; text-align: center; padding: 2px 4px; border-radius: 3px; background: #eee; font-size: .8rem; }
.lf-timeline .lf-lanes span.input { background: #ffd6d6; }
.lf-timeline .lf-lanes span.past { opacity: .35; }
.lf-timeline .lf-lanes span.ckpt { outline: 2px solid #4a90e2; }
`;

export function timeline(host, container) {
  if (!document.getElementById("lf-timeline-css")) {
    const style = document.createElement("style");
    style.id = "lf-timeline-css";
    style.textContent = css;
    document.head.append(style);
  }
  container.classList.add("lf-timeline");
  container.innerHTML = `<input class="lf-scrub" type="range" min="0" max="0" value="0">
    <p class="lf-meta">the page shows index <span class="lf-at">0</span> · <span class="lf-prov"></span> · variables <code class="lf-vars"></code></p>
    <div class="lf-lanes"></div>`;
  const scrub = container.querySelector("input");
  const at = container.querySelector(".lf-at"), prov = container.querySelector(".lf-prov");
  const vars = container.querySelector(".lf-vars"), lanes = container.querySelector(".lf-lanes");
  scrub.addEventListener("input", () => host.renderAt(Number(scrub.value)));

  function render() {
    const app = host.app, n = app.len(), a = app.at(), b = app.base?.() ?? 0;
    scrub.min = b;                         // the horizon: the log forgot what came before
    scrub.max = n;
    scrub.value = a;                       // the slider shows what the DOM shows; nothing to guess
    at.textContent = a;
    const ck = app.checkpoint_for(a);
    prov.textContent = ck < 0 ? `folded ${a - b} events from index ${b}` : `resumed from checkpoint at ${ck}, folded ${a - ck} more`;
    vars.textContent = JSON.stringify(Object.fromEntries(host.vars));
    const spans = [];
    for (let i = b; i < n; i++) {
      const kind = app.kind(i), text = kind === "input" ? app.text?.(i) : undefined;
      const label = kind === "tick" ? `tick ${app.tick_ms(i).toFixed(0)}` : text !== undefined ? `input “${text}”` : kind;
      const cls = [kind === "input" ? "input" : "", i >= a ? "past" : "", app.checkpoint_for(i + 1) === i + 1 ? "ckpt" : ""].join(" ");
      spans.push(`<span class="${cls}" title="index ${i}">${i}·${label}</span>`);
    }
    lanes.innerHTML = spans.join("");
  }
  host.onChange(render);
  render();
}
