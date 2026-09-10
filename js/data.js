/**
 * ==============================================================================
 * General Family Tree - Dynamic Family Configuration & Relatives Storage
 * (범용 가계도 - 동적 가문 설정 및 친척 데이터 관리 엔진)
 * ==============================================================================
 */

const GFT_STORAGE = {
  CONFIG_KEY: "gft_active_family_config",
  RELATIVES_KEY: "gft_relatives_data",
  PROFILES_KEY: "gft_all_family_profiles"
};

// Default starter family profile if onboarding has not run
const DEFAULT_STARTER_CONFIG = {
  familyName: "Smith",
  familyNameKo: "스미스 (Smith)",
  countryCode: "US",
  countryNameEn: "United States",
  countryNameKo: "미국",
  countryFlag: "🇺🇸",
  majorCities: ["San Francisco", "Los Angeles", "New York", "Seattle", "Chicago", "London", "Seoul"],
  primaryCity: "San Francisco"
};

/**
 * Generate multi-generational starter relatives tailored to the configured family name & major cities
 */
function generateTailoredStarterRelatives(config) {
  const fName = config.familyName || "Smith";
  const cities = config.majorCities && config.majorCities.length > 0
    ? config.majorCities
    : ["San Francisco", "Los Angeles", "New York", "Seattle"];

  const c1 = cities[0] || "San Francisco";
  const c2 = cities[1] || cities[0] || "Los Angeles";
  const c3 = cities[2] || cities[0] || "New York";
  const c4 = cities[3] || cities[1] || "Seattle";
  const c5 = cities[4] || cities[0] || "Chicago";

  const country = config.countryNameEn || "United States";

  return [
    // === Generation 1: Patriarch (조부/선조 세대) ===
    {
      id: "rel-01",
      name: `Arthur ${fName}`,
      email: `arthur.${fName.toLowerCase()}@familyheritage.org`,
      country: country,
      city: c1,
      phone: "+1 (415) 555-0101",
      address: `100 Heritage Way, ${c1}`,
      workplace: "Heritage Foundation",
      jobTitle: "Founder & Senior Patriarch",
      workAddress: `500 Executive Blvd, ${c1}`,
      birthday: "1942-03-15",
      parentName: "",
      generation: 1,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
      snsInstagram: "",
      snsLinkedIn: `https://linkedin.com/in/arthur-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: "",
      snsWebsite: "https://familyheritage.org",
      notes: "Family patriarch and historian, dedicated to preserving our genealogy and guiding the next generations."
    },

    // === Generation 2: Sons & Daughters (부모 세대) ===
    {
      id: "rel-02",
      name: `Robert ${fName}`,
      email: `robert.${fName.toLowerCase()}@baytech.io`,
      country: country,
      city: c1,
      phone: "+1 (415) 555-0120",
      address: `240 Market St, ${c1}`,
      workplace: "Bay Area Innovations",
      jobTitle: "Chief Technology Officer (CTO)",
      workAddress: `101 Silicon Ave, ${c1}`,
      birthday: "1968-07-22",
      parentName: `Arthur ${fName}`,
      generation: 2,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@robert_${fName.toLowerCase()}`,
      snsLinkedIn: `https://linkedin.com/in/robert-${fName.toLowerCase()}`,
      snsFacebook: `https://facebook.com/robert.${fName.toLowerCase()}`,
      snsYouTube: "",
      snsTwitter: `@robert_${fName.toLowerCase()}`,
      snsWebsite: "",
      notes: "Eldest son; active in Silicon Valley software architecture and mentor to younger relatives."
    },
    {
      id: "rel-03",
      name: `Eleanor ${fName}`,
      email: `eleanor.${fName.toLowerCase()}@lawpartners.com`,
      country: country,
      city: c2,
      phone: "+1 (213) 555-0145",
      address: `550 Wilshire Blvd, ${c2}`,
      workplace: "Pacific Legal Group",
      jobTitle: "Senior Partner & International Attorney",
      workAddress: `800 Grand Ave, ${c2}`,
      birthday: "1971-11-08",
      parentName: `Arthur ${fName}`,
      generation: 2,
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@eleanor_${fName.toLowerCase()}`,
      snsLinkedIn: `https://linkedin.com/in/eleanor-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: "",
      snsWebsite: "https://pacificlegal.com",
      notes: "Second daughter; practicing corporate and international trade law in Los Angeles."
    },
    {
      id: "rel-04",
      name: `David ${fName}`,
      email: `david.${fName.toLowerCase()}@manhattanmedical.org`,
      country: country,
      city: c3,
      phone: "+1 (212) 555-0188",
      address: `740 Park Avenue, ${c3}`,
      workplace: "Metropolitan Medical Center",
      jobTitle: "Chief of Neurosurgery",
      workAddress: `1200 5th Ave, ${c3}`,
      birthday: "1974-04-19",
      parentName: `Arthur ${fName}`,
      generation: 2,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
      snsInstagram: "",
      snsLinkedIn: `https://linkedin.com/in/david-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: `https://youtube.com/@dr_david_${fName.toLowerCase()}`,
      snsTwitter: `@david_${fName.toLowerCase()}_md`,
      snsWebsite: "",
      notes: "Youngest son; neurosurgeon and clinical research professor in New York."
    },

    // === Generation 3: Grandchildren (자녀 세대) ===
    {
      id: "rel-05",
      name: `Lucas ${fName}`,
      email: `lucas.${fName.toLowerCase()}@globalfintech.io`,
      country: country,
      city: c1,
      phone: "+1 (415) 555-0230",
      address: `120 Mission St, ${c1}`,
      workplace: "Apex AI Labs",
      jobTitle: "Lead AI Systems Engineer",
      workAddress: `300 Howard St, ${c1}`,
      birthday: "1995-09-14",
      parentName: `Robert ${fName}`,
      generation: 3,
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@lucas_${fName.toLowerCase()}`,
      snsLinkedIn: `https://linkedin.com/in/lucas-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: `@lucas_${fName.toLowerCase()}`,
      snsWebsite: "https://lucas-ai.dev",
      notes: "Working on generative AI platforms; co-organizes international family meetups."
    },
    {
      id: "rel-06",
      name: `Sophia ${fName}`,
      email: `sophia.${fName.toLowerCase()}@designstudio.com`,
      country: country,
      city: c1,
      phone: "+1 (415) 555-0245",
      address: `880 Bush St, ${c1}`,
      workplace: "Lumina Creative Studio",
      jobTitle: "Creative Design Director",
      workAddress: `450 Sutter St, ${c1}`,
      birthday: "1998-02-27",
      parentName: `Robert ${fName}`,
      generation: 3,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@sophia_${fName.toLowerCase()}_art`,
      snsLinkedIn: `https://linkedin.com/in/sophia-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: `https://youtube.com/@sophia_${fName.toLowerCase()}`,
      snsTwitter: "",
      snsWebsite: "https://luminadesign.art",
      notes: "Award-winning digital product designer and curator of the family photo archive."
    },
    {
      id: "rel-07",
      name: `Ethan ${fName}`,
      email: `ethan.${fName.toLowerCase()}@aerospace.org`,
      country: country,
      city: c4,
      phone: "+1 (206) 555-0312",
      address: `410 Pine St, ${c4}`,
      workplace: "Pacific Aerospace Dynamics",
      jobTitle: "Orbital Systems Specialist",
      workAddress: `1600 Aerospace Way, ${c4}`,
      birthday: "1997-06-18",
      parentName: `Eleanor ${fName}`,
      generation: 3,
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@ethan_space_${fName.toLowerCase()}`,
      snsLinkedIn: `https://linkedin.com/in/ethan-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: `@ethan_${fName.toLowerCase()}`,
      snsWebsite: "",
      notes: "Passionate about aerospace exploration and satellite communications."
    },
    {
      id: "rel-08",
      name: `Chloe ${fName}`,
      email: `chloe.${fName.toLowerCase()}@columbia.edu`,
      country: country,
      city: c3,
      phone: "+1 (212) 555-0355",
      address: `320 Riverside Dr, ${c3}`,
      workplace: "Columbia University Medical",
      jobTitle: "Postdoctoral Research Fellow",
      workAddress: `630 W 168th St, ${c3}`,
      birthday: "2000-10-05",
      parentName: `David ${fName}`,
      generation: 3,
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@chloe_${fName.toLowerCase()}`,
      snsLinkedIn: `https://linkedin.com/in/chloe-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: "",
      snsWebsite: "",
      notes: "Conducting groundbreaking genomic research at Columbia Medical Center."
    },
    {
      id: "rel-09",
      name: `Oliver ${fName}`,
      email: `oliver.${fName.toLowerCase()}@chicagoarch.com`,
      country: country,
      city: c5,
      phone: "+1 (312) 555-0410",
      address: `150 Michigan Ave, ${c5}`,
      workplace: "Great Lakes Urban Architecture",
      jobTitle: "Sustainable Architect",
      workAddress: `200 Wacker Dr, ${c5}`,
      birthday: "2002-05-12",
      parentName: `David ${fName}`,
      generation: 3,
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&h=160&fit=crop&crop=face",
      snsInstagram: `@oliver_${fName.toLowerCase()}_builds`,
      snsLinkedIn: `https://linkedin.com/in/oliver-${fName.toLowerCase()}`,
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: "",
      snsWebsite: "",
      notes: "Designing eco-friendly urban landmarks along the Chicago Riverwalk."
    },

    // === Generation 4: Great-grandchildren (손자·손녀 세대) ===
    {
      id: "rel-10",
      name: `Noah ${fName}`,
      email: `noah.${fName.toLowerCase()}@futuregen.org`,
      country: country,
      city: c1,
      phone: "+1 (415) 555-0490",
      address: `120 Mission St, ${c1}`,
      workplace: "Bay Elementary & Arts Academy",
      jobTitle: "Youth Robotics Champion",
      workAddress: `800 Academy St, ${c1}`,
      birthday: "2020-08-30",
      parentName: `Lucas ${fName}`,
      generation: 4,
      photo: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=160&h=160&fit=crop&crop=face",
      snsInstagram: "",
      snsLinkedIn: "",
      snsFacebook: "",
      snsYouTube: "",
      snsTwitter: "",
      snsWebsite: "",
      notes: "Bright 4th generation child loving coding games, robotics, and piano."
    }
  ];
}

class FamilyDataManager {
  constructor() {
    this.activeConfig = this.loadConfig();
    this.relatives = this.loadRelatives();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(GFT_STORAGE.CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load family config:", e);
    }
    return null; // Signals that onboarding is required
  }

  saveConfig(config) {
    this.activeConfig = config;
    try {
      localStorage.setItem(GFT_STORAGE.CONFIG_KEY, JSON.stringify(config));
      // Also register in all saved profiles
      this.saveProfileToHistory(config);
    } catch (e) {
      console.error("Failed to save family config:", e);
    }
  }

  saveProfileToHistory(config) {
    try {
      let profiles = JSON.parse(localStorage.getItem(GFT_STORAGE.PROFILES_KEY) || "[]");
      const existsIdx = profiles.findIndex(p => p.familyName.toLowerCase() === config.familyName.toLowerCase());
      if (existsIdx >= 0) {
        profiles[existsIdx] = config;
      } else {
        profiles.push(config);
      }
      localStorage.setItem(GFT_STORAGE.PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.warn("Profile history error:", e);
    }
  }

  getAllProfiles() {
    try {
      return JSON.parse(localStorage.getItem(GFT_STORAGE.PROFILES_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  loadRelatives() {
    try {
      const saved = localStorage.getItem(GFT_STORAGE.RELATIVES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load relatives from localStorage:", e);
    }

    // Default generator
    const cfg = this.activeConfig || DEFAULT_STARTER_CONFIG;
    const initial = generateTailoredStarterRelatives(cfg);
    this.saveRelatives(initial);
    return initial;
  }

  saveRelatives(list) {
    this.relatives = list;
    try {
      localStorage.setItem(GFT_STORAGE.RELATIVES_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save relatives:", e);
    }
  }

  resetWithNewConfig(config) {
    this.saveConfig(config);
    const newRelatives = generateTailoredStarterRelatives(config);
    this.saveRelatives(newRelatives);
    return newRelatives;
  }
}

window.FamilyDataManager = FamilyDataManager;
window.generateTailoredStarterRelatives = generateTailoredStarterRelatives;
window.DEFAULT_STARTER_CONFIG = DEFAULT_STARTER_CONFIG;
