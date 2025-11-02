import React from 'react';

const Hero = () => {
  const handleCTAClick = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const offsetTop = featuresSection.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">AI의 미래를 경험하세요</h1>
          <p className="hero-subtitle">혁신적인 AI 기술로 새로운 가능성을 열어갑니다</p>
          <button className="cta-button" onClick={handleCTAClick}>시작하기</button>
        </div>
        <div className="hero-image">
          <div className="ai-animation"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

