/**
 * ==============================================================================
 * General Family Tree - 3-Step Interactive Onboarding Setup Wizard
 * (범용 가계도 - 3단계 인터랙티브 온보딩 위저드: 성씨, 국가, 대도시)
 * English First, followed by Korean
 * ==============================================================================
 */

class OnboardingWizard {
  constructor(app) {
    this.app = app;
    this.currentStep = 1;
    this.selectedFamilyName = "";
    this.selectedCountryCode = "US";
    this.selectedCities = new Set();
    this.primaryCity = "";
    this.customCities = [];

    this.initDOM();
  }

  initDOM() {
    this.modal = document.getElementById("onboarding-wizard-modal");
    this.stepTabs = document.querySelectorAll(".wizard-step-tab");
    this.stepPanels = document.querySelectorAll(".wizard-step-panel");

    this.inputFamilyName = document.getElementById("wizard-family-name-input");
    this.previewTitle = document.getElementById("wizard-preview-title");
    this.popularChipsContainer = document.getElementById("wizard-popular-chips");

    this.countryListContainer = document.getElementById("wizard-country-list");
    this.countrySearchInput = document.getElementById("wizard-country-search");

    this.majorCitiesContainer = document.getElementById("wizard-major-cities-chips");
    this.selectedCitiesContainer = document.getElementById("wizard-selected-cities-list");
    this.customCityInput = document.getElementById("wizard-custom-city-input");
    this.addCustomCityBtn = document.getElementById("wizard-add-city-btn");
    this.citiesCountryTitle = document.getElementById("wizard-cities-country-title");

    this.btnBack = document.getElementById("wizard-btn-back");
    this.btnNext = document.getElementById("wizard-btn-next");
    this.btnLaunch = document.getElementById("wizard-btn-launch");
    this.btnClose = document.getElementById("wizard-btn-close");

    this.bindEvents();
  }

  bindEvents() {
    // Step 1: Family Name input
    if (this.inputFamilyName) {
      this.inputFamilyName.addEventListener("input", () => {
        this.selectedFamilyName = this.inputFamilyName.value.trim();
        this.updatePreviewTitle();
        this.updateNavButtons();
      });
      this.inputFamilyName.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && this.selectedFamilyName.length > 0) {
          this.goToStep(2);
        }
      });
    }

    // Step 2: Country search
    if (this.countrySearchInput) {
      this.countrySearchInput.addEventListener("input", (e) => {
        this.renderCountryList(e.target.value.toLowerCase().trim());
      });
    }

    // Step 3: Add Custom City
    if (this.addCustomCityBtn && this.customCityInput) {
      const addCity = () => {
        const val = this.customCityInput.value.trim();
        if (val && !this.selectedCities.has(val)) {
          this.selectedCities.add(val);
          this.customCities.push(val);
          this.customCityInput.value = "";
          this.renderSelectedCities();
          this.updateNavButtons();
        }
      };

      this.addCustomCityBtn.addEventListener("click", addCity);
      this.customCityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addCity();
        }
      });
    }

    // Navigation buttons
    if (this.btnBack) {
      this.btnBack.addEventListener("click", () => {
        if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener("click", () => {
        if (this.currentStep < 3) this.goToStep(this.currentStep + 1);
      });
    }

    if (this.btnLaunch) {
      this.btnLaunch.addEventListener("click", () => {
        this.finishWizard();
      });
    }

    if (this.btnClose) {
      this.btnClose.addEventListener("click", () => {
        this.closeModal();
      });
    }
  }

  openModal(prefillConfig = null) {
    if (prefillConfig) {
      this.selectedFamilyName = prefillConfig.familyName || "";
      this.selectedCountryCode = prefillConfig.countryCode || "US";
      this.selectedCities = new Set(prefillConfig.majorCities || []);
      this.primaryCity = prefillConfig.primaryCity || "";
      if (this.inputFamilyName) this.inputFamilyName.value = this.selectedFamilyName;
    } else {
      this.selectedFamilyName = "";
      this.selectedCountryCode = "US";
      this.selectedCities = new Set(["San Francisco", "Los Angeles", "New York"]);
      this.primaryCity = "San Francisco";
      if (this.inputFamilyName) this.inputFamilyName.value = "";
    }

    this.renderPopularChips();
    this.renderCountryList();
    this.updatePreviewTitle();
    this.goToStep(1);

    if (this.modal) {
      this.modal.classList.remove("hidden");
      this.modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add("hidden");
      this.modal.classList.remove("flex");
      document.body.style.overflow = "";
    }
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;

    // Update Step Tabs
    this.stepTabs.forEach(tab => {
      const step = parseInt(tab.dataset.step, 10);
      tab.classList.toggle("active", step === this.currentStep);
      tab.classList.toggle("completed", step < this.currentStep);
    });

    // Update Step Panels
    this.stepPanels.forEach(panel => {
      const step = parseInt(panel.dataset.step, 10);
      panel.classList.toggle("active", step === this.currentStep);
      panel.classList.toggle("hidden", step !== this.currentStep);
    });

    // When entering Step 3, populate city chips for selected country
    if (this.currentStep === 3) {
      this.setupStep3Cities();
    }

    this.updateNavButtons();

    // Auto-focus input
    if (this.currentStep === 1 && this.inputFamilyName) {
      setTimeout(() => this.inputFamilyName.focus(), 150);
    }
  }

  updateNavButtons() {
    if (this.btnBack) {
      this.btnBack.style.visibility = this.currentStep > 1 ? "visible" : "hidden";
    }

    if (this.btnNext && this.btnLaunch) {
      if (this.currentStep === 3) {
        this.btnNext.classList.add("hidden");
        this.btnLaunch.classList.remove("hidden");
        // Launch is enabled if at least 1 city is selected
        this.btnLaunch.disabled = this.selectedCities.size === 0 || !this.selectedFamilyName;
      } else {
        this.btnNext.classList.remove("hidden");
        this.btnLaunch.classList.add("hidden");
        if (this.currentStep === 1) {
          this.btnNext.disabled = !this.selectedFamilyName || this.selectedFamilyName.length < 1;
        } else if (this.currentStep === 2) {
          this.btnNext.disabled = !this.selectedCountryCode;
        }
      }
    }
  }

  updatePreviewTitle() {
    if (!this.previewTitle) return;
    const isEn = (window.app && window.app.currentLang === "en") || true;
    const name = this.selectedFamilyName || "Your Family";
    this.previewTitle.textContent = isEn
      ? `The ${name} Family Tree & Global Lineage`
      : `${name} 가문 족보 & 글로벌 친족 계통도`;
  }

  renderPopularChips() {
    if (!this.popularChipsContainer || !window.POPULAR_FAMILY_NAMES) return;
    this.popularChipsContainer.innerHTML = window.POPULAR_FAMILY_NAMES.map(item => {
      return `
        <button 
          type="button" 
          class="wizard-chip ${this.selectedFamilyName.toLowerCase() === item.en.toLowerCase() ? 'active' : ''}" 
          data-name="${item.en}"
        >
          <span class="chip-primary">${item.en}</span>
          <span class="chip-sub">(${item.ko})</span>
        </button>
      `;
    }).join("");

    this.popularChipsContainer.querySelectorAll(".wizard-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        this.selectedFamilyName = name;
        if (this.inputFamilyName) this.inputFamilyName.value = name;
        this.popularChipsContainer.querySelectorAll(".wizard-chip").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        this.updatePreviewTitle();
        this.updateNavButtons();
      });
    });
  }

  renderCountryList(query = "") {
    if (!this.countryListContainer || !window.GLOBAL_COUNTRIES) return;
    const countries = window.GLOBAL_COUNTRIES.filter(c => {
      if (!query) return true;
      return c.nameEn.toLowerCase().includes(query) ||
             c.nameKo.includes(query) ||
             c.code.toLowerCase().includes(query);
    });

    this.countryListContainer.innerHTML = countries.map(c => {
      const isSelected = c.code === this.selectedCountryCode;
      return `
        <div class="country-card ${isSelected ? 'selected' : ''}" data-code="${c.code}">
          <span class="country-flag">${c.flag}</span>
          <div class="country-meta">
            <div class="country-name-en">${c.nameEn}</div>
            <div class="country-name-ko">${c.nameKo}</div>
          </div>
          ${isSelected ? '<i class="fa-solid fa-circle-check country-check-icon"></i>' : ''}
        </div>
      `;
    }).join("");

    this.countryListContainer.querySelectorAll(".country-card").forEach(card => {
      card.addEventListener("click", () => {
        this.selectedCountryCode = card.dataset.code;
        this.countryListContainer.querySelectorAll(".country-card").forEach(c => {
          c.classList.remove("selected");
          const ic = c.querySelector(".country-check-icon");
          if (ic) ic.remove();
        });
        card.classList.add("selected");
        card.insertAdjacentHTML("beforeend", '<i class="fa-solid fa-circle-check country-check-icon"></i>');
        this.updateNavButtons();

        // If user double clicks or selects, enable smooth progression
        setTimeout(() => {
          this.goToStep(3);
        }, 250);
      });
    });
  }

  setupStep3Cities() {
    const countryObj = window.GLOBAL_COUNTRIES.find(c => c.code === this.selectedCountryCode) || window.GLOBAL_COUNTRIES[0];
    if (this.citiesCountryTitle) {
      this.citiesCountryTitle.innerHTML = `${countryObj.flag} ${countryObj.nameEn} (${countryObj.nameKo})`;
    }

    // Default pre-select first 3 popular cities for this country if none selected yet
    const majorList = window.GLOBAL_MAJOR_CITIES[this.selectedCountryCode] || window.GLOBAL_MAJOR_CITIES["US"];
    if (this.selectedCities.size === 0) {
      majorList.slice(0, 4).forEach(c => this.selectedCities.add(c.nameEn));
    }

    this.renderMajorCityChips(majorList);
    this.renderSelectedCities();
  }

  renderMajorCityChips(majorList) {
    if (!this.majorCitiesContainer) return;

    this.majorCitiesContainer.innerHTML = majorList.map(c => {
      const isSelected = this.selectedCities.has(c.nameEn);
      return `
        <button 
          type="button" 
          class="city-chip ${isSelected ? 'active' : ''}" 
          data-city="${c.nameEn}"
        >
          <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-location-dot'}"></i>
          <span class="city-name-en">${c.nameEn}</span>
          <span class="city-name-ko">(${c.nameKo})</span>
        </button>
      `;
    }).join("");

    this.majorCitiesContainer.querySelectorAll(".city-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const city = chip.dataset.city;
        if (this.selectedCities.has(city)) {
          this.selectedCities.delete(city);
          chip.classList.remove("active");
          const ic = chip.querySelector("i");
          if (ic) ic.className = "fa-solid fa-location-dot";
        } else {
          this.selectedCities.add(city);
          chip.classList.add("active");
          const ic = chip.querySelector("i");
          if (ic) ic.className = "fa-solid fa-check";
        }
        this.renderSelectedCities();
        this.updateNavButtons();
      });
    });
  }

  renderSelectedCities() {
    if (!this.selectedCitiesContainer) return;
    const cities = Array.from(this.selectedCities);

    if (cities.length === 0) {
      this.selectedCitiesContainer.innerHTML = `
        <div class="empty-cities-hint">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Please select at least 1 major city where your relatives reside.
        </div>
      `;
      return;
    }

    // Ensure primary city is in selected list
    if (!this.primaryCity || !this.selectedCities.has(this.primaryCity)) {
      this.primaryCity = cities[0];
    }

    this.selectedCitiesContainer.innerHTML = cities.map((city, idx) => {
      const isPrimary = city === this.primaryCity;
      return `
        <div class="selected-city-badge ${isPrimary ? 'primary-hub' : ''}">
          <button 
            type="button" 
            class="star-hub-btn" 
            title="${isPrimary ? 'Primary Headquarters Hub' : 'Set as Primary Hub'}"
            onclick="window.wizard.setPrimaryCity('${city}')"
          >
            <i class="fa-${isPrimary ? 'solid' : 'regular'} fa-star"></i>
          </button>
          <span class="badge-city-name">${city}</span>
          ${isPrimary ? '<span class="primary-tag">Primary Hub</span>' : ''}
          <button 
            type="button" 
            class="remove-city-btn" 
            title="Remove city" 
            onclick="window.wizard.removeCity('${city}')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join("");
  }

  setPrimaryCity(city) {
    if (this.selectedCities.has(city)) {
      this.primaryCity = city;
      this.renderSelectedCities();
    }
  }

  removeCity(city) {
    this.selectedCities.delete(city);
    // Update chip if exists
    if (this.majorCitiesContainer) {
      const chip = this.majorCitiesContainer.querySelector(`[data-city="${city}"]`);
      if (chip) {
        chip.classList.remove("active");
        const ic = chip.querySelector("i");
        if (ic) ic.className = "fa-solid fa-location-dot";
      }
    }
    this.renderSelectedCities();
    this.updateNavButtons();
  }

  finishWizard() {
    if (!this.selectedFamilyName) {
      alert("Please enter your family name.");
      this.goToStep(1);
      return;
    }

    if (this.selectedCities.size === 0) {
      alert("Please select at least one major city.");
      return;
    }

    const countryObj = window.GLOBAL_COUNTRIES.find(c => c.code === this.selectedCountryCode) || window.GLOBAL_COUNTRIES[0];
    const citiesArray = Array.from(this.selectedCities);

    const config = {
      familyName: this.selectedFamilyName,
      countryCode: this.selectedCountryCode,
      countryNameEn: countryObj.nameEn,
      countryNameKo: countryObj.nameKo,
      countryFlag: countryObj.flag,
      majorCities: citiesArray,
      primaryCity: this.primaryCity || citiesArray[0]
    };

    if (this.app) {
      this.app.applyFamilyConfig(config, true);
    }

    this.closeModal();
  }
}

window.OnboardingWizard = OnboardingWizard;
