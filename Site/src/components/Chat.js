import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?', sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    setInputText('');

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 백엔드 API 호출
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();

      // 세션 ID 저장
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // AI 응답 추가
      const aiMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('채팅 오류:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '죄송합니다. 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_URL}/api/chat/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId })
        });
      } catch (error) {
        console.error('세션 리셋 오류:', error);
      }
    }
    setSessionId(null);
    setMessages([
      { id: 1, text: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?', sender: 'ai' }
    ]);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={handleBack}>
          ← 돌아가기
        </button>
        <h1 className="chat-title">AI 채팅</h1>
        <button className="reset-button" onClick={handleReset}>
          초기화
        </button>
      </div>
      
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.sender === 'ai' && (
                <div className="ai-avatar">🤖</div>
              )}
              <div className="message-text">{message.text}</div>
              {message.sender === 'user' && (
                <div className="user-avatar">👤</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">AI가 입력중...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          autoFocus
        />
        <button type="submit" className="send-button" disabled={isLoading}>
          {isLoading ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
};

export default Chat;

