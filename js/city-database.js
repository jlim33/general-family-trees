/**
 * ==============================================================================
 * General Family Tree - Global Countries & Major Cities Database
 * (범용 가계도 - 글로벌 국가 및 주요 대도시 데이터베이스)
 * English First with Korean translation
 * ==============================================================================
 */

const GLOBAL_COUNTRIES = [
  {
    code: "US",
    nameEn: "United States",
    nameKo: "미국",
    flag: "🇺🇸",
    center: [39.8283, -98.5795],
    zoom: 4
  },
  {
    code: "KR",
    nameEn: "South Korea",
    nameKo: "대한민국",
    flag: "🇰🇷",
    center: [36.5, 127.8],
    zoom: 7
  },
  {
    code: "CA",
    nameEn: "Canada",
    nameKo: "캐나다",
    flag: "🇨🇦",
    center: [56.1304, -106.3468],
    zoom: 4
  },
  {
    code: "GB",
    nameEn: "United Kingdom",
    nameKo: "영국",
    flag: "🇬🇧",
    center: [55.3781, -3.4360],
    zoom: 6
  },
  {
    code: "AU",
    nameEn: "Australia",
    nameKo: "호주",
    flag: "🇦🇺",
    center: [-25.2744, 133.7751],
    zoom: 4
  },
  {
    code: "JP",
    nameEn: "Japan",
    nameKo: "일본",
    flag: "🇯🇵",
    center: [36.2048, 138.2529],
    zoom: 6
  },
  {
    code: "DE",
    nameEn: "Germany",
    nameKo: "독일",
    flag: "🇩🇪",
    center: [51.1657, 10.4515],
    zoom: 6
  },
  {
    code: "FR",
    nameEn: "France",
    nameKo: "프랑스",
    flag: "🇫🇷",
    center: [46.2276, 2.2137],
    zoom: 6
  },
  {
    code: "SG",
    nameEn: "Singapore",
    nameKo: "싱가포르",
    flag: "🇸🇬",
    center: [1.3521, 103.8198],
    zoom: 11
  },
  {
    code: "CN",
    nameEn: "China",
    nameKo: "중국",
    flag: "🇨🇳",
    center: [35.8617, 104.1954],
    zoom: 4
  },
  {
    code: "NZ",
    nameEn: "New Zealand",
    nameKo: "뉴질랜드",
    flag: "🇳🇿",
    center: [-40.9006, 174.8860],
    zoom: 5
  },
  {
    code: "WORLD",
    nameEn: "Worldwide / Other",
    nameKo: "전 세계 / 기타",
    flag: "🌐",
    center: [25.0, 0.0],
    zoom: 2
  }
];

const GLOBAL_MAJOR_CITIES = {
  US: [
    { nameEn: "San Francisco", nameKo: "샌프란시스코", state: "CA", lat: 37.7749, lng: -122.4194, isPopular: true },
    { nameEn: "Los Angeles", nameKo: "로스앤젤레스", state: "CA", lat: 34.0522, lng: -118.2437, isPopular: true },
    { nameEn: "New York", nameKo: "뉴욕", state: "NY", lat: 40.7128, lng: -74.0060, isPopular: true },
    { nameEn: "Seattle", nameKo: "시애틀", state: "WA", lat: 47.6062, lng: -122.3321, isPopular: true },
    { nameEn: "San Jose", nameKo: "산호세", state: "CA", lat: 37.3382, lng: -121.8863, isPopular: true },
    { nameEn: "Palo Alto", nameKo: "팔로 알토", state: "CA", lat: 37.4419, lng: -122.1430, isPopular: true },
    { nameEn: "Berkeley", nameKo: "버클리", state: "CA", lat: 37.8715, lng: -122.2730, isPopular: true },
    { nameEn: "Chicago", nameKo: "시카고", state: "IL", lat: 41.8781, lng: -87.6298, isPopular: true },
    { nameEn: "Boston", nameKo: "보스턴", state: "MA", lat: 42.3601, lng: -71.0589, isPopular: true },
    { nameEn: "Honolulu", nameKo: "호놀룰루 (하와이)", state: "HI", lat: 21.3069, lng: -157.8583, isPopular: true },
    { nameEn: "Austin", nameKo: "오스틴", state: "TX", lat: 30.2672, lng: -97.7431, isPopular: false },
    { nameEn: "Washington D.C.", nameKo: "워싱턴 D.C.", state: "DC", lat: 38.9072, lng: -77.0369, isPopular: false }
  ],

  KR: [
    { nameEn: "Seoul", nameKo: "서울", state: "수도권", lat: 37.5665, lng: 126.9780, isPopular: true },
    { nameEn: "Busan", nameKo: "부산", state: "영남", lat: 35.1796, lng: 129.0756, isPopular: true },
    { nameEn: "Jeonju", nameKo: "전주", state: "호남", lat: 35.8242, lng: 127.1480, isPopular: true },
    { nameEn: "Yongin", nameKo: "용인", state: "경기", lat: 37.2411, lng: 127.1776, isPopular: true },
    { nameEn: "Daejeon", nameKo: "대전", state: "충청", lat: 36.3504, lng: 127.3845, isPopular: true },
    { nameEn: "Daegu", nameKo: "대구", state: "영남", lat: 35.8714, lng: 128.6014, isPopular: true },
    { nameEn: "Gwangju", nameKo: "광주", state: "호남", lat: 35.1595, lng: 126.8526, isPopular: true },
    { nameEn: "Incheon", nameKo: "인천", state: "수도권", lat: 37.4563, lng: 126.7052, isPopular: true },
    { nameEn: "Suwon", nameKo: "수원", state: "경기", lat: 37.2636, lng: 127.0286, isPopular: true },
    { nameEn: "Jeju", nameKo: "제주", state: "제주", lat: 33.4996, lng: 126.5312, isPopular: true },
    { nameEn: "Sejong", nameKo: "세종", state: "충청", lat: 36.4800, lng: 127.2890, isPopular: false },
    { nameEn: "Ulsan", nameKo: "울산", state: "영남", lat: 35.5384, lng: 129.3114, isPopular: false }
  ],

  CA: [
    { nameEn: "Toronto", nameKo: "토론토", state: "ON", lat: 43.6532, lng: -79.3832, isPopular: true },
    { nameEn: "Vancouver", nameKo: "밴쿠버", state: "BC", lat: 49.2827, lng: -123.1207, isPopular: true },
    { nameEn: "Montreal", nameKo: "몬트리올", state: "QC", lat: 45.5017, lng: -73.5673, isPopular: true },
    { nameEn: "Calgary", nameKo: "캘거리", state: "AB", lat: 51.0447, lng: -114.0719, isPopular: true },
    { nameEn: "Ottawa", nameKo: "오타와", state: "ON", lat: 45.4215, lng: -75.6972, isPopular: true },
    { nameEn: "Edmonton", nameKo: "에드먼턴", state: "AB", lat: 53.5461, lng: -113.4938, isPopular: false }
  ],

  GB: [
    { nameEn: "London", nameKo: "런던", state: "ENG", lat: 51.5074, lng: -0.1278, isPopular: true },
    { nameEn: "Manchester", nameKo: "맨체스터", state: "ENG", lat: 53.4808, lng: -2.2426, isPopular: true },
    { nameEn: "Edinburgh", nameKo: "에든버러", state: "SCT", lat: 55.9533, lng: -3.1883, isPopular: true },
    { nameEn: "Birmingham", nameKo: "버밍엄", state: "ENG", lat: 52.4862, lng: -1.8904, isPopular: false },
    { nameEn: "Oxford", nameKo: "옥스퍼드", state: "ENG", lat: 51.7520, lng: -1.2577, isPopular: false }
  ],

  AU: [
    { nameEn: "Sydney", nameKo: "시드니", state: "NSW", lat: -33.8688, lng: 151.2093, isPopular: true },
    { nameEn: "Melbourne", nameKo: "멜버른", state: "VIC", lat: -37.8136, lng: 144.9631, isPopular: true },
    { nameEn: "Brisbane", nameKo: "브리즈번", state: "QLD", lat: -27.4698, lng: 153.0251, isPopular: true },
    { nameEn: "Perth", nameKo: "퍼스", state: "WA", lat: -31.9505, lng: 115.8605, isPopular: false },
    { nameEn: "Adelaide", nameKo: "애들레이드", state: "SA", lat: -34.9285, lng: 138.6007, isPopular: false }
  ],

  JP: [
    { nameEn: "Tokyo", nameKo: "도쿄", state: "관동", lat: 35.6762, lng: 139.6503, isPopular: true },
    { nameEn: "Osaka", nameKo: "오사카", state: "간사이", lat: 34.6937, lng: 135.5023, isPopular: true },
    { nameEn: "Kyoto", nameKo: "교토", state: "간사이", lat: 35.0116, lng: 135.7681, isPopular: true },
    { nameEn: "Fukuoka", nameKo: "후쿠오카", state: "큐슈", lat: 33.5904, lng: 130.4017, isPopular: false },
    { nameEn: "Sapporo", nameKo: "삿포로", state: "홋카이도", lat: 43.0618, lng: 141.3545, isPopular: false }
  ],

  WORLD: [
    { nameEn: "London", nameKo: "런던 (영국)", state: "UK", lat: 51.5074, lng: -0.1278, isPopular: true },
    { nameEn: "Paris", nameKo: "파리 (프랑스)", state: "FR", lat: 48.8566, lng: 2.3522, isPopular: true },
    { nameEn: "Berlin", nameKo: "베를린 (독일)", state: "DE", lat: 52.5200, lng: 13.4050, isPopular: true },
    { nameEn: "Singapore", nameKo: "싱가포르", state: "SG", lat: 1.3521, lng: 103.8198, isPopular: true },
    { nameEn: "Tokyo", nameKo: "도쿄 (일본)", state: "JP", lat: 35.6762, lng: 139.6503, isPopular: true },
    { nameEn: "Sydney", nameKo: "시드니 (호주)", state: "AU", lat: -33.8688, lng: 151.2093, isPopular: true },
    { nameEn: "New York", nameKo: "뉴욕 (미국)", state: "US", lat: 40.7128, lng: -74.0060, isPopular: true },
    { nameEn: "Seoul", nameKo: "서울 (한국)", state: "KR", lat: 37.5665, lng: 126.9780, isPopular: true }
  ]
};

// Popular Family Name Suggestions
const POPULAR_FAMILY_NAMES = [
  { en: "Smith", ko: "스미스 (Smith)", origin: "Global" },
  { en: "Kim", ko: "김 (Kim) - 김해 / 경주", origin: "Korean" },
  { en: "Johnson", ko: "존슨 (Johnson)", origin: "Global" },
  { en: "Lee", ko: "이 (Lee) - 전주 / 경주", origin: "Korean" },
  { en: "Williams", ko: "윌리엄스 (Williams)", origin: "Global" },
  { en: "Park", ko: "박 (Park) - 밀양 / 반남", origin: "Korean" },
  { en: "Brown", ko: "브라운 (Brown)", origin: "Global" },
  { en: "Choi", ko: "최 (Choi) - 경주 / 해주", origin: "Korean" },
  { en: "Garcia", ko: "가르시아 (Garcia)", origin: "Global" },
  { en: "Jung", ko: "정 (Jung) - 동래 / 연일", origin: "Korean" },
  { en: "Miller", ko: "밀러 (Miller)", origin: "Global" },
  { en: "Kang", ko: "강 (Kang) - 진주 / 신천", origin: "Korean" },
  { en: "Davis", ko: "데이비스 (Davis)", origin: "Global" },
  { en: "Cho", ko: "조 (Cho) - 풍양 / 창녕", origin: "Korean" },
  { en: "Wilson", ko: "윌슨 (Wilson)", origin: "Global" },
  { en: "Yoon", ko: "윤 (Yoon) - 파평 / 해남", origin: "Korean" },
  { en: "Lim", ko: "임 (Lim) - 조양 / 나주", origin: "Korean" }
];

window.GLOBAL_COUNTRIES = GLOBAL_COUNTRIES;
window.GLOBAL_MAJOR_CITIES = GLOBAL_MAJOR_CITIES;
window.POPULAR_FAMILY_NAMES = POPULAR_FAMILY_NAMES;
