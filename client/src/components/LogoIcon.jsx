const LogoIcon = ({ className = "w-9 h-9" }) => {
    return (
        <div className={`relative flex items-center justify-center shrink-0 ${className} group`}>
            {/* 2027 Cyber Neon Backdrop Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-600 via-rose-500 to-cyan-400 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
            
            {/* 2027 Standard Futuristic Emblem */}
            <div className="relative w-full h-full bg-slate-950 p-1.5 rounded-2xl border border-pink-400/40 shadow-xl flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform group-hover:scale-110 transition-transform duration-300">
                    <defs>
                        <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="50%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>

                    {/* Outer 2027 Hex-Shield */}
                    <path 
                        d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z" 
                        fill="url(#cyberGrad1)" 
                        opacity="0.9"
                    />

                    {/* Cyber Tech Intersecting Lines */}
                    <path 
                        d="M12 15H24C26 15 27.5 16.5 27.5 18.5C27.5 20.5 26 22 24 22H16C14 22 12.5 23.5 12.5 25.5C12.5 27.5 14 29 16 29H28" 
                        stroke="white" 
                        strokeWidth="3.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />

                    {/* Neon Energy Core */}
                    <circle cx="20" cy="22" r="2.5" fill="url(#cyberGrad2)" />
                </svg>
            </div>
        </div>
    );
};

export default LogoIcon;
