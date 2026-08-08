# 🔮 Glass Guestbook (글래스모피즘 익명 방명록)

> 회원가입 없이 누구나 자유롭게 메시지를 남기고 답글을 달 수 있는 세련된 글래스모피즘 웹 방명록입니다.

---

## 🌟 주요 기능 (Key Features)

- **익명 작성 & 프로필 아바타**: 닉네임과 8종 이모지 아바타를 선택하여 회원가입 없이 방명록 작성
- **비밀번호 기반 수정 & 삭제**: 작성 시 설정한 비밀번호(SHA-256 암호화 검증)를 통해 게시글 및 답글 수정/삭제 가능
- **비밀글 지원**: 비밀글 선택 시 본문이 잠금 마스킹 처리되며, 작성 시 설정한 비밀번호 입력 후 해제하여 조회 가능
- **1단계 답글 (댓글) 시스템**: 각 방명록마다 독립된 답글 작성 및 답글 수정/삭제 지원
- **공감 / 좋아요 버블**: 방명록에 대해 하트 반응 클릭 및 실시간 공감 카운트 증가
- **검색 및 정렬**: 작성자 닉네임 또는 본문 키워드 실시간 검색 및 최신순 / 오래된순 / 인기순 정렬
- **글래스모피즘 UI**: 은은한 3D 앰비언트 글로우 애니메이션과 유리 질감 카드 디자인
- **LocalStorage 싱크**: 브라우저 내 로컬 저장소를 활용하여 서버 없이도 영구 데이터 보관

---

## 📁 프로젝트 구조 (Project Structure)

```text
guestbook/
├── index.html            # 방명록 웹 메인 레이아웃 & 모달 팝업
├── styles.css            # 글래스모피즘 다크 모드 CSS 디자인 시스템
├── app.js                # LocalStorage 싱크, SHA-256 비번 검증, 답글/검색/정렬 로직
├── docs/                 # 요구사항 및 API 문서
│   ├── requirements.md   # 요구사항 정의서 (Markdown)
│   ├── requirements.doc  # 요구사항 정의서 (Word 문서)
│   ├── api-spec.md       # CRUD API 명세서 (Markdown)
│   └── api-spec.doc      # CRUD API 명세서 (Word 문서)
└── README.md
```

---

## 🚀 실행 방법 (Getting Started)

별도의 백엔드 설치나 패키지 매니저 없이 `index.html` 파일을 브라우저에서 열거나 정적 웹 서버를 통해 실행할 수 있습니다.

```bash
# Python으로 로컬 서버 실행 시 (선택 사항)
python -m http.server 8080
```
접속 URL: `http://localhost:8080`

---

## 📄 문서 (Documentation)

- [요구사항 정의서 (Markdown)](docs/requirements.md)
- [요구사항 정의서 (Word 문서)](docs/requirements.doc)
- [RESTful CRUD API 명세서 (Markdown)](docs/api-spec.md)
- [RESTful CRUD API 명세서 (Word 문서)](docs/api-spec.doc)
