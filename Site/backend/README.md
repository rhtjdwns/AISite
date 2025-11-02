# AI Chat Backend

Google Gemini API를 사용하는 AI 채팅 백엔드 서버입니다.

## 설치

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`env.example.env` 파일을 복사하여 `.env` 파일을 생성하고 API 키를 설정하세요.

```bash
cp env.example.env .env
```

`.env` 파일에 다음 내용을 추가하세요:
```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

Google Gemini API 키 발급: https://makersuite.google.com/app/apikey

## 실행

### 개발 모드 (nodemon 사용):
```bash
npm run dev
```

### 프로덕션 모드:
```bash
npm start
```

서버는 기본적으로 포트 5000에서 실행됩니다.

## API 엔드포인트

### POST /api/chat
AI 채팅 메시지를 전송합니다.

**요청 본문:**
```json
{
  "message": "안녕하세요",
  "sessionId": "session_1234567890" // 선택사항
}
```

**응답:**
```json
{
  "response": "안녕하세요! 무엇을 도와드릴까요?",
  "sessionId": "session_1234567890"
}
```

### POST /api/chat/reset
채팅 세션 히스토리를 초기화합니다.

**요청 본문:**
```json
{
  "sessionId": "session_1234567890"
}
```

### GET /api/health
서버 상태를 확인합니다.

**응답:**
```json
{
  "status": "ok",
  "message": "서버가 정상적으로 실행 중입니다."
}
```

## 참고사항

- 채팅 히스토리는 메모리에 저장되며, 최근 20개의 대화만 유지됩니다.
- 실제 프로덕션 환경에서는 데이터베이스를 사용하여 히스토리를 저장하는 것을 권장합니다.

