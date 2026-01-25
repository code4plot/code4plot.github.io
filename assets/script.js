const grid = document.getElementById("projectGrid");
const search = document.getElementById("search");
const tagFilter = document.getElementById("tagFilter");
document.getElementById("year").textContent = new Date().getFullYear();

const projects = (window.PROJECTS || []).map(p => ({
  ...p,
  _search: (p.title + " " + p.description + " " + (p.tags||[]).join(" ")).toLowerCase()
}));

function uniqueTags(items){
  const set = new Set();
  items.forEach(p => (p.tags||[]).forEach(t => set.add(t)));
  return ["all", ...Array.from(set).sort((a,b)=>a.localeCompare(b))];
}

function render(items){
  grid.innerHTML = "";
  if (!items.length){
    grid.innerHTML = `<div class="card muted">No projects match your search.</div>`;
    return;
  }
  items.forEach(p => {
    const card = document.createElement("article");
    card.className = "card project";

    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
    const links = Object.entries(p.links || {}).map(([k,v]) => {
      const label = k === "github" ? "Code" : (k === "writeup" ? "Write-up" : k[0].toUpperCase() + k.slice(1));
      return `<a class="link" href="${v}" target="_blank" rel="noreferrer">${label}</a>`;
    }).join("");

    card.innerHTML = `
      <div class="project__top">
        <div class="project__title">${p.title}</div>
        <div class="tags">${tags}</div>
      </div>
      <p class="muted">${p.description}</p>
      <div class="project__links">${links}</div>
    `;
    grid.appendChild(card);
  });
}

function applyFilters(){
  const q = (search.value || "").trim().toLowerCase();
  const t = tagFilter.value;
  const filtered = projects.filter(p => {
    const qOk = !q || p._search.includes(q);
    const tOk = (t === "all") || (p.tags || []).includes(t);
    return qOk && tOk;
  });
  render(filtered);
}

function init(){
  // populate tags
  uniqueTags(projects).forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t === "all" ? "All tags" : t;
    tagFilter.appendChild(opt);
  });

  render(projects);
  search.addEventListener("input", applyFilters);
  tagFilter.addEventListener("change", applyFilters);
}
init();
