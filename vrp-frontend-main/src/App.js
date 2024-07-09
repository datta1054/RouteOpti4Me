import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import NavBar from "./Components/NavBar";
import Home from "./Screens/Home";
import { createTheme, ThemeProvider } from "@mui/material";



function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ["Manrope"].join(","),
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
  });
  
  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
        <NavBar />
        {/* <Lottie
        style={{ position: "absolute",top:10, height: "100%", width: "99%" }}
        speed={0.01}
        animationData={background}
        loop={true}
      /> */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
    </ThemeProvider>
      </BrowserRouter>
  );
}

export default App;
