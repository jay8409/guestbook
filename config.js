/**
 * Vercel & Supabase Cloud Connection Configuration
 * 
 * Supabase 대시보드(https://supabase.com)의 Project Settings -> API 에서
 * Project URL과 anon (public) key를 복사하여 아래에 입력하시면
 * Vercel 배포 사이트에서 별도 클릭 없이 자동으로 Supabase DB와 실시간 연동됩니다.
 */

window.SUPABASE_CONFIG = {
  url: "",     // 예: "https://xyzcompany.supabase.co"
  anonKey: ""  // 예: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
};
