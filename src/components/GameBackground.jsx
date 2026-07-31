import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// We define static positions scattered down the page to avoid page layout jumps
// We alternate between the single coin and double coin animations
const BACKGROUND_PARTICLES = [
  // Left Side - distributed with varied left offsets and larger sizes
  { type: 'single-coin', top: '8%', left: '3%', delay: '0.2s', duration: '5.5s', size: 68 },
  { type: 'double-coin', top: '18%', left: '11%', delay: '1.5s', duration: '6.8s', size: 88 },
  { type: 'single-coin', top: '32%', left: '1%', delay: '0.8s', duration: '7.5s', size: 76 },
  { type: 'double-coin', top: '48%', left: '14%', delay: '2.1s', duration: '5.8s', size: 84 },
  { type: 'single-coin', top: '65%', left: '4%', delay: '0.4s', duration: '6.2s', size: 72 },
  { type: 'double-coin', top: '78%', left: '9%', delay: '1.2s', duration: '8.2s', size: 92 },
  { type: 'single-coin', top: '90%', left: '2%', delay: '0.9s', duration: '5.9s', size: 78 },

  // Right Side - distributed with varied right offsets and larger sizes
  { type: 'double-coin', top: '12%', right: '7%', delay: '0.9s', duration: '6.0s', size: 86 },
  { type: 'single-coin', top: '25%', right: '13%', delay: '2.4s', duration: '7.8s', size: 70 },
  { type: 'double-coin', top: '40%', right: '2%', delay: '0.1s', duration: '5.4s', size: 88 },
  { type: 'single-coin', top: '56%', right: '11%', delay: '1.7s', duration: '7.0s', size: 74 },
  { type: 'double-coin', top: '70%', right: '5%', delay: '0.6s', duration: '8.0s', size: 84 },
  { type: 'single-coin', top: '84%', right: '15%', delay: '1.9s', duration: '5.7s', size: 78 },
  { type: 'double-coin', top: '95%', right: '3%', delay: '1.1s', duration: '6.6s', size: 90 },
];

export default function GameBackground() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide particles on small mobile screens to keep layout clean and readable
  const showParticles = windowWidth > 820;

  return (
    <>
      {/* Voxel grid backdrop base */}
      <div className="isometric-grid" />

      {/* Floating arcade items container */}
      {showParticles && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: -1,
          pointerEvents: 'none'
        }}>
          {BACKGROUND_PARTICLES.map((p, index) => {
            const particleStyle = {
              position: 'absolute',
              top: p.top,
              left: p.left,
              right: p.right,
              opacity: 0.45,
              animationDelay: p.delay,
              animationDuration: p.duration,
              filter: 'drop-shadow(2px 2px 0px #1a1a1a)'
            };

            return (
              <div 
                key={index} 
                className="float-anim" 
                style={particleStyle}
              >
                <DotLottieReact
                  src={p.type === 'single-coin' ? '/coin happily animation.lottie' : '/2-coin-happily-animation.lottie'}
                  loop
                  autoplay
                  style={{ width: p.size, height: p.size }}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
