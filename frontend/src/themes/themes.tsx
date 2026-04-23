import { createTheme } from "@mui/material/styles";

//1. Anime стиль (легкость + неон + эмоции)
export const animeTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF6EC7" },
    secondary: { main: "#6C63FF" },
    background: { default: "#0F172A" },
  },
  typography: {
    fontFamily: "'Poppins', 'Comic Sans MS', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          boxShadow: "0 0 15px rgba(255,110,199,0.6)",
          textTransform: "none",
        },
      },
    },
  },
});

//2. Парижский флирт (Emily in Paris vibe)
export const parisTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#E63946" },
      secondary: { main: "#1D3557" },
      background: { default: "#FFF8F0" },
    },
    typography: {
      fontFamily: "'Playfair Display', serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontStyle: "italic",
            textTransform: "none",
          },
        },
      },
    },
  });

//3. Бревенчатый дом (rustic / cozy)
export const cabinTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#7F5539" },
        secondary: { main: "#6B705C" },
        background: { default: "#F0EAD2" },
      },
      typography: {
        fontFamily: "'Roboto Slab', serif",
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          },
        },
      },
    });

   // 4. Cyberpunk (неон + high-tech + “матрица”)


export const cyberpunkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00FFFF" },
    secondary: { main: "#FF00FF" },
    background: { default: "#0A0A0A" },
  },
  typography: {
    fontFamily: "'Orbitron', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: "1px solid #00FFFF",
          borderRadius: "4px",
          textTransform: "uppercase",
          boxShadow: "0 0 10px #00FFFF",
        },
      },
    },
  },
});

//5. Zen / Dao (минимализм + поток)

export const zenTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4A7C59" },
    secondary: { main: "#A3B18A" },
    background: { default: "#F8F9F6" },
  },
  typography: {
    fontFamily: "'Noto Serif', serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "none",
          border: "1px solid #E0E0E0",
        },
      },
    },
  },
});


// 6. Glassmorphism (современный iOS/AI стиль)

export const glassTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3A86FF" },
    secondary: { main: "#8338EC" },
    background: { default: "#EAF4FF" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.3)",
        },
      },
    },
  },
});

// 7. My style
export const grandmasKitchenTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#C17A4A" },   
    secondary: { main: "#EED9B7" },  
    background: {
      default: "#FDF8F0",            
      paper: "#FFF9EF",             
    },
  },
  typography: {
    fontFamily: "'Crimson Text', 'Georgia', serif", 
    h1: { fontWeight: 500 },
    body1: { fontSize: "1.1rem", lineHeight: 1.5 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "32px",          
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)", 
          border: "1px solid #F3E5D8",   
          backgroundColor: "#FFF9EF",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "40px",           
          textTransform: "none",          
          padding: "8px 24px",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",        
        },
      },
    },
  },
});



