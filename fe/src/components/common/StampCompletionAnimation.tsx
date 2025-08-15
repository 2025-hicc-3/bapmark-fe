import React, { useState, useEffect } from 'react';
import SplitText from './SplitText';

interface StampCompletionAnimationProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const StampCompletionAnimation: React.FC<StampCompletionAnimationProps> = ({
  isVisible,
  onAnimationComplete,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      // 애니메이션 완료 후 자동으로 숨기기
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onAnimationComplete?.();
      }, 4000); // 4초 후 사라짐

      return () => clearTimeout(timer);
    } else {
      // isVisible이 false가 되면 애니메이션도 즉시 숨기기
      setShowAnimation(false);
    }
  }, [isVisible]); // onAnimationComplete 의존성 제거

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10001] pointer-events-none">
      <div className="bg-black bg-opacity-50 rounded-3xl p-8 backdrop-blur-sm">
        <SplitText
          text="스탬프 완성!"
          className="text-4xl font-bold text-white text-center"
          delay={150}
          duration={0.6}
          ease="back.out(1.7)"
          splitType="chars"
          from={{ opacity: 0, y: 60, scale: 0.5, rotation: -180 }}
          to={{ opacity: 1, y: 0, scale: 1, rotation: 0 }}
          threshold={0.1}
          rootMargin="-50px"
          textAlign="center"
          onLetterAnimationComplete={() => {
            console.log('스탬프 완성 애니메이션 완료!');
          }}
        />
      </div>
    </div>
  );
};

export default StampCompletionAnimation;
