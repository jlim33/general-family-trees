/**
 * ==============================================================================
 * General Family Tree - Interactive Family Tree Hierarchy Engine
 * (범용 가계도 - 직계·방계 가계도 계통도 및 세대별 관계도 렌더링 엔진)
 * ==============================================================================
 */

class GeneralFamilyTree {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("clan-tree-canvas");
    this.scale = 1;
    this.searchQuery = "";
  }

  init() {
    this.container = document.getElementById("clan-tree-canvas");
    const searchInput = document.getElementById("tree-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render(this.app.relatives);
      });
    }

    const btnIn = document.getElementById("tree-zoom-in-btn");
    const btnOut = document.getElementById("tree-zoom-out-btn");
    const btnReset = document.getElementById("tree-zoom-reset-btn");

    if (btnIn) btnIn.addEventListener("click", () => this.zoom(0.15));
    if (btnOut) btnOut.addEventListener("click", () => this.zoom(-0.15));
    if (btnReset) btnReset.addEventListener("click", () => this.resetZoom());
  }

  zoom(delta) {
    this.scale = Math.max(0.5, Math.min(2.0, this.scale + delta));
    this.applyZoom();
  }

  resetZoom() {
    this.scale = 1;
    this.applyZoom();
  }

  applyZoom() {
    const forest = document.getElementById("tree-forest-wrapper");
    if (forest) {
      forest.style.transform = `scale(${this.scale})`;
      forest.style.transformOrigin = "top center";
    }
  }

  buildHierarchy(relatives) {
    const map = {};
    const roots = [];

    // Index all members
    relatives.forEach(r => {
      map[r.name.trim().toLowerCase()] = {
        data: r,
        children: []
      };
    });

    // Build parent-child tree
    relatives.forEach(r => {
      const parentName = (r.parentName || "").trim().toLowerCase();
      if (parentName && map[parentName]) {
        map[parentName].children.push(map[r.name.trim().toLowerCase()]);
      } else {
        roots.push(map[r.name.trim().toLowerCase()]);
      }
    });

    return roots;
  }

  render(relatives) {
    if (!this.container) return;

    if (!relatives || relatives.length === 0) {
      this.container.innerHTML = `
        <div class="tree-empty-state">
          <i class="fa-solid fa-sitemap"></i>
          <p>No family members registered yet. Click <strong>+ Add Relative</strong> to begin!</p>
        </div>
      `;
      return;
    }

    const roots = this.buildHierarchy(relatives);
    const isEn = this.app.currentLang === "en";
    const dict = window.I18N_DICTIONARY[this.app.currentLang] || window.I18N_DICTIONARY.en;

    this.container.innerHTML = `
      <div class="tree-forest-wrapper" id="tree-forest-wrapper">
        <div class="tree-root-banner">
          <i class="fa-solid fa-crown"></i>
          <span>${dict.treeRootNote}</span>
        </div>
        <div class="tree-forest">
          ${roots.map(root => this.renderNode(root, 1)).join("")}
        </div>
      </div>
    `;

    this.applyZoom();
  }

  renderNode(node, depth) {
    const r = node.data;
    const isEn = this.app.currentLang === "en";
    const dict = window.I18N_DICTIONARY[this.app.currentLang] || window.I18N_DICTIONARY.en;

    const isMatch = this.searchQuery && (
      r.name.toLowerCase().includes(this.searchQuery) ||
      (r.city && r.city.toLowerCase().includes(this.searchQuery)) ||
      (r.jobTitle && r.jobTitle.toLowerCase().includes(this.searchQuery))
    );

    const avatarHtml = r.photo
      ? `<img src="${r.photo}" alt="${r.name}" class="tree-node-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='${r.name.charAt(0)}';">`
      : `<span class="tree-node-initials">${r.name.charAt(0)}</span>`;

    const genNumber = r.generation || depth;

    return `
      <div class="tree-branch">
        <div 
          class="tree-node-card ${isMatch ? 'highlighted' : ''}" 
          data-id="${r.id}"
          onclick="window.app.openDetailModal('${r.id}')"
        >
          <div class="tree-node-header">
            <div class="tree-node-avatar">
              ${avatarHtml}
            </div>
            <div class="tree-node-meta">
              <span class="tree-gen-badge">${genNumber}${dict.treeGenerationSuffix}</span>
              <h5 class="tree-node-name">${r.name}</h5>
              <span class="tree-node-city"><i class="fa-solid fa-location-dot"></i> ${r.city || r.country || 'Global'}</span>
            </div>
          </div>
          ${r.jobTitle ? `<div class="tree-node-job">${r.jobTitle}</div>` : ''}
          <div class="tree-node-footer">
            <span class="tree-click-hint"><i class="fa-solid fa-magnifying-glass-plus"></i> ${isEn ? 'Inspect' : '상세보기'}</span>
          </div>
        </div>

        ${node.children.length > 0 ? `
          <div class="tree-children-container">
            ${node.children.map(child => this.renderNode(child, depth + 1)).join("")}
          </div>
        ` : ''}
      </div>
    `;
  }
}

window.GeneralFamilyTree = GeneralFamilyTree;
