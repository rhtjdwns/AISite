import React, { useEffect, useRef } from 'react';

const About = () => {
  const statRefs = useRef([]);
  const aboutTextRef = useRef(null);

  useEffect(() => {
    const animateCounter = (element, target, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          element.textContent = formatNumber(target);
          clearInterval(timer);
        } else {
          element.textContent = formatNumber(Math.floor(start));
        }
      }, 16);
    };

    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K+';
      }
      return num.toString();
    };

    // about-text 요소를 위한 Intersection Observer
    const fadeObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, fadeObserverOptions);

    if (aboutTextRef.current) {
      fadeObserver.observe(aboutTextRef.current);
    }

    // 통계 카운터를 위한 Intersection Observer
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const statNumber = entry.target.querySelector('h3');
          if (statNumber) {
            const targetText = statNumber.textContent;
            const targetNum = parseFloat(targetText);
            
            if (!isNaN(targetNum)) {
              statNumber.textContent = '0';
              animateCounter(statNumber, targetNum);
              entry.target.dataset.animated = 'true';
            }
          }
        }
      });
    }, { threshold: 0.5 });

    statRefs.current.forEach(item => {
      if (item) statsObserver.observe(item);
    });

    return () => {
      if (aboutTextRef.current) {
        fadeObserver.unobserve(aboutTextRef.current);
      }
      statRefs.current.forEach(item => {
        if (item) statsObserver.unobserve(item);
      });
    };
  }, []);

  const stats = [
    { value: 10, unit: 'K+', label: '활성 사용자' },
    { value: 99.9, unit: '%', label: '서비스 가동률' },
    { value: 24, unit: '/7', label: '지원 서비스' }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">우리에 대해</h2>
        <div className="about-content">
          <div className="about-text fade-in" ref={aboutTextRef}>
            <p>최첨단 AI 기술을 통해 사용자에게 최고의 경험을 제공합니다.</p>
            <p>우리는 인공지능의 힘을 활용하여 복잡한 문제를 간단하게 해결하고, 일상생활을 더욱 편리하게 만듭니다.</p>
            <p>혁신적인 솔루션과 전문적인 팀으로 최고의 AI 서비스를 제공합니다.</p>
          </div>
          <div className="about-stats">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="stat-item fade-in"
                ref={el => statRefs.current[index] = el}
              >
                <h3>{stat.value}{stat.unit}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

