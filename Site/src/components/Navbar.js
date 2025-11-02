import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      closeMenu();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav className="navbar" style={{ boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <div className="container">
        <div className="logo">
          <h2>AI Site</h2>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
          <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')}>홈</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>소개</a></li>
          <li><a href="#features" onClick={(e) => handleNavClick(e, '#features')}>기능</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>연락처</a></li>
        </ul>
        <div 
          className="hamburger" 
          id="hamburger"
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu();
            }
          }}
        >
          <span style={{ 
            transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' 
          }}></span>
          <span style={{ 
            opacity: isMenuOpen ? '0' : '1' 
          }}></span>
          <span style={{ 
            transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' 
          }}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

