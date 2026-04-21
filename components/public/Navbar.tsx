// AVANT (remplacez ceci)
<Link href="/" className="flex items-center gap-3 group">
  <div className="w-10 h-10 rounded-full bg-vert flex items-center justify-center text-white font-heading font-bold text-lg">
    ☪
  </div>
  <div className="hidden sm:block">
    <span className="font-heading font-bold text-vert text-lg">AEAB</span>
    <span className="text-[10px] text-gray-500">Étudiants Algériens à Bordeaux</span>
  </div>
</Link>

// APRÈS (collez ceci)
<Link href="/" className="group">
  <svg width="180" height="50" viewBox="0 0 240 66" fill="none">
    <circle cx="33" cy="33" r="31" fill="#006233"/>
    <circle cx="33" cy="33" r="18" fill="white"/>
    <circle cx="40" cy="28" r="14.5" fill="#006233"/>
    <polygon fill="#D21034" points="29,21 30.5,26 35.5,26 31.5,29 33,34 29,31 25,34 26.5,29 22.5,26 27.5,26"/>
    <text x="74" y="30" fontFamily="'Playfair Display',serif" fontSize="24" fontWeight="800" fill="#006233" letterSpacing="3">AEAB</text>
    <text x="74" y="46" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="#6b7280">Étudiants Algériens à Bordeaux</text>
    <rect x="74" y="51" width="152" height="2.5" rx="1.25" fill="#D21034"/>
  </svg>
</Link>
