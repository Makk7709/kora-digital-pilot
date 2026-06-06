import React from 'react';

const DigitalWave = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full" viewBox="0 0 1400 800" preserveAspectRatio="none">
        <defs>
          {/* Gradients simplifiés pour de meilleures performances */}
          <linearGradient id="waveGradient1" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waveGradient2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Vagues principales simplifiées */}
        <path
          d="M1500,350 Q1200,250 900,380 Q600,510 300,320 Q100,180 -200,280"
          stroke="url(#waveGradient1)"
          strokeWidth="2.5"
          fill="none"
          className="animate-wave-dilation-1"
        />

        <path
          d="M1600,280 Q1300,180 1000,310 Q700,440 400,250 Q200,110 -100,210"
          stroke="url(#waveGradient2)"
          strokeWidth="2"
          fill="none"
          className="animate-wave-dilation-2"
        />

        <path
          d="M1550,450 Q1250,350 950,480 Q650,610 350,420 Q150,280 -150,380"
          stroke="url(#waveGradient1)"
          strokeWidth="1.8"
          fill="none"
          className="animate-wave-dilation-3"
        />

        <path
          d="M1650,200 Q1350,100 1050,230 Q750,360 450,170 Q250,30 -50,130"
          stroke="url(#waveGradient2)"
          strokeWidth="1.5"
          fill="none"
          className="animate-wave-dilation-4"
        />

        {/* Zone de remplissage subtile */}
        <path
          d="M1500,350 Q1200,250 900,380 Q600,510 300,320 Q100,180 -200,280 L-200,800 L1500,800 Z"
          fill="url(#waveGradient1)"
          opacity="0.04"
          className="animate-wave-fill-dilation"
        />
      </svg>

      {/* Particules réduites pour de meilleures performances */}
      <div className="absolute inset-0">
        {[...new Array(8)].map((_, i) => (
          <div
            key={`row-${i}`}
            className="absolute w-1 h-1 bg-sky-300 rounded-full opacity-50"
            style={{
              right: `${10 + i * 10}%`,
              top: `${35 + Math.sin(i * 0.8) * 15}%`,
              animationDelay: `${i * 1}s`,
            }}
          >
            <div className="w-full h-full animate-particle-dilation" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalWave;
