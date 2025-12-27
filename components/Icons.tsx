import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  LineChart, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Search,
  Share2,
  Linkedin,
  MessageCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  Edit,
  Save,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  PieChart,
  Calendar,
  X,
  ExternalLink,
  Info,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  Menu,
  Loader2,
  Lock,
  Plus,
  Clock,
  Tag,
  Eye,
  EyeOff,
  Trash2,
  Quote
} from 'lucide-react';

// Export standard Lucide icons
export const Icons = {
  ArrowRight, BarChart3, ShieldCheck, LineChart, CheckCircle2, ChevronDown, ChevronUp,
  Search, Share2, Linkedin, MessageCircle, FileText, LayoutDashboard, LogOut, Edit, Save,
  ArrowLeft, Briefcase, TrendingUp, PieChart, Calendar, X, ExternalLink, Info, RefreshCw,
  AlertTriangle, AlertCircle, Menu, Loader2, Lock, Plus, Clock, Tag, Eye, EyeOff, Trash2, Quote
};

// --- Custom Abstract Illustrations (SVG) ---

export const HeroIllustration = () => {
  // Chart Configuration
  const width = 600;
  const height = 400;
  // Increased top/right padding to prevent tooltip clipping
  const padding = { top: 100, right: 80, bottom: 60, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  
  // Grid Lines
  const horizontalLines = 4;
  const verticalLines = 6; // Representing months
  
  // Data Points (Normalized 0-1)
  const data = [0.2, 0.4, 0.35, 0.55, 0.65, 0.85];
  
  // Calculations
  const colWidth = graphWidth / verticalLines;
  const barWidth = colWidth * 0.4; // Bars take 40% of column width
  
  // Helper to get center X of a column
  const getColCenterX = (index: number) => padding.left + (index * colWidth) + (colWidth / 2);
  const getBarX = (index: number) => getColCenterX(index) - (barWidth / 2);
  const getY = (value: number) => padding.top + graphHeight - (value * graphHeight);

  // Line Path Points (Aligned to column centers)
  // We'll create a smooth curve through: Index 0, 2, 5
  // P1: (Col 0 Center, Value 0.25)
  // P2: (Col 2 Center, Value 0.5)
  // P3: (Col 5 Center, Value 0.9) - The Peak
  const p1 = { x: getColCenterX(0), y: getY(0.3) };
  const p2 = { x: getColCenterX(2), y: getY(0.45) };
  const p3 = { x: getColCenterX(5), y: getY(0.9) };

  return (
    <div className="w-full max-w-[600px] mx-auto perspective-1000 group">
      <motion.svg
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
        initial="hidden"
        animate="visible"
      >
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F2942" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0B1F3B" stopOpacity="0.95" />
          </linearGradient>
          
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#123B7A" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8A24A" />
            <stop offset="50%" stopColor="#FFD660" />
            <stop offset="100%" stopColor="#C8A24A" />
          </linearGradient>
          
          <linearGradient id="cardGradient2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="shadowDropdown" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* 1. Base Container Card */}
        <motion.rect 
          x="20" y="20" width={width - 40} height={height - 40} rx="24" 
          fill="url(#bgGradient)" 
          stroke="rgba(255,255,255,0.08)" 
          strokeWidth="1"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* 2. Grid System */}
        <g opacity="0.15">
           {/* Horizontal Lines */}
           {Array.from({ length: horizontalLines + 1 }).map((_, i) => {
             const y = padding.top + (i * (graphHeight / horizontalLines));
             return (
               <motion.line 
                 key={`h-${i}`} 
                 x1={padding.left} y1={y} x2={width - padding.right} y2={y} 
                 stroke="white" strokeWidth="1" strokeDasharray="4 4"
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: 1 }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 style={{ originX: 0 }}
               />
             );
           })}
           {/* Vertical Axis (Left) */}
           <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="white" strokeWidth="1" />
           {/* Horizontal Axis (Bottom) */}
           <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="white" strokeWidth="1" />
        </g>

        {/* 3. Bar Chart - Perfectly Centered */}
        <g>
          {data.map((value, i) => (
            <motion.rect
              key={`bar-${i}`}
              x={getBarX(i)}
              y={height - padding.bottom} // Start from bottom
              width={barWidth}
              height={0} // Initial height
              rx="4"
              fill="url(#barGradient)"
              variants={{
                hidden: { height: 0, y: height - padding.bottom, opacity: 0 },
                visible: {
                  height: value * graphHeight,
                  y: getY(value),
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.4 + (i * 0.1), ease: "easeOut" }
                }
              }}
            />
          ))}
        </g>

        {/* 4. Strategy Spline Line */}
        <motion.path
          d={`M ${p1.x} ${p1.y} C ${p1.x + 80} ${p1.y}, ${p2.x - 80} ${p2.y}, ${p2.x} ${p2.y} S ${p3.x - 80} ${p3.y}, ${p3.x} ${p3.y}`}
          fill="none"
          stroke="url(#goldStroke)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
        />

        {/* Points on Line */}
        {[p1, p2, p3].map((p, i) => (
           <motion.circle 
             key={`p-${i}`} 
             cx={p.x} cy={p.y} r="5" 
             fill="#0B1F3B" stroke="#FFC83D" strokeWidth="3"
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 2 + (i * 0.2), type: "spring" }}
           />
        ))}

        {/* 5. Floating Info Card (Tooltip) - Adjusted for safe area */}
        <motion.g
           initial={{ opacity: 0, y: 10, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ delay: 2.5, duration: 0.6, type: "spring" }}
        >
           {/* Anchor Line */}
           <line x1={p3.x} y1={p3.y} x2={p3.x} y2={p3.y - 30} stroke="#FFC83D" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
           
           {/* Card Container - Centered horizontally on p3.x */}
           <g transform={`translate(${p3.x - 85}, ${p3.y - 100})`}>
              {/* Card Shadow via filter or rect underneath */}
               <rect x="0" y="4" width="170" height="66" rx="14" fill="black" fillOpacity="0.2" filter="url(#softGlow)" />

              {/* Card Background */}
              <rect width="170" height="66" rx="14" fill="url(#cardGradient2)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              
              {/* Status Indicator */}
              <circle cx="20" cy="22" r="3" fill="#10B981" />
              <motion.circle 
                cx="20" cy="22" r="6" stroke="#10B981" strokeWidth="1" opacity="0.5"
                animate={{ r: [3, 10, 10], opacity: [0.8, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Label */}
              <text x="32" y="26" fill="#94A3B8" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">MARGEN NETO</text>
              
              {/* Value */}
              <text x="20" y="52" fill="#FFFFFF" fontSize="24" fontWeight="700" fontFamily="sans-serif" letterSpacing="-0.5">+35.4%</text>
              
              {/* Trend Tag */}
              <rect x="118" y="38" width="36" height="16" rx="4" fill="rgba(16, 185, 129, 0.15)" />
              <text x="136" y="49" fill="#10B981" fontSize="10" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">▲ Q3</text>
           </g>
        </motion.g>

        {/* Scanning Line Animation */}
        <motion.line
          x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom}
          stroke="url(#goldStroke)" strokeWidth="1" strokeOpacity="0.5"
          filter="url(#softGlow)"
          animate={{ x1: [padding.left, width - padding.right], x2: [padding.left, width - padding.right], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />

      </motion.svg>
    </div>
  );
};

export const EmptyStateIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-auto mx-auto opacity-60">
    <rect x="60" y="40" width="80" height="100" rx="8" fill="#F0F6FF" stroke="#E2E6ED" strokeWidth="2"/>
    <path d="M80 70H120" stroke="#C8A24A" strokeWidth="2" strokeLinecap="round"/>
    <path d="M80 90H110" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
    <path d="M80 110H100" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="150" cy="120" r="30" fill="white" stroke="#E2E6ED" strokeWidth="2"/>
    <path d="M140 120L148 128L160 112" stroke="#0B1F3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Helper for consistent small icons
export const IconWrapper: React.FC<{ icon: React.ReactNode; className?: string }> = ({ icon, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {icon}
  </div>
);
