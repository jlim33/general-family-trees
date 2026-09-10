/**
 * ==============================================================================
 * General Family Tree - Dynamic Leaflet Map Engine
 * (범용 가계도 - 동적 거점 대도시 및 글로벌 친척 거주 지도 엔진)
 * ==============================================================================
 */

class GeneralFamilyMap {
  constructor(app) {
    this.app = app;
    this.map = null;
    this.markerGroup = null;
    this.pulseLayerGroup = null;
  }

  init() {
    const mapEl = document.getElementById("clan-leaflet-map");
    if (!mapEl) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    const cfg = this.app.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const countryObj = window.GLOBAL_COUNTRIES.find(c => c.code === cfg.countryCode) || window.GLOBAL_COUNTRIES[0];
    const initialCenter = countryObj.center || [39.8283, -98.5795];
    const initialZoom = countryObj.zoom || 4;

    this.map = L.map("clan-leaflet-map", {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Elegant CartoDB Positron tiles for high-end aesthetic
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(this.map);

    this.markerGroup = L.layerGroup().addTo(this.map);
    this.pulseLayerGroup = L.layerGroup().addTo(this.map);

    this.renderMarkers(this.app.relatives);
  }

  getCityCoordinates(cityName, countryCode) {
    // Check in country's major cities
    if (countryCode && window.GLOBAL_MAJOR_CITIES[countryCode]) {
      const match = window.GLOBAL_MAJOR_CITIES[countryCode].find(c => 
        c.nameEn.toLowerCase() === cityName.toLowerCase() || 
        c.nameKo.includes(cityName)
      );
      if (match) return [match.lat, match.lng];
    }

    // Search all major cities across all countries
    for (const cCode in window.GLOBAL_MAJOR_CITIES) {
      const match = window.GLOBAL_MAJOR_CITIES[cCode].find(c => 
        c.nameEn.toLowerCase() === cityName.toLowerCase() || 
        c.nameKo.includes(cityName)
      );
      if (match) return [match.lat, match.lng];
    }

    // Hash fallback for unlisted custom cities to prevent breakage
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    const latOffset = (Math.abs(hash) % 200) / 50 - 2;
    const lngOffset = (Math.abs(hash >> 3) % 200) / 50 - 2;

    const countryObj = window.GLOBAL_COUNTRIES.find(c => c.code === countryCode) || window.GLOBAL_COUNTRIES[0];
    return [countryObj.center[0] + latOffset, countryObj.center[1] + lngOffset];
  }

  renderMarkers(relatives) {
    if (!this.map || !this.markerGroup) return;

    this.markerGroup.clearLayers();
    this.pulseLayerGroup.clearLayers();

    const cfg = this.app.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const majorCities = new Set(cfg.majorCities || []);
    const isEn = this.app.currentLang === "en";

    // Group relatives by city
    const cityGroups = {};
    relatives.forEach(r => {
      const city = r.city || "Unknown";
      if (!cityGroups[city]) {
        cityGroups[city] = {
          cityName: city,
          country: r.country || cfg.countryNameEn,
          relatives: []
        };
      }
      cityGroups[city].relatives.push(r);
    });

    // Also include major hubs from config even if 0 relatives currently registered
    majorCities.forEach(city => {
      if (!cityGroups[city]) {
        cityGroups[city] = {
          cityName: city,
          country: cfg.countryNameEn,
          relatives: []
        };
      }
    });

    const bounds = L.latLngBounds();
    let hasCoords = false;

    Object.values(cityGroups).forEach(group => {
      const [lat, lng] = this.getCityCoordinates(group.cityName, cfg.countryCode);
      const isMajorHub = majorCities.has(group.cityName);
      const isPrimary = group.cityName === cfg.primaryCity;
      const count = group.relatives.length;

      bounds.extend([lat, lng]);
      hasCoords = true;

      // Pulsating golden radar ripple for major family hubs
      if (isMajorHub) {
        const pulseHtml = `
          <div class="map-pulse-marker ${isPrimary ? 'primary-pulse' : ''}">
            <div class="pulse-ring"></div>
            <div class="pulse-core">${count > 0 ? count : '★'}</div>
          </div>
        `;

        const pulseIcon = L.divIcon({
          html: pulseHtml,
          className: "custom-pulse-div-icon",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18]
        });

        const pulseMarker = L.marker([lat, lng], { icon: pulseIcon }).addTo(this.pulseLayerGroup);
        pulseMarker.bindPopup(this.createPopupHtml(group, isMajorHub, isPrimary));
      } else {
        // Standard pin for other cities
        const pinHtml = `
          <div class="map-standard-pin">
            <span>${count}</span>
          </div>
        `;

        const pinIcon = L.divIcon({
          html: pinHtml,
          className: "custom-pin-div-icon",
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -13]
        });

        const pinMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(this.markerGroup);
        pinMarker.bindPopup(this.createPopupHtml(group, false, false));
      }
    });

    // Fit map bounds if multiple coordinates exist
    if (hasCoords && bounds.isValid() && Object.keys(cityGroups).length > 1) {
      setTimeout(() => {
        try {
          this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
        } catch (e) {
          console.warn("Bounds fit error:", e);
        }
      }, 200);
    }
  }

  createPopupHtml(group, isMajorHub, isPrimary) {
    const isEn = this.app.currentLang === "en";
    const dict = window.I18N_DICTIONARY[this.app.currentLang] || window.I18N_DICTIONARY.en;

    const badgeLabel = isPrimary 
      ? (isEn ? "👑 PRIMARY FAMILY HUB" : "👑 최우선 핵심 거점")
      : isMajorHub 
        ? dict.mapPopupHubBadge 
        : dict.mapPopupNormalBadge;

    let relativesListHtml = "";
    if (group.relatives.length > 0) {
      relativesListHtml = `
        <div class="popup-relatives-list">
          <div class="popup-list-title">${dict.mapPopupResidents} <strong>${group.relatives.length}${isEn ? ' members' : '명'}</strong></div>
          <div class="popup-members-grid">
            ${group.relatives.map(r => `
              <div class="popup-member-chip" onclick="window.app.openDetailModal('${r.id}')">
                <span class="member-chip-avatar">${r.name.charAt(0)}</span>
                <span class="member-chip-name">${r.name}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    } else {
      relativesListHtml = `
        <div class="popup-empty-notice">
          ${dict.mapPopupNoRelatives}
        </div>
      `;
    }

    return `
      <div class="map-hub-popup">
        <div class="popup-header">
          <span class="popup-badge ${isPrimary ? 'primary' : isMajorHub ? 'major' : ''}">${badgeLabel}</span>
          <h4 class="popup-city-title">${group.cityName}</h4>
          <span class="popup-country">${group.country}</span>
        </div>
        ${relativesListHtml}
        <button type="button" class="popup-filter-btn" onclick="window.app.filterByCity('${group.cityName}')">
          <i class="fa-solid fa-filter"></i> ${dict.mapPopupViewList}
        </button>
      </div>
    `;
  }

  flyToCity(cityName) {
    if (!this.map) return;
    const cfg = this.app.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const [lat, lng] = this.getCityCoordinates(cityName, cfg.countryCode);
    this.map.flyTo([lat, lng], 11, { duration: 1.5 });
  }

  flyToCountry() {
    if (!this.map) return;
    const cfg = this.app.dataManager.activeConfig || window.DEFAULT_STARTER_CONFIG;
    const countryObj = window.GLOBAL_COUNTRIES.find(c => c.code === cfg.countryCode) || window.GLOBAL_COUNTRIES[0];
    this.map.flyTo(countryObj.center, countryObj.zoom, { duration: 1.5 });
  }

  flyToWorld() {
    if (!this.map) return;
    this.map.flyTo([25.0, 0.0], 2, { duration: 1.5 });
  }
}

window.GeneralFamilyMap = GeneralFamilyMap;
