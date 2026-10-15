import React from 'react';

interface MascotProps {
  expression?: 'happy' | 'excited' | 'thinking' | 'celebrate' | 'sad';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  className?: string;
  interactive?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  expression = 'happy',
  size = 'md',
  speechBubble,
  className = '',
  interactive = true,
}) => {
  const [isWaving, setIsWaving] = React.useState(false);

  const sizeDimensions = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  }[size];

  const handleMascotClick = () => {
    if (!interactive) return;
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {speechBubble && (
        <div className="mb-2 relative bg-white border-2 border-indigo-100 rounded-2xl px-3.5 py-2 shadow-lg shadow-indigo-100/60 max-w-xs text-center animate-bounce-short">
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
            {speechBubble}
          </p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-indigo-100 rotate-45 transform" />
        </div>
      )}

      <div
        onClick={handleMascotClick}
        className={`${sizeDimensions} relative cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 group`}
        title={interactive ? 'Click to say hi to Loopi!' : undefined}
      >
        <svg
          role="img"
          aria-label="Loopi the LingoLoop mascot owl - friendly guide for language learning"
          viewBox="0 0 200 200"
          className={`w-full h-full filter drop-shadow-md transition-all ${
            isWaving ? 'animate-bounce' : 'animate-float'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow beneath */}
          <ellipse cx="100" cy="188" rx="55" ry="10" fill="#E2E8F0" opacity="0.8" />

          {/* Mascot Body Gradient & Silhouette */}
          <defs>
            <linearGradient id="loopiGradient" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="0.6" stopColor="#4F46E5" />
              <stop offset="1" stopColor="#3730A3" />
            </linearGradient>
            <linearGradient id="bellyGradient" x1="60" y1="80" x2="140" y2="170" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEF2FF" />
              <stop offset="1" stopColor="#C7D2FE" />
            </linearGradient>
            <linearGradient id="beakGradient" x1="90" y1="95" x2="110" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="ringGlow" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="1" stopColor="#818CF8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Halo Orbit Loop Ring (Distinctive LingoLoop signature branding) */}
          <ellipse
            cx="100"
            cy="45"
            rx="52"
            ry="18"
            stroke="url(#ringGlow)"
            strokeWidth="6"
            strokeDasharray="8 6"
            strokeLinecap="round"
            transform="rotate(-10 100 45)"
            className="animate-spin"
            style={{ transformOrigin: '100px 45px', animationDuration: '14s' }}
          />

          {/* Body */}
          <path
            d="M50 110C50 65 72 38 100 38C128 38 150 65 150 110C150 152 130 178 100 178C70 178 50 152 50 110Z"
            fill="url(#loopiGradient)"
          />

          {/* Ear Tufts / Crest Feathers */}
          <path d="M72 44C60 26 50 32 55 45C58 54 66 52 72 44Z" fill="#4338CA" />
          <path d="M128 44C140 26 150 32 145 45C142 54 134 52 128 44Z" fill="#4338CA" />

          {/* Belly */}
          <ellipse cx="100" cy="126" rx="36" ry="42" fill="url(#bellyGradient)" />

          {/* Wings */}
          {/* Left Wing */}
          <path
            d={
              isWaving || expression === 'celebrate'
                ? 'M54 90C34 70 20 60 25 82C29 98 46 116 54 118Z'
                : 'M52 95C40 106 36 130 46 142C52 136 56 122 56 106Z'
            }
            fill="#4338CA"
            className="transition-all duration-300"
          />
          {/* Right Wing */}
          <path
            d={
              expression === 'celebrate'
                ? 'M146 90C166 70 180 60 175 82C171 98 154 116 146 118Z'
                : 'M148 95C160 106 164 130 154 142C148 136 144 122 144 106Z'
            }
            fill="#4338CA"
          />

          {/* Eye Glasses / Goggles Frame (Scholar look) */}
          <ellipse cx="80" cy="85" rx="19" ry="20" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
          <ellipse cx="120" cy="85" rx="19" ry="20" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
          <path d="M99 85L101 85" stroke="#4338CA" strokeWidth="3" strokeLinecap="round" />

          {/* Pupils */}
          {expression === 'sad' ? (
            <>
              {/* Sad downward eyes */}
              <circle cx="80" cy="88" r="8" fill="#1E1B4B" />
              <circle cx="120" cy="88" r="8" fill="#1E1B4B" />
              <circle cx="78" cy="86" r="3" fill="#FFFFFF" />
              <circle cx="118" cy="86" r="3" fill="#FFFFFF" />
              {/* Teardrop */}
              <circle cx="138" cy="102" r="3" fill="#38BDF8" />
            </>
          ) : expression === 'celebrate' || expression === 'excited' ? (
            <>
              {/* Happy squint arcs */}
              <path d="M72 87C74 81 84 81 87 87" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
              <path d="M113 87C115 81 125 81 128 87" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Cheerful vibrant pupils with sparkling highlights */}
              <circle cx="82" cy="85" r="9" fill="#1E1B4B" />
              <circle cx="118" cy="85" r="9" fill="#1E1B4B" />
              <circle cx="85" cy="82" r="4" fill="#FFFFFF" />
              <circle cx="121" cy="82" r="4" fill="#FFFFFF" />
              <circle cx="80" cy="87" r="1.5" fill="#A5B4FC" />
              <circle cx="116" cy="87" r="1.5" fill="#A5B4FC" />
            </>
          )}

          {/* Cheerful Blush */}
          <ellipse cx="68" cy="98" rx="6" ry="3.5" fill="#F472B6" opacity="0.65" />
          <ellipse cx="132" cy="98" rx="6" ry="3.5" fill="#F472B6" opacity="0.65" />

          {/* Golden Beak */}
          <polygon points="100,94 92,106 108,106" fill="url(#beakGradient)" />
          {expression === 'excited' && (
            <polygon points="100,107 94,113 106,113" fill="#EF4444" />
          )}

          {/* Feet */}
          <path d="M82 174C82 182 76 184 72 184" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M88 174C88 183 85 185 82 185" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M118 174C118 182 112 184 108 184" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M124 174C124 183 121 185 118 185" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />

          {/* Sparkles on Celebrate */}
          {expression === 'celebrate' && (
            <>
              <path d="M30 40L35 45L40 40L35 35Z" fill="#FBBF24" />
              <path d="M165 35L170 40L175 35L170 30Z" fill="#38BDF8" />
              <path d="M170 120L173 124L177 120L173 116Z" fill="#EC4899" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
