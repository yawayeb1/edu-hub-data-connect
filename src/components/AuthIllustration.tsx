export function AuthIllustration() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Floating Checkmark */}
      <div className="absolute top-8 left-8 z-10">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 12L16 26L10 20"
              stroke="#6C2BD9"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Main Illustration */}
      <div className="relative w-full max-w-lg">
        <svg
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          {/* Pink Clouds */}
          <ellipse cx="150" cy="100" rx="80" ry="40" fill="#FFB6D9" opacity="0.6" />
          <ellipse cx="450" cy="120" rx="100" ry="50" fill="#FFB6D9" opacity="0.5" />
          <ellipse cx="300" cy="80" rx="70" ry="35" fill="#FFB6D9" opacity="0.4" />

          {/* Green Grass */}
          <rect x="0" y="550" width="600" height="50" fill="#7CB342" />

          {/* Brown Chair */}
          <rect x="200" y="350" width="200" height="20" fill="#8D6E63" rx="5" />
          <rect x="220" y="300" width="160" height="60" fill="#8D6E63" rx="5" />
          <rect x="200" y="360" width="20" height="100" fill="#6D4C41" />
          <rect x="380" y="360" width="20" height="100" fill="#6D4C41" />

          {/* Girl with Orange Hair */}
          {/* Head */}
          <circle cx="300" cy="200" r="50" fill="#FFB74D" />
          {/* Body */}
          <ellipse cx="300" cy="280" rx="60" ry="80" fill="#64B5F6" />
          {/* Arms */}
          <ellipse cx="240" cy="270" rx="25" ry="60" fill="#64B5F6" transform="rotate(-20 240 270)" />
          <ellipse cx="360" cy="270" rx="25" ry="60" fill="#64B5F6" transform="rotate(20 360 270)" />
          {/* Legs */}
          <rect x="280" y="360" width="20" height="80" fill="#64B5F6" rx="10" />
          <rect x="300" y="360" width="20" height="80" fill="#64B5F6" rx="10" />

          {/* Laptop */}
          <rect x="240" y="320" width="120" height="80" fill="#424242" rx="5" />
          <rect x="250" y="330" width="100" height="60" fill="#1E88E5" rx="3" />
          <line x1="240" y1="400" x2="360" y2="400" stroke="#424242" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}

