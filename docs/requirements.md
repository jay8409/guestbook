# 익명 방명록 웹 애플리케이션 요구사항 정의서 (Requirements Specification)

**작성일시**: 2026-08-08  
**상태**: 최종 확정 (Approved)

---

## 1. 프로젝트 개요 (Overview)
본 프로젝트는 별도의 회원가입이나 로그인 절차 없이, 사용자가 익명으로 방명록 작성 및 답글 달기를 수행할 수 있는 웹 애플리케이션 개발을 목표로 합니다. 작성 시 입력한 비밀번호를 통해 본인 확인을 거쳐 게시글 및 답글의 수정/삭제가 가능하며, 비밀글, 좋아요 반응, 검색/정렬 기능 등 풍부한 UX 요소를 제공합니다.

---

## 2. 핵심 기능 요구사항 (Core Features)

### 2.1 익명 방명록 작성 (Guestbook Entry Creation)
- **익명 작성**: 닉네임, 비밀번호, 본문 내용 작성
- **비밀글 기능**: 비밀글 체크박스 선택 시, 비밀번호를 아는 사람만 내용 확인 가능 (모달을 통해 비밀번호 입력 후 잠금 해제)
- **타임스탬프**: 작성 일시 자동 기록 및 상대적 시간(예: 방금 전, 5분 전) / 절대 시간 표시
- **프로필 아바타**: 닉네임 기반 자동 생성 아바타 또는 스티커 선택 지원

### 2.2 방명록 수정 및 삭제 (Edit & Delete Entry)
- **비밀번호 검증**: 수정/삭제 시 모달 팝업에서 비밀번호 확인
- **수정 기능**: 비밀번호 일치 시 내용 수정 모드로 전환
- **삭제 기능**: 비밀번호 일치 시 해당 방명록 항목 및 달린 모든 답글 함께 삭제

### 2.3 답글(댓글) 시스템 (1단계 답글)
- **답글 작성**: 특정 방명록 항목 하단에 답글 작성 (닉네임, 비밀번호, 답글 본문)
- **답글 수정/삭제**: 답글 작성 시 설정한 비밀번호 입력 후 수정 및 삭제 기능 제공
- **답글 개수 카운트**: 각 방명록 카드에 작성된 답글 개수 바지(Badge) 표시

### 2.4 인터랙션 & 추가 기능 (Interactions & Optional Features)
- **공감 / 좋아요 버튼**: 방명록 글에 대해 하트/좋아요 카운트 증가 (로컬 저장)
- **검색 & 필터링**: 작성자(닉네임) 또는 본문 키워드 검색, 최신순/인기순/과거순 정렬
- **데이터 지속성**: 브라우저 LocalStorage 기반 데이터 저장 및 관리

---

## 3. UI/UX 디자인 명세 (Design Specifications)

- **디자인 테마**: 다크 모드 기반 세련된 글래스모피즘 (Glassmorphism & Neon Accent)
- **컬러 파렛트**: 
  - Background: Deep Slate Dark (`#0b0f19`, `#111827`)
  - Glass Card: Semi-transparent Backdrop Filter blur (`rgba(255, 255, 255, 0.05)`)
  - Accent Color: Electric Cyan / Purple Neon Gradient (`linear-gradient(135deg, #6366f1, #a855f7)`)
- **컴포넌트 구성을 위한 반응형 레이아웃**:
  - 상단 헤더 & 통계/검색 바
  - 방명록 입력 폼 카드
  - 방명록 카드 피드 목록
  - 비밀번호 입력 모달 팝업

---

## 4. 데이터 구조 (Data Schema)

```json
{
  "entries": [
    {
      "id": "entry-1723000000000",
      "author": "익명게스트",
      "passwordHash": "sha256_or_simple_hash",
      "content": "방명록 내용입니다.",
      "isPrivate": false,
      "likes": 5,
      "createdAt": "2026-08-08T09:56:00.000Z",
      "updatedAt": "2026-08-08T09:56:00.000Z",
      "replies": [
        {
          "id": "reply-1723000005000",
          "author": "답글작성자",
          "passwordHash": "sha256_or_simple_hash",
          "content": "감사합니다!",
          "createdAt": "2026-08-08T09:57:00.000Z"
        }
      ]
    }
  ]
}
```

---

## 5. 최종 확정 파라미터 (Final Decisions)
1. **저장소**: Browser LocalStorage
2. **디자인**: Glassmorphism Dark Mode
3. **답글 구조**: 1단계 계층 구조
4. **부가 기능**: 비밀글, 좋아요, 검색/정렬 지원
