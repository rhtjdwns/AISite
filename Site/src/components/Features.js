import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const featureRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    featureRefs.current.forEach(el => {
      if (el) {
        el.classList.add('fade-in');
        observer.observe(el);
      }
    });

    return () => {
      featureRefs.current.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const features = [
    { icon: '🤖', title: '스마트 AI', description: '고급 머신러닝 알고리즘으로 지능적인 솔루션을 제공합니다.' },
    { icon: '⚡', title: '빠른 처리', description: '최적화된 시스템으로 즉각적인 결과를 제공합니다.' },
    { icon: '🔒', title: '안전한 보안', description: '최고 수준의 보안으로 데이터를 안전하게 보호합니다.' },
    { icon: '📊', title: '데이터 분석', description: '실시간 데이터 분석으로 인사이트를 제공합니다.' },
    { icon: '🌐', title: '반응형 디자인', description: '모든 기기에서 완벽하게 작동하는 반응형 인터페이스입니다.' },
    { icon: '💡', title: '사용자 친화적', description: '직관적인 UI/UX로 누구나 쉽게 사용할 수 있습니다.' }
  ];

  const handleFeatureClick = (feature) => {
    if (feature.title === '스마트 AI') {
      navigate('/chat');
    } else {
      console.log(`${feature.title} 기능 클릭됨`);
    }
  };

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">주요 기능</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <button
              key={index}
              className="feature-button fade-in"
              ref={el => featureRefs.current[index] = el}
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

