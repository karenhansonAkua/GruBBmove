// Dark mode (default)
const darkTheme = {
  bg: "#0A0A0F", surface: "#13131A", card: "#1C1C28", border: "#2A2A3A",
  accent: "#FF6B2B", accentL: "#FF8C55", accentDim: "#FF6B2B18",
  green: "#22C55E", greenDim: "#22C55E18", blue: "#3B82F6", blueDim: "#3B82F618",
  purple: "#A855F7", purpleDim: "#A855F718", pink: "#EC4899", pinkDim: "#EC489918",
  yellow: "#F59E0B", yellowDim: "#F59E0B18",
  text: "#F0F0F5", muted: "#8888AA", dim: "#44445A",
};

// Light mode
const lightTheme = {
  bg: "#FFFFFF", surface: "#F5F5F7", card: "#FFFFFF", border: "#D8D8DD",
  accent: "#FF6B2B", accentL: "#FF8C55", accentDim: "#FF6B2B12",
  green: "#16A34A", greenDim: "#16A34A12", blue: "#2563EB", blueDim: "#2563EB12",
  purple: "#9333EA", purpleDim: "#9333EA12", pink: "#DB2777", pinkDim: "#DB277712",
  yellow: "#D97706", yellowDim: "#D9770612",
  text: "#1F2937", muted: "#6B7280", dim: "#9CA3AF",
};

export const getTheme = (isDark) => isDark ? darkTheme : lightTheme;
export const T = darkTheme;

export const HOSTELS = [
  "Mensah Sarbah Hall","Legon Hall","Commonwealth Hall","Volta Hall",
  "Akuafo Hall","Jubilee Hall","Other / Private Hostel"
];

export const SERVICES = [
  { id:"gas",      label:"Gas Refill",      emoji:"🔥", color:T.accent,  bg:T.accentDim,  desc:"Instant & scheduled cylinder refills",     path:"gas"      },
  { id:"laundry",  label:"Laundry",          emoji:"👕", color:T.blue,    bg:T.blueDim,    desc:"Pickup, wash & deliver to your room",       path:"laundry"  },
  { id:"moving",   label:"Hostel Moving",    emoji:"📦", color:T.purple,  bg:T.purpleDim,  desc:"Stress-free room-to-room moves",            path:"moving"   },
  { id:"groceries",label:"Groceries",        emoji:"🛒", color:T.green,   bg:T.greenDim,   desc:"Fresh items delivered fast",                path:"groceries"},
  { id:"pharmacy", label:"Pharmacy",         emoji:"💊", color:T.pink,    bg:T.pinkDim,    desc:"Medicines & health supplies",               path:"pharmacy" },
  { id:"delivery", label:"Quick Delivery",   emoji:"🚚", color:T.yellow,  bg:T.yellowDim,  desc:"Send or receive anything",                  path:"delivery" },
];

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
  .syne { font-family: 'Syne', sans-serif; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes slideUp  { from { transform:translateY(100%); opacity:0 } to { transform:translateY(0); opacity:1 } }
  @keyframes countdown-tick { 0% { transform:scale(1.12); color:#FF6B2B } 100% { transform:scale(1); color:inherit } }
  .fu  { animation: fadeUp  .45s ease both; }
  .fi  { animation: fadeIn  .35s ease both; }
  .su  { animation: slideUp .4s  ease both; }

  /* rest of global styles omitted for brevity... you can keep the rest here or move more to CSS files */
`;
