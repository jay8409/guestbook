# 🔮 Glass Guestbook (글래스모피즘 익명 & 카카오 SSO 방명록)

> 회원가입 없이 누구나 자유롭게 메시지를 남기고, 카카오 계정 1초 로그인(Kakao SSO)으로 비밀번호 입력 없이 손쉽게 방명록을 작성하고 관리하는 웹 애플리케이션입니다.

---

## 🌟 주요 기능 (Key Features)

- **카카오 SSO 1초 로그인**: 노란색 `[카카오 1초 로그인]` 버튼으로 간편 인증 (`Supabase Auth Kakao Provider` 연동)
- **자동 프로필 반영**: 로그인 시 카카오 닉네임과 카카오 프로필 아바타가 작성 폼에 자동 입력됨
- **비밀번호 없는 간편 관리**: 카카오 로그인 상태에서는 작성 시 비밀번호 생략 가능하며, 본인이 작성한 글/답글은 비밀번호 팝업 없이 1클릭 수정 및 삭제 지원
- **익명 작성 지원**: 카카오 로그인 없이도 닉네임과 비밀번호를 입력하여 익명으로 방명록 작성 가능
- **비밀글 지원**: 비밀글 선택 시 본문이 잠금 마스킹 처리되며, 작성자 본인 로그인 또는 비밀번호 입력으로 해제
- **1단계 답글 (댓글) 시스템**: 각 방명록마다 독립된 답글 작성 및 답글 수정/삭제 지원
- **공감 / 좋아요 버블**: 방명록에 대해 하트 반응 클릭 및 실시간 공감 카운트 증가
- **검색 및 정렬**: 작성자 닉네임 또는 본문 키워드 실시간 검색 및 최신순 / 오래된순 / 인기순 정렬
- **글래스모피즘 UI**: 은은한 3D 앰비언트 글로우 애니메이션과 유리 질감 카드 디자인
- **LocalStorage & Supabase Cloud**: 브라우저 로컬 저장소 및 Supabase 클라우드 데이터베이스 완벽 연동

---

## 🔑 카카오 로그인 설정 안내 (Kakao Developers Setup)

카카오 SSO 로그인을 실제로 동작시키려면 아래 3단계를 수행해 주세요.

### Step 1. 카카오 디벨로퍼스 앱 생성
1. [Kakao Developers](https://developers.kakao.com) 로그인 ➔ **[내 애플리케이션]** ➔ **[애플리케이션 추가하기]** 클릭
2. 앱 이름과 사업자명을 입력 후 생성
3. **[앱 설정] ➔ [요약 정보]** 에서 **`REST API 키`** 복사

### Step 2. 카카오 로그인 활성화 & Redirect URI 설정
1. **[제품 설정] ➔ [카카오 로그인]** ➔ 활성화 설정에서 **`ON`**으로 변경
2. **Redirect URI 등록** 버튼 클릭 후 아래 Supabase Callback URL 입력:
   `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
3. **[제품 설정] ➔ [카카오 로그인] ➔ [보안]** 에서 **`Client Secret`** 코드 생성 및 복사

### Step 3. Supabase Auth에 카카오 Provider 설정
1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인 ➔ **[Authentication] ➔ [Providers]** 클릭
2. **Kakao** 선택 ➔ **`Enabled`** 체크
3. 복사한 **`REST API Key`** (Client ID)와 **`Client Secret`** 입력 후 저장!

---

## 📁 프로젝트 구조 (Project Structure)

```text
guestbook/
├── index.html                # 방명록 웹 메인 레이아웃 & 카카오 SSO 로그인 바
├── styles.css                # 글래스모피즘 다크 모드 & 카카오 시그니처 버튼 CSS
├── app.js                    # Supabase Auth 카카오 OAuth, C.R.U.D, 본인인증 분기 로직
├── config.js                 # Vercel & Supabase Cloud 자동 연동 설정 파일
├── docs/                     # 요구사항, API 명세서 및 SQL 스크립트
│   ├── requirements.md       # 요구사항 정의서 (Markdown)
│   ├── requirements.doc      # 요구사항 정의서 (Word 문서)
│   ├── api-spec.md           # RESTful CRUD API 명세서 (Markdown)
│   ├── api-spec.doc          # RESTful CRUD API 명세서 (Word 문서)
│   ├── supabase_schema.sql   # 테이블 생성 SQL 스크립트
│   ├── supabase_seed.sql     # 테이블 생성 + 테스트 데이터 스크립트
│   └── supabase_kakao_schema.sql # 카카오 SSO user_id 컬럼 추가 SQL 스크립트
└── README.md
```

---

## 🚀 실행 방법 (Getting Started)

별도의 백엔드 설치나 패키지 매니저 없이 `index.html` 파일을 브라우저에서 열거나 정적 웹 서버를 통해 실행할 수 있습니다.

```bash
# Python으로 로컬 서버 실행 시
python -m http.server 8080
```
접속 URL: `http://localhost:8080` (또는 `https://guestbook-neon.vercel.app`)
