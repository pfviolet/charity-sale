// ========================================
// Firebase 설정 & 프로그램 데이터
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyASsXc-xvrRYqR-VeMrdCFsA3hZmAJQjdA",
  authDomain: "charity-sale.firebaseapp.com",
  projectId: "charity-sale",
  storageBucket: "charity-sale.firebasestorage.app",
  messagingSenderId: "755054912713",
  appId: "1:755054912713:web:07876a461d263719ecd918"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ---- 프로그램 데이터 ----
const PROGRAMS = {
  leather: {
    id: 'leather',
    title: '밴어배너 대표와 함께하는 가죽공예',
    shortTitle: '가죽공예',
    instructor: '이반석 대표',
    instructorInfo: '국민대학교 금속공예 전공, 밴어배너 대표',
    duration: '40분',
    ageRequirement: '초등학생 이상, 성인 가능',
    description: '전문 가죽 장인과 함께 나만의 가죽 소품을 만들어보세요. 가죽 재단부터 바느질까지 직접 체험하며 세상에 하나뿐인 작품을 완성합니다.',
    emoji: '👜'
  },
  hanji: {
    id: 'hanji',
    title: '임희석 교수와 함께하는 한지공예',
    shortTitle: '한지공예',
    instructor: '임희석 교수',
    instructorInfo: '어울림 미술치료 센터장, 상명대학교 겸임교수',
    duration: '40분',
    ageRequirement: '6세 이상, 성인 가능',
    description: '전통 한지를 활용한 아름다운 공예 작품을 만들어보세요. 한지의 따뜻한 질감과 색감을 느끼며 나만의 작품을 완성합니다.',
    emoji: '🎨'
  },
  science: {
    id: 'science',
    title: '공학박사와 함께하는 과학실험',
    shortTitle: '과학실험',
    instructor: '최훈 박사',
    instructorInfo: '건축기술사',
    duration: '30분',
    ageRequirement: '초등학생 이상',
    description: '공학박사와 함께 신나는 과학실험을 체험해보세요. 재미있는 실험을 통해 과학 원리를 배우며 탐구하는 즐거움을 느낄 수 있습니다.',
    emoji: '🔬'
  },
  slime: {
    id: 'slime',
    title: '조물조물 슬라임 만들기',
    shortTitle: '슬라임 만들기',
    instructor: null,
    instructorInfo: null,
    duration: '30분',
    ageRequirement: '나이 제한 없음',
    description: '형형색색 나만의 슬라임을 직접 만들어보세요! 반짝이, 색소를 넣어 세상에 하나뿐인 나만의 슬라임을 완성합니다.',
    emoji: '🧪'
  }
};

// ---- 시간대 데이터 ----
const TIME_SLOTS = [
  { id: 1, time: '11:30', label: '1회차 11:30' },
  { id: 2, time: '13:00', label: '2회차 13:00' },
  { id: 3, time: '14:30', label: '3회차 14:30' },
  { id: 4, time: '16:00', label: '4회차 16:00' }
];

const MAX_CAPACITY = 6; // 회차당 정원

// ---- 행사 정보 ----
const EVENT_INFO = {
  church: '사랑과 평안의 교회',
  title: '지역사회 기부 바자회',
  date: '2026년 11월 14일 (토)',
  time: '11:00 ~ 17:00',
  dateShort: '2026.11.14(토)'
};

// ---- 사이트 URL (GitHub Pages 배포 후 변경) ----
const SITE_URL = 'https://YOUR_USERNAME.github.io/charity-bazaar';
