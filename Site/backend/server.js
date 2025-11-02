const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// 채팅 히스토리를 저장할 객체 (실제 프로덕션에서는 DB 사용 권장)
const chatHistories = {};

// 채팅 엔드포인트
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: '메시지가 필요합니다.' 
      });
    }

    // 세션 ID가 없으면 새로 생성
    const currentSessionId = sessionId || `session_${Date.now()}`;

    // 기존 대화 히스토리 가져오기
    if (!chatHistories[currentSessionId]) {
      chatHistories[currentSessionId] = [];
    }

    const history = chatHistories[currentSessionId];

    // 사용자 메시지 추가
    history.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Gemini API 호출
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.parts
      })),
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // AI 응답을 히스토리에 추가
    history.push({
      role: 'model',
      parts: [{ text: text }]
    });

    // 히스토리 길이 제한 (최근 100개 대화만 유지)
    if (history.length > 100) {
      chatHistories[currentSessionId] = history.slice(-20);
    }

    res.json({
      response: text,
      sessionId: currentSessionId
    });

  } catch (error) {
    console.error('Gemini API 오류:', error);
    res.status(500).json({ 
      error: 'AI 응답 생성 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 세션 히스토리 초기화 엔드포인트
app.post('/api/chat/reset', (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && chatHistories[sessionId]) {
    delete chatHistories[sessionId];
  }
  
  res.json({ 
    success: true, 
    message: '대화 히스토리가 초기화되었습니다.' 
  });
});

// 건강 확인 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '서버가 정상적으로 실행 중입니다.' 
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  경고: GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.');
  }
});
