import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Lottie from "lottie-react";
import logo from "../animations/logo.json";

const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: "#4484c4" }}>
        <Toolbar
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }} // adjust marginLeft
          >
            RouteOpti4Me
          </Typography>
          <Lottie
            animationData={logo}
            style={{ width: "150px", cursor: "pointer" }}
            loop={false}
            onClick={() => {
              window.location.reload();
            }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
