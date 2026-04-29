import { useEffect, useState } from 'react';
import './PageTransition.css';

export default function PageTransition({ children, className = '' }) {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setShouldRender(true);
    setIsExiting(false);
  }, [children]);

  const handleAnimationEnd = () => {
    if (isExiting) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`page-transition-container ${isExiting ? 'page-exit' : 'page-enter'} ${className}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
