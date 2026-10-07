import React from 'react';

/**
 * Handcrafted vector artwork and landmark illustrations inspired by Duolingo's world-class aesthetic.
 * Clean, bold lines, rich soft color palettes, zero AI artifacts.
 */

export const LandmarkIllustration: React.FC<{
  type: 'spain' | 'france' | 'germany' | 'japan' | 'korea' | 'italy';
  className?: string;
}> = ({ type, className = 'w-24 h-24' }) => {
  if (type === 'spain') {
    // Sagrada Família & Barcelona Sun
    return (
      <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#FEF3C7" />
        <circle cx="120" cy="50" r="18" fill="#FBBF24" opacity="0.8" />
        {/* Basilica Towers */}
        <path d="M50 130V65L60 50L70 65V130H50Z" fill="#F59E0B" />
        <path d="M68 130V45L80 30L92 45V130H68Z" fill="#D97706" />
        <path d="M90 130V65L100 50L110 65V130H90Z" fill="#F59E0B" />
        {/* Windows & Crosses */}
        <circle cx="60" cy="80" r="4" fill="#FEF3C7" />
        <circle cx="80" cy="65" r="5" fill="#FEF3C7" />
        <circle cx="100" cy="80" r="4" fill="#FEF3C7" />
        <rect x="78" y="22" width="4" height="10" fill="#B45309" />
        <rect x="74" y="25" width="12" height="4" fill="#B45309" />
        {/* Ground */}
        <path d="M20 130H140V142C140 142 110 148 80 148C50 148 20 142 20 142V130Z" fill="#D97706" />
      </svg>
    );
  }

  if (type === 'france') {
    // Eiffel Tower & Paris Clouds
    return (
      <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#E0E7FF" />
        {/* Clouds */}
        <path d="M25 60C25 54 30 50 36 50C38 42 46 38 54 40C60 42 63 46 64 50C70 50 74 54 74 60H25Z" fill="#EEF2FF" />
        {/* Eiffel Tower */}
        <path d="M78 24H82V40H78V24Z" fill="#3730A3" />
        <path d="M75 40H85L89 80H71L75 40Z" fill="#4338CA" />
        <path d="M66 80H94L105 130H90L85 96C85 96 82 92 80 92C78 92 75 96 75 96L70 130H55L66 80Z" fill="#4F46E5" />
        <rect x="68" y="78" width="24" height="6" rx="2" fill="#312E81" />
        <path d="M72 130C72 118 76 112 80 112C84 112 88 118 88 130H72Z" fill="#E0E7FF" />
        {/* Ground */}
        <rect x="25" y="130" width="110" height="12" rx="4" fill="#818CF8" />
      </svg>
    );
  }

  if (type === 'germany') {
    // Brandenburg Gate
    return (
      <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#FEF9C3" />
        {/* Quadriga Chariot */}
        <rect x="74" y="38" width="12" height="10" rx="3" fill="#854D0E" />
        <circle cx="80" cy="34" r="5" fill="#A16207" />
        {/* Roof entablature */}
        <rect x="35" y="48" width="90" height="12" rx="2" fill="#CA8A04" />
        {/* Columns */}
        <rect x="42" y="60" width="8" height="68" fill="#EAB308" />
        <rect x="56" y="60" width="8" height="68" fill="#EAB308" />
        <rect x="70" y="60" width="8" height="68" fill="#EAB308" />
        <rect x="82" y="60" width="8" height="68" fill="#EAB308" />
        <rect x="96" y="60" width="8" height="68" fill="#EAB308" />
        <rect x="110" y="60" width="8" height="68" fill="#EAB308" />
        {/* Ground */}
        <rect x="25" y="128" width="110" height="12" rx="4" fill="#A16207" />
      </svg>
    );
  }

  if (type === 'japan') {
    // Mount Fuji & Sakura
    return (
      <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#FCE7F3" />
        {/* Red Sun */}
        <circle cx="80" cy="62" r="26" fill="#F43F5E" opacity="0.9" />
        {/* Mt Fuji Base */}
        <path d="M25 135L65 60H95L135 135H25Z" fill="#3B82F6" />
        {/* Snow Cap */}
        <path d="M65 60L55 80L70 76L80 84L90 76L105 80L95 60H65Z" fill="#FFFFFF" />
        {/* Cherry blossom petal */}
        <circle cx="120" cy="40" r="5" fill="#FB7185" />
        <circle cx="132" cy="52" r="4" fill="#FDA4AF" />
        <circle cx="42" cy="48" r="4.5" fill="#FB7185" />
        {/* Ground */}
        <rect x="20" y="132" width="120" height="12" rx="4" fill="#1D4ED8" />
      </svg>
    );
  }

  if (type === 'korea') {
    // N Seoul Tower & Korean Pavilion
    return (
      <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#EDE9FE" />
        {/* Mountain */}
        <path d="M30 135C50 95 110 95 130 135H30Z" fill="#8B5CF6" />
        {/* Tower Spire */}
        <rect x="78" y="20" width="4" height="40" fill="#6D28D9" />
        <rect x="71" y="45" width="18" height="16" rx="4" fill="#7C3AED" />
        <rect x="76" y="61" width="8" height="45" fill="#5B21B6" />
        {/* Ground */}
        <rect x="25" y="132" width="110" height="12" rx="4" fill="#6D28D9" />
      </svg>
    );
  }

  // Italy: Colosseum
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="72" fill="#CCFBF1" />
      {/* Colosseum Wall */}
      <path d="M30 130V75C30 75 70 65 130 75V130H30Z" fill="#0D9488" />
      {/* Top Attic */}
      <path d="M32 75H128V84H32V75Z" fill="#042F2E" opacity="0.3" />
      {/* Arches row 1 */}
      <rect x="42" y="90" width="10" height="14" rx="5" fill="#F0FDFA" />
      <rect x="58" y="90" width="10" height="14" rx="5" fill="#F0FDFA" />
      <rect x="74" y="90" width="10" height="14" rx="5" fill="#F0FDFA" />
      <rect x="90" y="90" width="10" height="14" rx="5" fill="#F0FDFA" />
      <rect x="106" y="90" width="10" height="14" rx="5" fill="#F0FDFA" />
      {/* Arches row 2 */}
      <rect x="42" y="110" width="10" height="16" rx="5" fill="#F0FDFA" />
      <rect x="58" y="110" width="10" height="16" rx="5" fill="#F0FDFA" />
      <rect x="74" y="110" width="10" height="16" rx="5" fill="#F0FDFA" />
      <rect x="90" y="110" width="10" height="16" rx="5" fill="#F0FDFA" />
      <rect x="106" y="110" width="10" height="16" rx="5" fill="#F0FDFA" />
      {/* Ground */}
      <rect x="25" y="130" width="110" height="12" rx="4" fill="#0F766E" />
    </svg>
  );
};

export const TrophyPodiumIllustration: React.FC<{ className?: string }> = ({
  className = 'w-48 h-36',
}) => {
  return (
    <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stars in Sky */}
      <circle cx="40" cy="30" r="3" fill="#FBBF24" />
      <circle cx="200" cy="40" r="3" fill="#FBBF24" />
      <circle cx="120" cy="18" r="4" fill="#F59E0B" />

      {/* 2nd place block */}
      <rect x="30" y="90" width="60" height="80" rx="8" fill="#94A3B8" />
      <rect x="35" y="95" width="50" height="6" rx="2" fill="#CBD5E1" />
      <text x="60" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="bold">2</text>

      {/* 1st place block (tallest) */}
      <rect x="90" y="60" width="60" height="110" rx="8" fill="#F59E0B" />
      <rect x="95" y="65" width="50" height="6" rx="2" fill="#FDE68A" />
      <text x="120" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="34" fontWeight="black">1</text>
      {/* Crown on 1st place */}
      <path d="M106 42L112 52L120 40L128 52L134 42L132 56H108L106 42Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />

      {/* 3rd place block */}
      <rect x="150" y="110" width="60" height="60" rx="8" fill="#B45309" />
      <rect x="155" y="115" width="50" height="6" rx="2" fill="#FCD34D" opacity="0.6" />
      <text x="180" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="bold">3</text>
    </svg>
  );
};
