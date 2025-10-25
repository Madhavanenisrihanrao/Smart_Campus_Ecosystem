export default function KLLogo({ className = "h-10 w-10" }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer Gear Circle */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
        
        {/* Gear Teeth */}
        <g stroke="#1a1a1a" strokeWidth="1.5" fill="#1a1a1a">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <rect
              key={i}
              x="48"
              y="1"
              width="4"
              height="6"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        
        {/* Inner White Circle */}
        <circle cx="50" cy="50" r="40" fill="white" stroke="#8B0000" strokeWidth="2.5"/>
        
        {/* Red Circle Border */}
        <circle cx="50" cy="50" r="36" fill="white" stroke="#C41E3A" strokeWidth="1.5"/>
        
        {/* Industrial Symbols */}
        <g transform="translate(50, 50)">
          {/* Oil Derrick */}
          <g transform="translate(-15, -10)">
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#1a1a1a" strokeWidth="1.5"/>
            <line x1="3" y1="-10" x2="3" y2="10" stroke="#1a1a1a" strokeWidth="1.5"/>
            <line x1="-2" y1="-10" x2="5" y2="-10" stroke="#1a1a1a" strokeWidth="1.5"/>
            <line x1="-2" y1="10" x2="5" y2="10" stroke="#1a1a1a" strokeWidth="1.5"/>
            <line x1="1.5" y1="-15" x2="1.5" y2="-10" stroke="#C41E3A" strokeWidth="2"/>
          </g>
          
          {/* Factory Building */}
          <g transform="translate(5, -5)">
            <rect x="0" y="0" width="15" height="18" fill="#e0e0e0" stroke="#1a1a1a" strokeWidth="1.2"/>
            <rect x="2" y="3" width="4" height="5" fill="#87CEEB" stroke="#1a1a1a" strokeWidth="0.5"/>
            <rect x="9" y="3" width="4" height="5" fill="#87CEEB" stroke="#1a1a1a" strokeWidth="0.5"/>
            <rect x="2" y="10" width="4" height="5" fill="#87CEEB" stroke="#1a1a1a" strokeWidth="0.5"/>
            <rect x="9" y="10" width="4" height="5" fill="#87CEEB" stroke="#1a1a1a" strokeWidth="0.5"/>
          </g>
          
          {/* Gear Wheels */}
          <circle cx="-18" cy="8" r="6" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
          <circle cx="-18" cy="8" r="3" fill="white" stroke="#1a1a1a" strokeWidth="1"/>
          
          <circle cx="20" cy="8" r="6" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
          <circle cx="20" cy="8" r="3" fill="white" stroke="#1a1a1a" strokeWidth="1"/>
        </g>
        
        {/* KL Text - Larger and Bold */}
        <text x="76" y="52" fontSize="22" fontWeight="900" fill="#C41E3A" fontFamily="Arial, sans-serif">K</text>
        <text x="76" y="68" fontSize="20" fontWeight="900" fill="#C41E3A" fontFamily="Arial, sans-serif">L</text>
        
        {/* University Text */}
        <text x="50" y="92" fontSize="5.5" fontWeight="600" textAnchor="middle" fill="#1a1a1a" fontFamily="Arial, sans-serif">
          DEEMED TO BE UNIVERSITY
        </text>
      </svg>
    </div>
  )
}
