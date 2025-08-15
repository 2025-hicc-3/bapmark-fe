import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = lettersRef.current;
    if (letters.length === 0) return;

    // GSAP 애니메이션 설정
    const tl = gsap.timeline({
      onComplete: onLetterAnimationComplete,
    });

    // 각 글자에 애니메이션 적용
    letters.forEach((letter, index) => {
      tl.fromTo(
        letter,
        from,
        {
          ...to,
          duration,
          ease,
          delay: index * (delay / 1000), // delay를 초 단위로 변환
        },
        index * (delay / 1000)
      );
    });

    // Intersection Observer로 화면에 보일 때 애니메이션 시작
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tl.play();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      tl.kill();
    };
  }, [text]); // 의존성 배열을 text만으로 제한

  // 텍스트를 글자나 단어로 분할
  const splitText = () => {
    if (splitType === 'chars') {
      return text.split('').map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ));
    } else {
      return text.split(' ').map((word, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block mr-2"
        >
          {word}
        </span>
      ));
    }
  };

  return (
    <div ref={containerRef} className={className} style={{ textAlign }}>
      {splitText()}
    </div>
  );
};

export default SplitText;
