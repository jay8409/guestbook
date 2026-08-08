# 익명 방명록 웹 애플리케이션 RESTful API 명세서 (API Documentation)

**버전**: v1.0  
**기반 규격**: REST API (JSON Format)  
**기본 URL (Base URL)**: `http://localhost:8080/api/v1` (예시)

---

## 1. 공통 사양 (Common Specifications)

### 1.1 Content-Type
모든 요청(Request) 및 응답(Response) 본문은 `application/json` 포맷을 사용합니다.

### 1.2 HTTP 상태 코드 (HTTP Status Codes)
| 코드 | 상태 | 설명 |
| :--- | :--- | :--- |
| `200 OK` | 성공 | 요청 처리 성공 |
| `201 Created` | 생성됨 | 새 리소스(글/답글) 생성 완료 |
| `400 Bad Request` | 잘못된 요청 | 필수 파라미터 누락 또는 유효성 검사 실패 |
| `401 Unauthorized` | 인증 실패 | 비밀번호 불일치로 인한 수정/삭제 거부 |
| `404 Not Found` | 리소스 없음 | 해당 ID의 게시글 또는 답글이 존재하지 않음 |
| `500 Internal Server Error` | 서버 오류 | 서버 내부 장애 발생 |

---

## 2. 데이터 스키마 (Data Schemas)

### 2.1 Guestbook Entry (방명록 항목)
```json
{
  "id": "entry-1723000000000",
  "author": "익명게스트",
  "avatar": "🚀",
  "content": "방명록 내용입니다.",
  "isPrivate": false,
  "likes": 5,
  "createdAt": "2026-08-08T09:56:00.000Z",
  "replies": []
}
```

### 2.2 Reply (답글 항목)
```json
{
  "id": "reply-1723000005000",
  "author": "답글작성자",
  "content": "답글 내용입니다.",
  "createdAt": "2026-08-08T09:57:00.000Z"
}
```

---

## 3. 방명록 API (Guestbook Entries Endpoints)

### 3.1 방명록 목록 조회 (GET /api/v1/entries)
등록된 방명록 목록을 조회합니다. 검색어 필터링 및 정렬 옵션을 지원합니다.

- **Query Parameters**:
  - `search` (optional, string): 작성자 또는 본문 검색 키워드
  - `sort` (optional, string): 정렬 기준 (`latest` (기본값), `oldest`, `popular`)
  - `page` (optional, number): 페이지 번호 (기본값: 1)
  - `limit` (optional, number): 페이지당 개수 (기본값: 20)

- **Response (200 OK)**:
```json
{
  "status": "success",
  "total": 3,
  "data": [
    {
      "id": "entry-seed-1",
      "author": "민우",
      "avatar": "🎨",
      "content": "우연히 방문했는데 글래스모피즘 디자인이 정말 세련되고 예쁘네요!",
      "isPrivate": false,
      "likes": 12,
      "createdAt": "2026-08-08T04:56:00.000Z",
      "replyCount": 1,
      "replies": [
        {
          "id": "reply-seed-1-1",
          "author": "방장",
          "content": "방문해주셔서 감사합니다 민우님!",
          "createdAt": "2026-08-08T06:56:00.000Z"
        }
      ]
    },
    {
      "id": "entry-seed-2",
      "author": "시크릿게스트",
      "avatar": "👾",
      "content": "비밀글입니다.",
      "isPrivate": true,
      "likes": 5,
      "createdAt": "2026-08-07T09:56:00.000Z",
      "replyCount": 0,
      "replies": []
    }
  ]
}
```

---

### 3.2 단일 방명록 조회 / 비밀글 해제 (POST /api/v1/entries/:id/unlock)
비밀글인 방명록의 비밀번호를 확인하여 본문을 조회합니다.

- **Request Body**:
```json
{
  "password": "작성시설정한비밀번호"
}
```

- **Response (200 OK - 성공 시)**:
```json
{
  "status": "success",
  "data": {
    "id": "entry-seed-2",
    "author": "시크릿게스트",
    "avatar": "👾",
    "content": "이 글은 원래 비밀글의 실제 본문 내용입니다!",
    "isPrivate": true,
    "likes": 5,
    "createdAt": "2026-08-07T09:56:00.000Z"
  }
}
```

- **Response (401 Unauthorized - 비밀번호 불일치 시)**:
```json
{
  "status": "error",
  "message": "비밀번호가 일치하지 않습니다."
}
```

---

### 3.3 방명록 작성 (POST /api/v1/entries)
새로운 익명 방명록을 작성합니다.

- **Request Body**:
```json
{
  "author": "홍길동",
  "password": "password1234",
  "avatar": "🚀",
  "content": "방명록 남기고 갑니다!",
  "isPrivate": false
}
```

- **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "방명록이 등록되었습니다.",
  "data": {
    "id": "entry-1723001234567",
    "author": "홍길동",
    "avatar": "🚀",
    "content": "방명록 남기고 갑니다!",
    "isPrivate": false,
    "likes": 0,
    "createdAt": "2026-08-08T10:00:00.000Z",
    "replies": []
  }
}
```

---

### 3.4 방명록 수정 (PUT /api/v1/entries/:id)
비밀번호 검증 후 작성한 방명록의 내용을 수정합니다.

- **Request Body**:
```json
{
  "password": "password1234",
  "content": "수정된 방명록 내용입니다."
}
```

- **Response (200 OK - 성공 시)**:
```json
{
  "status": "success",
  "message": "방명록이 수정되었습니다.",
  "data": {
    "id": "entry-1723001234567",
    "content": "수정된 방명록 내용입니다.",
    "updatedAt": "2026-08-08T10:05:00.000Z"
  }
}
```

- **Response (401 Unauthorized - 비밀번호 불일치 시)**:
```json
{
  "status": "error",
  "message": "비밀번호가 일치하지 않아 수정할 수 없습니다."
}
```

---

### 3.5 방명록 삭제 (DELETE /api/v1/entries/:id)
비밀번호 검증 후 해당 방명록 항목과 포함된 답글을 삭제합니다.

- **Request Body**:
```json
{
  "password": "password1234"
}
```

- **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "방명록이 정상적으로 삭제되었습니다."
}
```

---

### 3.6 방명록 좋아요/공감 토글 (POST /api/v1/entries/:id/like)
특정 방명록에 대한 좋아요 수를 1 증가 또는 감소시킵니다.

- **Response (200 OK)**:
```json
{
  "status": "success",
  "likes": 13,
  "liked": true
}
```

---

## 4. 답글 API (Replies Endpoints)

### 4.1 답글 작성 (POST /api/v1/entries/:entryId/replies)
특정 방명록 글에 답글을 추가합니다.

- **Request Body**:
```json
{
  "author": "답글이",
  "password": "replypassword123",
  "content": "좋은 글이네요! 공감합니다."
}
```

- **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "답글이 등록되었습니다.",
  "data": {
    "id": "reply-1723005555555",
    "author": "답글이",
    "content": "좋은 글이네요! 공감합니다.",
    "createdAt": "2026-08-08T10:10:00.000Z"
  }
}
```

---

### 4.2 답글 수정 (PUT /api/v1/entries/:entryId/replies/:replyId)
비밀번호 검증 후 답글 내용을 수정합니다.

- **Request Body**:
```json
{
  "password": "replypassword123",
  "content": "수정된 답글 내용입니다."
}
```

- **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "답글이 수정되었습니다."
}
```

---

### 4.3 답글 삭제 (DELETE /api/v1/entries/:entryId/replies/:replyId)
비밀번호 검증 후 특정 답글을 삭제합니다.

- **Request Body**:
```json
{
  "password": "replypassword123"
}
```

- **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "답글이 삭제되었습니다."
}
```
