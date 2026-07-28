export const MOCK_USER = {
  id: 1,
  member_key: "test_user_001",
  name: "김환경",
  points: 750,
};

export const MOCK_MISSIONS = [
  {
    id: 1,
    type: "receipt",
    title: "모바일 영수증 미션",
    description: "롯데백화점에서 구매 후 모바일 영수증을 발급받으세요!",
    points: 100,
    completed_today: false,
  },
  {
    id: 2,
    type: "basket",
    title: "장바구니 미션",
    description: "롯데백화점 장바구니를 사용하고 QR코드를 촬영하세요!",
    points: 150,
    completed_today: false,
  },
  {
    id: 3,
    type: "tumbler",
    title: "다회용기/텀블러 미션",
    description: "다회용기나 텀블러를 사용하고 QR코드를 촬영하세요!",
    points: 150,
    completed_today: true,
  },
  {
    id: 4,
    type: "reals",
    title: "리얼스 미션",
    description: "리얼스에서 제품을 판매하고 포인트를 적립하세요!",
    points: 200,
    completed_today: false,
  },
  {
    id: 5,
    type: "daily",
    title: "데일리 일상 미션",
    description: "오늘의 친환경 활동을 사진으로 인증하세요!",
    points: 50,
    completed_today: false,
  },
];

export const MOCK_POINT_HISTORY = [
  { id: 1, type: "earn", amount: 150, description: "다회용기/텀블러 미션 참여", created_at: "2026-07-27 09:12" },
  { id: 2, type: "earn", amount: 100, description: "모바일 영수증 미션 참여", created_at: "2026-07-26 14:33" },
  { id: 3, type: "use",  amount: 300, description: "에코백 교환", created_at: "2026-07-25 11:05" },
  { id: 4, type: "earn", amount: 200, description: "리얼스 미션 참여", created_at: "2026-07-24 18:20" },
  { id: 5, type: "earn", amount: 150, description: "장바구니 미션 참여", created_at: "2026-07-23 10:45" },
  { id: 6, type: "earn", amount: 50,  description: "데일리 일상 미션 참여", created_at: "2026-07-23 09:30" },
  { id: 7, type: "earn", amount: 400, description: "리얼스 미션 참여", created_at: "2026-07-22 16:10" },
];

export const MOCK_REWARDS = [
  { id: 1, title: "스타벅스 아메리카노", required_points: 500, stock: 50, image_emoji: "☕" },
  { id: 2, title: "롯데백화점 상품권 1만원", required_points: 1000, stock: 20, image_emoji: "🎁" },
  { id: 3, title: "에코백", required_points: 300, stock: 100, image_emoji: "👜" },
];

export const MOCK_BANNERS = [
  { id: 1, title: "그린 조이너스", subtitle: "지구를 위한 작은 실천, 함께 해요!", bg: "bg-[#1A1A1A]" },
];

// 관리자용 더미 데이터
export const MOCK_PARTICIPATIONS = [
  { id: 1, name: "김환경", member_key: "test_001", mission_title: "다회용기/텀블러 미션", earned_points: 150, status: "completed", created_at: "2026-07-27 09:12" },
  { id: 2, name: "이녹색", member_key: "test_002", mission_title: "모바일 영수증 미션", earned_points: 100, status: "completed", created_at: "2026-07-26 14:33" },
  { id: 3, name: "박지구", member_key: "test_003", mission_title: "데일리 일상 미션", earned_points: 50,  status: "completed", created_at: "2026-07-26 11:05" },
  { id: 4, name: "최친환", member_key: "test_004", mission_title: "리얼스 미션", earned_points: 200, status: "completed", created_at: "2026-07-25 18:20" },
  { id: 5, name: "정경", member_key: "test_005", mission_title: "장바구니 미션", earned_points: 150, status: "completed", created_at: "2026-07-25 10:45" },
];

export const MOCK_MEMBERS = [
  { id: 1, member_key: "test_001", name: "김환경", points: 750, joined_at: "2026-06-01" },
  { id: 2, member_key: "test_002", name: "이녹색", points: 320, joined_at: "2026-06-03" },
  { id: 3, member_key: "test_003", name: "박지구", points: 1100, joined_at: "2026-06-05" },
  { id: 4, member_key: "test_004", name: "최친환", points: 200, joined_at: "2026-06-10" },
  { id: 5, member_key: "test_005", name: "정경", points: 450, joined_at: "2026-06-12" },
];

export const MOCK_REWARD_REQUESTS = [
  { id: 1, name: "박지구", reward_title: "에코백", used_points: 300, status: "pending", created_at: "2026-07-26 15:00" },
  { id: 2, name: "김환경", reward_title: "스타벅스 아메리카노", used_points: 500, status: "completed", created_at: "2026-07-25 11:00" },
];
