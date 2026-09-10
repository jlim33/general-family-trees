/**
 * ==============================================================================
 * General Family Tree - Main Application Controller
 * (범용 가계도 - 메인 애플리케이션 코어 컨트롤러)
 * English First, Followed by Korean
 * ==============================================================================
 */

class GeneralFamilyApp {
  constructor() {
    this.currentLang = localStorage.getItem("gft_lang") || "en";
    this.currentTheme = localStorage.getItem("gft_theme") || "royal";
    this.currentTab = "map";
    this.directoryViewMode = "card"; // "card" | "table"
    this.activeCityFilter = null;
    this.activeCountryFilter = null;
    this.searchKeyword = "";

    this.dataManager = new FamilyDataManager();
    this.relatives = this.dataManager.relatives;

    this.mapManager = null;
    this.treeManager = null;
    this.musicLounge = null;
    this.wizard = null;
  }

  init() {
    window.app = this;
    window.currentLanguage = this.currentLang;

    // Apply theme & font size
    this.setTheme(this.currentTheme, false);
    this.initFontSizeMode();

    // Initialize Subsystems
    this.wizard = new OnboardingWizard(this);
    window.wizard = this.wizard;

    this.mapManager = new GeneralFamilyMap(this);
    window.mapManager = this.mapManager;

    this.treeManager = new GeneralFamilyTree(this);
    window.treeManager = this.treeManager;

    this.musicLounge = new GeneralMusicLounge();
    window.musicLounge = this.musicLounge;
    this.musicLounge.init();

    this.bindEvents();
    this.applyTranslations();

    // Check if family has been configured; if not, open wizard
    const activeCfg = this.dataManager.activeConfig;
    if (!activeCfg) {
      this.wizard.openModal();
    } else {
      this.applyFamilyConfig(activeCfg, false);
    }
  }

  bindEvents() {
    // Search bar
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchKeyword = e.target.value.toLowerCase().trim();
        this.renderRelativesList();
      });
    }

    // Country Filter
    const countryFilter = document.getElementById("country-filter");
    if (countryFilter) {
      countryFilter.addEventListener("change", (e) => {
        this.activeCountryFilter = e.target.value || null;
        this.renderRelativesList();
      });
    }

    // View Mode Toggle (Cards vs Table)
    const btnCardView = document.getElementById("view-mode-card");
    const btnTableView = document.getElementById("view-mode-table");
    if (btnCardView && btnTableView) {
      btnCardView.addEventListener("click", () => this.setDirectoryView("card"));
      btnTableView.addEventListener("click", () => this.setDirectoryView("table"));
    }

    // Photo File Upload
    const photoFileInput = document.getElementById("relative-photo-file");
    if (photoFileInput) {
      photoFileInput.addEventListener("change", (e) => this.handlePhotoUpload(e));
    }

    // Photo URL Input
    const photoUrlInput = document.getElementById("form-photo-url");
    if (photoUrlInput) {
      photoUrlInput.addEventListener("input", (e) => this.handlePhotoUrlChange(e.target.value));
    }

    // JSON Import
    const importFileInput = document.getElementById("import-json-file");
    if (importFileInput) {
      importFileInput.addEventListener("change", (e) => this.importJSON(e));
    }
  }

  applyFamilyConfig(config, isNew = false) {
    this.dataManager.saveConfig(config);

    if (isNew) {
      this.relatives = this.dataManager.resetWithNewConfig(config);
    } else {
      this.relatives = this.dataManager.loadRelatives();
    }

    this.updateBrandHeaders(config);
    this.renderAll();

    if (this.mapManager) {
      this.mapManager.init();
    }

    if (isNew) {
      const isEn = this.currentLang === "en";
      this.showToast(isEn 
        ? `Welcome to The ${config.familyName} Family Tree!` 
        : `${config.familyName} 가문 가계도 설정이 완료되었습니다!`
      );
    }
  }

  updateBrandHeaders(config) {
    const isEn = this.currentLang === "en";
    const name = config.familyName || "Family";

    const brandTitleEl = document.getElementById("brand-clan-name");
    if (brandTitleEl) {
      brandTitleEl.textContent = isEn ? `The ${name} Family` : `${name} 가문`;
    }

    const brandSealEl = document.getElementById("brand-clan-seal");
    if (brandSealEl) {
      brandSealEl.textContent = name.charAt(0).toUpperCase();
    }

    const heroTitleEl = document.getElementById("hero-main-title");
    if (heroTitleEl) {
      heroTitleEl.textContent = isEn 
        ? `The ${name} Family Tree & Global Lineage` 
        : `${name} 가문 족보 & 글로벌 친족 계통도`;
    }

    const heroSubEl = document.getElementById("hero-main-sub");
    if (heroSubEl) {
      heroSubEl.textContent = isEn
        ? `Connecting relatives across ${config.majorCities.join(', ')} and worldwide.`
        : `${config.majorCities.join(', ')} 및 전 세계 거주 친족들의 소통과 계통도입니다.`;
    }
  }

  // 3 Luxury Themes
  setTheme(theme, showNotification = true) {
    this.currentTheme = theme;
    document.documentElement.classList.remove("theme-royal", "theme-pastel", "theme-dark");
    document.documentElement.classList.add(`theme-${this.currentTheme}`);
    localStorage.setItem("gft_theme", this.currentTheme);

    ["royal", "pastel", "dark"].forEach(t => {
      const btn = document.getElementById(`theme-btn-${t}`);
      if (btn) btn.classList.toggle("active", t === this.currentTheme);
    });

    if (showNotification) {
      const dict = window.I18N_DICTIONARY[this.currentLang];
      this.showToast(dict.toastThemeChanged);
    }
  }

  // Language toggle (EN / KO) - English First
  setLanguage(lang, showNotification = true) {
    this.currentLang = lang === "ko" ? "ko" : "en";
    window.currentLanguage = this.currentLang;
    localStorage.setItem("gft_lang", this.currentLang);

    const enBtn = document.getElementById("lang-btn-en");
    const koBtn = document.getElementById("lang-btn-ko");
    if (enBtn) enBtn.classList.toggle("active", this.currentLang === "en");
    if (koBtn) koBtn.classList.toggle("active", this.currentLang === "ko");

    this.applyTranslations();
    const cfg = this.dataManager.activeConfig;
    if (cfg) this.updateBrandHeaders(cfg);
    this.renderAll();

    if (this.musicLounge) this.musicLounge.updateUI();

    if (showNotification) {
      const dict = window.I18N_DICTIONARY[this.currentLang];
      this.showToast(dict.toastLangChanged);
    }
  }

  applyTranslations() {
    const dict = window.I18N_DICTIONARY[this.currentLang];
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.setAttribute("placeholder", dict[key]);
    });
  }

  // Font Scaling
  initFontSizeMode() {
    const saved = localStorage.getItem("gft_fontsize") || "normal";
    this.setFontSize(saved, false);
  }

  setFontSize(mode, showNotification = true) {
    document.body.classList.remove("font-large", "font-xlarge");
    if (mode === "large") document.body.classList.add("font-large");
    else if (mode === "xlarge") document.body.classList.add("font-xlarge");
    localStorage.setItem("gft_fontsize", mode);

    document.querySelectorAll(".font-toggle-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.size === mode);
    });

    if (showNotification) {
      const dict = window.I18N_DICTIONARY[this.currentLang];
      this.showToast(dict.toastFontSizeChanged);
    }

    if (this.mapManager && this.mapManager.map) {
      setTimeout(() => this.mapManager.map.invalidateSize(), 150);
    }
  }

  // Navigation Tabs
  switchMainTab(tab) {
    this.currentTab = tab;

    const tabMapBtn = document.getElementById("tab-btn-map");
    const tabTreeBtn = document.getElementById("tab-btn-tree");
    const tabDirBtn = document.getElementById("tab-btn-directory");

    if (tabMapBtn) tabMapBtn.classList.toggle("active", tab === "map");
    if (tabTreeBtn) tabTreeBtn.classList.toggle("active", tab === "tree");
    if (tabDirBtn) tabDirBtn.classList.toggle("active", tab === "directory");

    const mapSec = document.getElementById("clan-map-section");
    const treeSec = document.getElementById("clan-tree-section");
    const dirSec = document.getElementById("relatives-section");

    if (tab === "map") {
      if (mapSec) mapSec.style.display = "block";
      if (treeSec) treeSec.style.display = "none";
      if (dirSec) dirSec.style.display = "block";
      if (this.mapManager && this.mapManager.map) {
        setTimeout(() => this.mapManager.map.invalidateSize(), 150);
      }
    } else if (tab === "tree") {
      if (mapSec) mapSec.style.display = "none";
      if (treeSec) treeSec.style.display = "block";
      if (dirSec) dirSec.style.display = "block";
      if (this.treeManager) this.treeManager.render(this.relatives);
    } else {
      if (mapSec) mapSec.style.display = "block";
      if (treeSec) treeSec.style.display = "none";
      if (dirSec) {
        dirSec.style.display = "block";
        dirSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  // Re-render all views
  renderAll() {
    this.renderStats();
    this.renderHubCards();
    this.updateCountryFilterOptions();
    this.updateParentNameOptions();
    this.renderRelativesList();

    if (this.mapManager) this.mapManager.renderMarkers(this.relatives);
    if (this.treeManager) this.treeManager.render(this.relatives);
  }

  renderStats() {
    const isEn = this.currentLang === "en";
    const dict = window.I18N_DICTIONARY[this.currentLang];
    const cfg = this.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;

    const totalRelatives = this.relatives.length;
    const countriesSet = new Set(this.relatives.map(r => r.country).filter(Boolean));
    const citiesSet = new Set(this.relatives.map(r => r.city).filter(Boolean));

    const majorCities = new Set(cfg.majorCities || []);
    const hubCount = this.relatives.filter(r => majorCities.has(r.city)).length;

    const elTotal = document.getElementById("stat-total-relatives");
    const elCountries = document.getElementById("stat-total-countries");
    const elCities = document.getElementById("stat-total-cities");
    const elHubs = document.getElementById("stat-major-hubs");

    if (elTotal) elTotal.innerHTML = `${totalRelatives} <span class="stat-unit">${dict.unitPeople}</span>`;
    if (elCountries) elCountries.innerHTML = `${Math.max(1, countriesSet.size)} <span class="stat-unit">${dict.unitCountries}</span>`;
    if (elCities) elCities.innerHTML = `${Math.max(1, citiesSet.size)} <span class="stat-unit">${dict.unitCities}</span>`;
    if (elHubs) elHubs.innerHTML = `${hubCount} <span class="stat-unit">${dict.unitPeople}</span>`;
  }

  renderHubCards() {
    const container = document.getElementById("hubs-grid");
    if (!container) return;

    const cfg = this.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const isEn = this.currentLang === "en";
    const dict = window.I18N_DICTIONARY[this.currentLang];
    const hubs = cfg.majorCities || [];

    container.innerHTML = hubs.map(city => {
      const count = this.relatives.filter(r => r.city === city).length;
      const isSelected = this.activeCityFilter === city;
      const isPrimary = city === cfg.primaryCity;

      return `
        <div 
          class="hub-card ${isSelected ? 'active' : ''} ${isPrimary ? 'primary' : ''}" 
          onclick="window.app.filterByCity('${city}')"
        >
          <div class="hub-card-header">
            <span class="hub-pin-icon"><i class="fa-solid fa-location-dot"></i></span>
            <span class="hub-badge">${isPrimary ? (isEn ? 'Primary Hub' : '최우선 거점') : dict.hubSpotlightBadge}</span>
          </div>
          <h4 class="hub-city-name">${city}</h4>
          <div class="hub-count-box">
            <span class="hub-count-num">${count}</span>
            <span class="hub-count-label">${dict.residentCountSuffix}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  updateCountryFilterOptions() {
    const select = document.getElementById("country-filter");
    if (!select) return;

    const dict = window.I18N_DICTIONARY[this.currentLang];
    const countries = Array.from(new Set(this.relatives.map(r => r.country).filter(Boolean)));

    let html = `<option value="">${dict.countryFilterAll}</option>`;
    countries.forEach(c => {
      const selected = this.activeCountryFilter === c ? "selected" : "";
      html += `<option value="${c}" ${selected}>${c}</option>`;
    });

    select.innerHTML = html;
  }

  updateParentNameOptions() {
    const datalist = document.getElementById("parent-name-suggestions");
    if (!datalist) return;
    const names = Array.from(new Set(this.relatives.map(r => r.name.trim()).filter(Boolean)));
    datalist.innerHTML = names.map(n => `<option value="${n}">`).join("");
  }

  filterByCity(cityName) {
    if (this.activeCityFilter === cityName) {
      this.activeCityFilter = null;
    } else {
      this.activeCityFilter = cityName;
    }
    this.renderHubCards();
    this.renderRelativesList();

    if (this.activeCityFilter && this.mapManager) {
      this.mapManager.flyToCity(this.activeCityFilter);
    }
  }

  setDirectoryView(mode) {
    this.directoryViewMode = mode;
    const btnCard = document.getElementById("view-mode-card");
    const btnTable = document.getElementById("view-mode-table");
    if (btnCard) btnCard.classList.toggle("active", mode === "card");
    if (btnTable) btnTable.classList.toggle("active", mode === "table");

    const cardView = document.getElementById("relatives-card-view");
    const tableView = document.getElementById("relatives-table-view");
    if (cardView) cardView.style.display = mode === "card" ? "grid" : "none";
    if (tableView) tableView.style.display = mode === "table" ? "block" : "none";
  }

  renderRelativesList() {
    const cardContainer = document.getElementById("relatives-card-view");
    const tableContainer = document.getElementById("relatives-table-tbody");
    const emptyState = document.getElementById("relatives-empty-state");
    const resultsCountEl = document.getElementById("directory-results-count");

    const filtered = this.relatives.filter(r => {
      if (this.activeCityFilter && r.city !== this.activeCityFilter) return false;
      if (this.activeCountryFilter && r.country !== this.activeCountryFilter) return false;
      if (this.searchKeyword) {
        const text = `${r.name} ${r.city} ${r.country} ${r.workplace} ${r.jobTitle} ${r.email} ${r.notes}`.toLowerCase();
        if (!text.includes(this.searchKeyword)) return false;
      }
      return true;
    });

    if (resultsCountEl) {
      const isEn = this.currentLang === "en";
      resultsCountEl.textContent = isEn 
        ? `Showing ${filtered.length} of ${this.relatives.length} relatives`
        : `전체 ${this.relatives.length}명 중 ${filtered.length}명 표시`;
    }

    if (filtered.length === 0) {
      if (cardContainer) cardContainer.style.display = "none";
      if (tableContainer) tableContainer.parentElement.parentElement.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (this.directoryViewMode === "card") {
      if (cardContainer) cardContainer.style.display = "grid";
      if (tableContainer) tableContainer.parentElement.parentElement.style.display = "none";
    } else {
      if (cardContainer) cardContainer.style.display = "none";
      if (tableContainer) tableContainer.parentElement.parentElement.style.display = "block";
    }

    // Render Cards
    if (cardContainer) {
      cardContainer.innerHTML = filtered.map(r => this.createCardHtml(r)).join("");
    }

    // Render Table
    if (tableContainer) {
      tableContainer.innerHTML = filtered.map(r => this.createTableRowHtml(r)).join("");
    }
  }

  createCardHtml(r) {
    const isEn = this.currentLang === "en";
    const dict = window.I18N_DICTIONARY[this.currentLang];
    const cfg = this.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const isMajor = (cfg.majorCities || []).includes(r.city);

    const avatarHtml = r.photo
      ? `<img src="${r.photo}" alt="${r.name}" class="card-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='${r.name.charAt(0)}';">`
      : `<span class="card-initials">${r.name.charAt(0)}</span>`;

    const snsBadges = [];
    if (r.snsInstagram) snsBadges.push(`<a href="https://instagram.com/${r.snsInstagram.replace('@', '')}" target="_blank" class="sns-badge-mini ig" title="Instagram"><i class="fa-brands fa-instagram"></i></a>`);
    if (r.snsLinkedIn) snsBadges.push(`<a href="${r.snsLinkedIn}" target="_blank" class="sns-badge-mini li" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`);
    if (r.snsFacebook) snsBadges.push(`<a href="${r.snsFacebook}" target="_blank" class="sns-badge-mini fb" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>`);
    if (r.snsYouTube) snsBadges.push(`<a href="${r.snsYouTube}" target="_blank" class="sns-badge-mini yt" title="YouTube"><i class="fa-brands fa-youtube"></i></a>`);
    if (r.snsTwitter) snsBadges.push(`<a href="https://twitter.com/${r.snsTwitter.replace('@', '')}" target="_blank" class="sns-badge-mini tw" title="X"><i class="fa-brands fa-x-twitter"></i></a>`);
    if (r.snsWebsite) snsBadges.push(`<a href="${r.snsWebsite}" target="_blank" class="sns-badge-mini web" title="Website"><i class="fa-solid fa-globe"></i></a>`);

    return `
      <div class="relative-card" data-id="${r.id}">
        <div class="card-header">
          <div class="card-avatar-wrapper">
            ${avatarHtml}
          </div>
          <div class="card-header-info">
            <h4 class="card-name" onclick="window.app.openDetailModal('${r.id}')">${r.name}</h4>
            <div class="card-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>${r.city || 'Global'}, ${r.country || ''}</span>
              ${isMajor ? `<span class="hub-pill">${dict.hubSpotlightBadge}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="card-field">
            <span class="field-label"><i class="fa-regular fa-envelope"></i></span>
            <a href="mailto:${r.email}" class="field-value email">${r.email}</a>
          </div>
          ${r.phone ? `
            <div class="card-field">
              <span class="field-label"><i class="fa-solid fa-phone"></i></span>
              <span class="field-value">${r.phone}</span>
            </div>
          ` : ''}
          ${r.workplace || r.jobTitle ? `
            <div class="card-field">
              <span class="field-label"><i class="fa-solid fa-briefcase"></i></span>
              <span class="field-value">${[r.workplace, r.jobTitle].filter(Boolean).join(' · ')}</span>
            </div>
          ` : ''}
          ${r.parentName ? `
            <div class="card-field">
              <span class="field-label"><i class="fa-solid fa-arrow-turn-up"></i></span>
              <span class="field-value parent"><strong>${dict.thParent}:</strong> ${r.parentName}</span>
            </div>
          ` : ''}
        </div>

        ${snsBadges.length > 0 ? `
          <div class="card-sns-row">
            ${snsBadges.join('')}
          </div>
        ` : ''}

        <div class="card-actions">
          <button type="button" class="card-action-btn inspect" onclick="window.app.openDetailModal('${r.id}')">
            <i class="fa-regular fa-eye"></i> ${isEn ? 'Inspect' : '상세보기'}
          </button>
          <button type="button" class="card-action-btn edit" onclick="window.app.openEditModal('${r.id}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="card-action-btn delete" onclick="window.app.deleteRelative('${r.id}')">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }

  createTableRowHtml(r) {
    return `
      <tr data-id="${r.id}">
        <td>
          <div class="table-name-cell" onclick="window.app.openDetailModal('${r.id}')">
            <span class="table-avatar">${r.name.charAt(0)}</span>
            <strong>${r.name}</strong>
          </div>
        </td>
        <td>${r.city || '-'}, ${r.country || '-'}</td>
        <td>
          <div><a href="mailto:${r.email}" class="table-email">${r.email}</a></div>
          <div class="table-phone">${r.phone || '-'}</div>
        </td>
        <td>${[r.workplace, r.jobTitle].filter(Boolean).join(' · ') || '-'}</td>
        <td>${r.parentName || '-'}</td>
        <td>${r.birthday || '-'}</td>
        <td>
          <div class="table-actions-cell">
            <button type="button" class="table-action-btn" onclick="window.app.openDetailModal('${r.id}')" title="Inspect">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button type="button" class="table-action-btn" onclick="window.app.openEditModal('${r.id}')" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="table-action-btn delete" onclick="window.app.deleteRelative('${r.id}')" title="Delete">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  // Relative Form Modal
  openAddModal() {
    this.editingId = null;
    const form = document.getElementById("relative-form");
    if (form) form.reset();

    const titleEl = document.getElementById("relative-form-modal-title");
    const dict = window.I18N_DICTIONARY[this.currentLang];
    if (titleEl) titleEl.textContent = dict.modalAddTitle;

    // Reset photo preview
    this.resetPhotoPreview();

    // Default country from active family config
    const cfg = this.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const countryInput = document.getElementById("form-country");
    if (countryInput) countryInput.value = cfg.countryNameEn;

    this.showModal("relative-form-modal");
  }

  openEditModal(id) {
    const r = this.relatives.find(item => item.id === id);
    if (!r) return;

    this.editingId = id;
    const titleEl = document.getElementById("relative-form-modal-title");
    const dict = window.I18N_DICTIONARY[this.currentLang];
    if (titleEl) titleEl.textContent = dict.modalEditTitle;

    document.getElementById("form-name").value = r.name || "";
    document.getElementById("form-email").value = r.email || "";
    document.getElementById("form-country").value = r.country || "";
    document.getElementById("form-city").value = r.city || "";
    document.getElementById("form-parent").value = r.parentName || "";
    document.getElementById("form-phone").value = r.phone || "";
    document.getElementById("form-address").value = r.address || "";
    document.getElementById("form-workplace").value = r.workplace || "";
    document.getElementById("form-jobtitle").value = r.jobTitle || "";
    document.getElementById("form-workaddress").value = r.workAddress || "";
    document.getElementById("form-birthday").value = r.birthday || "";
    document.getElementById("form-notes").value = r.notes || "";

    document.getElementById("form-photo-url").value = r.photo || "";
    this.handlePhotoUrlChange(r.photo || "");

    document.getElementById("form-sns-instagram").value = r.snsInstagram || "";
    document.getElementById("form-sns-linkedin").value = r.snsLinkedIn || "";
    document.getElementById("form-sns-facebook").value = r.snsFacebook || "";
    document.getElementById("form-sns-youtube").value = r.snsYouTube || "";
    document.getElementById("form-sns-twitter").value = r.snsTwitter || "";
    document.getElementById("form-sns-website").value = r.snsWebsite || "";

    this.showModal("relative-form-modal");
  }

  openDetailModal(id) {
    const r = this.relatives.find(item => item.id === id);
    if (!r) return;

    document.getElementById("detail-modal-name").textContent = r.name;
    document.getElementById("detail-modal-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${r.city || 'Global'}, ${r.country || ''}`;

    const photoContainer = document.getElementById("detail-modal-avatar");
    if (photoContainer) {
      photoContainer.innerHTML = r.photo
        ? `<img src="${r.photo}" alt="${r.name}" class="detail-avatar-img">`
        : `<span class="detail-initials">${r.name.charAt(0)}</span>`;
    }

    document.getElementById("detail-email").textContent = r.email || "-";
    document.getElementById("detail-phone").textContent = r.phone || "-";
    document.getElementById("detail-address").textContent = r.address || "-";
    document.getElementById("detail-workplace").textContent = [r.workplace, r.jobTitle].filter(Boolean).join(" · ") || "-";
    document.getElementById("detail-workaddress").textContent = r.workAddress || "-";
    document.getElementById("detail-parent").textContent = r.parentName || "-";
    document.getElementById("detail-birthday").textContent = r.birthday || "-";
    document.getElementById("detail-notes").textContent = r.notes || "-";

    // SNS Container
    const snsContainer = document.getElementById("detail-sns-container");
    const snsSection = document.getElementById("detail-sns-section");
    if (snsContainer && snsSection) {
      const snsList = [];
      if (r.snsInstagram) snsList.push(`<a href="https://instagram.com/${r.snsInstagram.replace('@', '')}" target="_blank" class="detail-sns-btn ig"><i class="fa-brands fa-instagram"></i> Instagram (${r.snsInstagram})</a>`);
      if (r.snsLinkedIn) snsList.push(`<a href="${r.snsLinkedIn}" target="_blank" class="detail-sns-btn li"><i class="fa-brands fa-linkedin-in"></i> LinkedIn</a>`);
      if (r.snsFacebook) snsList.push(`<a href="${r.snsFacebook}" target="_blank" class="detail-sns-btn fb"><i class="fa-brands fa-facebook-f"></i> Facebook</a>`);
      if (r.snsYouTube) snsList.push(`<a href="${r.snsYouTube}" target="_blank" class="detail-sns-btn yt"><i class="fa-brands fa-youtube"></i> YouTube</a>`);
      if (r.snsTwitter) snsList.push(`<a href="https://twitter.com/${r.snsTwitter.replace('@', '')}" target="_blank" class="detail-sns-btn tw"><i class="fa-brands fa-x-twitter"></i> X (${r.snsTwitter})</a>`);
      if (r.snsWebsite) snsList.push(`<a href="${r.snsWebsite}" target="_blank" class="detail-sns-btn web"><i class="fa-solid fa-globe"></i> Website</a>`);

      if (snsList.length > 0) {
        snsContainer.innerHTML = snsList.join("");
        snsSection.style.display = "block";
      } else {
        snsSection.style.display = "none";
      }
    }

    const flyBtn = document.getElementById("detail-fly-map-btn");
    if (flyBtn) {
      flyBtn.onclick = () => {
        this.closeModal("relative-detail-modal");
        this.switchMainTab("map");
        if (r.city && this.mapManager) {
          this.mapManager.flyToCity(r.city);
        }
      };
    }

    this.showModal("relative-detail-modal");
  }

  saveRelative() {
    const name = document.getElementById("form-name").value.trim();
    const email = document.getElementById("form-email").value.trim();

    if (!name) {
      alert("Name is required.");
      return;
    }
    if (!email) {
      alert("Email is required.");
      return;
    }

    const data = {
      id: this.editingId || `rel-${Date.now()}`,
      name,
      email,
      country: document.getElementById("form-country").value.trim(),
      city: document.getElementById("form-city").value.trim(),
      parentName: document.getElementById("form-parent").value.trim(),
      phone: document.getElementById("form-phone").value.trim(),
      address: document.getElementById("form-address").value.trim(),
      workplace: document.getElementById("form-workplace").value.trim(),
      jobTitle: document.getElementById("form-jobtitle").value.trim(),
      workAddress: document.getElementById("form-workaddress").value.trim(),
      birthday: document.getElementById("form-birthday").value.trim(),
      notes: document.getElementById("form-notes").value.trim(),
      photo: this.currentPhotoData || document.getElementById("form-photo-url").value.trim(),
      snsInstagram: document.getElementById("form-sns-instagram").value.trim(),
      snsLinkedIn: document.getElementById("form-sns-linkedin").value.trim(),
      snsFacebook: document.getElementById("form-sns-facebook").value.trim(),
      snsYouTube: document.getElementById("form-sns-youtube").value.trim(),
      snsTwitter: document.getElementById("form-sns-twitter").value.trim(),
      snsWebsite: document.getElementById("form-sns-website").value.trim()
    };

    if (this.editingId) {
      const idx = this.relatives.findIndex(r => r.id === this.editingId);
      if (idx >= 0) this.relatives[idx] = data;
      this.showToast(window.I18N_DICTIONARY[this.currentLang].toastUpdated);
    } else {
      this.relatives.push(data);
      this.showToast(window.I18N_DICTIONARY[this.currentLang].toastSaved);
    }

    this.dataManager.saveRelatives(this.relatives);
    this.renderAll();
    this.closeModal("relative-form-modal");
  }

  deleteRelative(id) {
    const dict = window.I18N_DICTIONARY[this.currentLang];
    if (!confirm(dict.confirmDelete)) return;

    this.relatives = this.relatives.filter(r => r.id !== id);
    this.dataManager.saveRelatives(this.relatives);
    this.renderAll();
    this.showToast(dict.toastDeleted);
  }

  // Photo Upload & Preview
  handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      this.currentPhotoData = ev.target.result;
      this.updatePhotoPreview(this.currentPhotoData);
      const urlInput = document.getElementById("form-photo-url");
      if (urlInput) urlInput.value = "";
    };
    reader.readAsDataURL(file);
  }

  handlePhotoUrlChange(url) {
    this.currentPhotoData = url;
    this.updatePhotoPreview(url);
  }

  updatePhotoPreview(src) {
    const previewBox = document.getElementById("photo-preview-avatar");
    if (!previewBox) return;
    if (src) {
      previewBox.innerHTML = `<img src="${src}" alt="Photo" class="preview-img" onerror="this.parentElement.innerHTML='<i class=\'fa-solid fa-user\'></i>'">`;
    } else {
      previewBox.innerHTML = '<i class="fa-solid fa-user"></i>';
    }
  }

  resetPhotoPreview() {
    this.currentPhotoData = "";
    const previewBox = document.getElementById("photo-preview-avatar");
    if (previewBox) previewBox.innerHTML = '<i class="fa-solid fa-user"></i>';
    const fileInput = document.getElementById("relative-photo-file");
    if (fileInput) fileInput.value = "";
    const urlInput = document.getElementById("form-photo-url");
    if (urlInput) urlInput.value = "";
  }

  // Modal Show / Hide
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    }
  }

  // CSV & JSON Export / Import
  exportCSV() {
    const headers = ["Name", "Email", "Country", "City", "ParentName", "Phone", "Address", "Workplace", "JobTitle", "Birthday", "Notes"];
    const rows = this.relatives.map(r => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.country || '').replace(/"/g, '""')}"`,
      `"${(r.city || '').replace(/"/g, '""')}"`,
      `"${(r.parentName || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${(r.workplace || '').replace(/"/g, '""')}"`,
      `"${(r.jobTitle || '').replace(/"/g, '""')}"`,
      `"${(r.birthday || '').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ].join(","));

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const cfg = this.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    link.href = URL.createObjectURL(blob);
    link.download = `${cfg.familyName}_family_tree_directory.csv`;
    link.click();

    this.showToast(window.I18N_DICTIONARY[this.currentLang].toastCsvExported);
  }

  exportJSON() {
    const payload = {
      config: this.dataManager.activeConfig,
      relatives: this.relatives,
      exportedAt: new Date().toISOString(),
      version: "1.0.0"
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    const cfg = this.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    link.href = URL.createObjectURL(blob);
    link.download = `${cfg.familyName}_family_tree_backup.json`;
    link.click();

    this.showToast(window.I18N_DICTIONARY[this.currentLang].toastBackupExported);
  }

  importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.config) this.dataManager.saveConfig(data.config);
        if (Array.isArray(data.relatives)) {
          this.relatives = data.relatives;
          this.dataManager.saveRelatives(this.relatives);
        }
        if (data.config) this.updateBrandHeaders(data.config);
        this.renderAll();
        this.showToast("Family records restored from JSON backup!");
      } catch (err) {
        alert("Invalid backup file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  showToast(msg) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global bootstrap
document.addEventListener("DOMContentLoaded", () => {
  const app = new GeneralFamilyApp();
  app.init();
});
