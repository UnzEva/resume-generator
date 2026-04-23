import ResumeGenerator from "./components/ResumeGenerator";
import { ThemeProvider } from "@mui/material";

import { animeTheme, parisTheme, cabinTheme, glassTheme, zenTheme, cyberpunkTheme, grandmasKitchenTheme } from "./themes/themes";

const themeMap = {
  anime: animeTheme,
  paris: parisTheme,
  cabin: cabinTheme,
  glass: glassTheme,
  zen: zenTheme,
  cyber: cyberpunkTheme,
  kitchen: grandmasKitchenTheme

};

function App() {
  const mode = "kitchen"; // можно из state

  return (
    <ThemeProvider theme={themeMap[mode]}>
      <ResumeGenerator />
    </ThemeProvider>
    );
}

export default App;
